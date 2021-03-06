const mongoose = require('mongoose'); 
const slug = require('slugs');

mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name !',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now, 
  } ,
  location: {
    type: { 
      type: String,
      default: 'Point'
      },   
    coordinates: [
      {
      type: Number,
      required: 'You must supply coordinates'
      }
    ],
    address: {
      type: String,
      required: 'You must supply an adress'
    }, 
  },
  photo: String, 
})

storeSchema.pre('save', async function(next){

  if(!this.isModified('name')){
    next();
    return ;
  }
  
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlugs = await this.constructor.find({slug:slugRegEx});
  if(storesWithSlugs.length){
    this.slug = `${this.slug}-${storesWithSlugs.length+1}`;
  }
  next();
})

storeSchema.statics.getTagsList = function(){
  return this.aggregate([
    {$unwind: '$tags'},
    {$group: {_id: '$tags', count: {$sum: 1} }},
    {$sort: {count: -1}}
  ]);
}

module.exports = mongoose.model('Store', storeSchema)