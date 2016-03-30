var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({    
    cedula: Number,
    nombre: String,
    cuenta: String,
    password: String
});

mongoose.model('usuarios',usuarioSchema);


