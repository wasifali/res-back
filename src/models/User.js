/**
 * Created by macbookpro on 2/18/16.
 */


var mongoose  = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = function(){
    var mongoose  = require('mongoose');

    var UserSchema = new mongoose.Schema({
        userName: { type: String,default:''},
        password: { type: String, default:''},
        //forgotPassword: { type: String,default:''},
        //token: { type: String,default:''},
        //type: { type: String,default:''},
        //email:{type: String,default:''},
        //deletedAt: { type: Date},
        //deleted: {type: Boolean, required: true, default: false, es_indexed:true},
        //updatedAt: { type: Date, required: true, 'default': Date.now},
        //adminBlock: { type: Boolean, required: true, 'default': true },
        //profile_active: { type: Boolean, required: true, 'default': false },
        //activatedAt: { type: Date},
        //createdAt: { type: Date,'default': Date.now}
    });

    return mongoose.model('User', UserSchema);
};


