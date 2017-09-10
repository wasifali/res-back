var mongoose  = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = function(){
    var mongoose  = require('mongoose');

    var RestaurantSchema = new mongoose.Schema({
        name: { type: String, required: true, default:''},
        image: { type: String, required: true, default:''},
        address:{type: String, required: true, default:''},
        loc: {
            type: { type: String }
            , coordinates: []
        },
        type: { type: String, default:''},
        deletedAt: { type: Date},
        deleted: {type: Boolean, default: false, es_indexed:true},
        updatedAt: { type: Date, 'default': Date.now},
        activatedAt: { type: Date, 'default': Date.now},
        createdAt: { type: Date,'default': Date.now}
    });

    RestaurantSchema.index({ loc: 'Point' });
    return mongoose.model('Restaurant', RestaurantSchema);
};