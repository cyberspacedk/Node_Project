
const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null,true)
    }else{
      next({message:'That file isnt allowed'}, false)
    }
  } 
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next)=>{
  if(!req.file){
    next();
    return;
  }  
 const extension = req.file.mimetype.split('/')[1];
// unique name
 req.body.photo = `${uuid.v4()}.${extension}`;
// resize photo
 const photo = await jimp.read(req.file.buffer);
 await photo.resize(800, jimp.AUTO);
 await photo.write(`./public/uploads/${req.body.photo}`);
 next();
};

exports.homePage = (req,res) => {
console.log(req.name);
  res.render('index'); 
}

exports.addStore = (req,res) => {
  res.render('editstore',{title: 'You are on page Add store'} )
}

exports.createStore = async (req,res)=>{ 
 const store = await (new Store(req.body)).save();  
 req.flash('success', `Succesfully created ${store.name}`); 
 res.redirect(`/store/${store.slug}`);

}


exports.getStores = async(req,res) => {

  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores: stores})
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id :req.params.id}); 
  res.render('editstore', {title: `edit ${store.name}`, store})

}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({_id: req.params.id} , req.body, {new: true, runValidators:true,}).exec();
  req.flash('success', `Succesfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View Store </a>`);
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req,res)=>{

 const store = await Store.findOne({slug: req.params.slug });
 if(!store) return next(); 

 res.render('store', {store, title: store.name });

}

exports.getStoresByTag = async (req,res)=>{  
  const tag = req.params.tag;
  const tagQuery = tag || {$exists: true};

  const tagsPromise =  Store.getTagsList();
  const storesPromise =  Store.find({tags:tagQuery});

  const [tags , stores] = await Promise.all([tagsPromise,storesPromise]);
 
  res.render('tags', {tags: tags, title: 'Tags', tag: tag, stores: stores});
}