var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//load all files in models dir
//cargar todos los modelos
fs.readdirSync(__dirname + '/models').forEach(function(filename){
    if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//cargar tabla de usuarios
app.use('/users', function(req, res){
    //ahi va el nombre de la tabla
    mongoose.model('usuarios').find(function(err, users){
        res.render('usuarios',{title:'tabla de usuarios',
    usuarios: users});
    });
});
//buscar usuario
app.get('/find-user/:id', function(req, res){
    mongoose.model('usuarios').find({_id:req.params.id},function(err, users){
        res.render('editusers',{title:'tabla de usuarios',
        usuarios: users});
    });
});
//modificar usuario
app.post('/find-user/:id', function(req, res){
    var uid = req.params.id ||'';
    var cedula = req.body.cedula ||'';
    var nombre = req.body.nombre ||'';
    var cuenta = req.body.cuenta ||'';
    var password = req.body.password ||'';
    
    if((nombre==='')||(cedula==='')||(cuenta==='')||(password==='')){
        console.log('ERROR: hay campos vacios');
        return res.send('hay campos vacios, revise');
    }
    if(isNaN(cedula)){
        console.log('ERROR: la cedula no puede contener texto');
        return res.send('La cedula no debe contener letras')
    }
    mongoose.model('usuarios').findOneAndUpdate({_id:uid},{
        cedula: cedula,
        nombre: nombre,
        cuenta: cuenta,
        password: password
    },function(err, user){
        if(err){
            throw err;
        }
        res.redirect('/users/');
    });
});

//eliminar usuarios
app.get('/delete-user/:id', function(req, res){
    mongoose.model('usuarios').findOneAndRemove({_id:req.params.id},function(err){
            if(err) throw err;
            return res.redirect('/users/');
    });
});

//agregar usuarios
app.use('/new-user/', function(req, res){
    if(req.method === 'GET'){
        return res.render('createuser',{title: 'Nuevo usuario'});
    }else if(req.method === 'POST'){
        var cedula = req.body.cedula || '';
        var nombre = req.body.nombre || '';
        var cuenta = req.body.cuenta || '';
        var clave = req.body.password || '';
        if((nombre === '')||(cuenta === '')||(clave === '')){
            return res.send('debe llenar todos los campos');
        }
        if(isNaN(cedula)){
            return res.send('la cedula no debe contener numeros');
        }
        var newUsuario = mongoose.model('usuarios')({
            cedula : cedula,
            nombre : nombre,
            cuenta : cuenta,
            password : clave
        });
        newUsuario.save(function(err){
            if(err) throw err;
            
            return res.redirect('/users/');
        });
        
    }
});
//cargar posts
app.use('/posts', function(req, res){
    mongoose.model('posts').find(function(err, posts){
        res.render('posts',{title:'POSTS',
        posts: posts});
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    //coneccion a la base de datos
  mongoose.connect('mongodb://localhost/prueba');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
