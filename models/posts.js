var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({    
    usuario: Number,
    nombre: String,
    post: String
});

mongoose.model('posts',postsSchema);
