const express=require('express');
const router = express.Router();
const Post = require('../models/Post');
//Routes

/**
 * Get/
 * HOME
 */
router.get('' ,async (req, res)=> {
   // res.send("Hello");
  
   try{
      const locals={
         title: "Ethio Pluribus",
         description: "Blog by Lencho."
        }
     let perPage =3;
     let page = req.query.page||1 ;//if page is not specfcied use page 1 as default
     const data = await Post.aggregate([{$sort: { createdAt: -1}}])
     .skip(perPage * page -perPage)
     .limit(perPage)
     .exec();

     const count = await Post.count();
     const nextPage = parseInt(page) + 1;
     const hasNextPage = nextPage <= Math.ceil(count/perPage);

      //const data = await Post.find();
      res.render('index', {
         locals ,
         data ,
      current: page ,
   nextPage: hasNextPage ? nextPage : null

});

   }catch(error){
      console.log(error);

   }
   //res.render('index');
  
});

//Before pagination 

// router.get('' ,async (req, res)=> {
//    // res.send("Hello");
//    const locals={
//     title: "Ethio Pluribus",
//     description: "Blog by Lencho."
//    }

//    try{
//       const data = await Post.find();
//       res.render('index', {locals ,data});

//    }catch(error){
//       console.log(error);

//    }
//    //res.render('index');
  
// });

/**
 * Get/
 * POST
 */

router.get('/post/:id' ,async (req, res)=> {
      // res.send("Hello");
    
   
      try{
         let slug = req .params.id;
         const data = await Post.findById({ _id: slug });
         const locals={
            title: data.title,
            description: "Blog by Lencho."
           }
  
      
         res.render('post', {locals ,data});
   
      }catch(error){
         console.log(error);
   
      }
      //res.render('index');
     
   });

/** added a code from the vegetable project to alow the ownwer to create a post */

// function insertPostData(){
//    Post.insertMany([
//       {  title: "Building a Blog",
//          body:   "This is the body text"
//       },
//       {  title: "Ethiopia Reimagined",
//          body:   "This is the body text"
//       },
//       {  title: "FDRE Constitution",
//          body:   "This is the body text"
//       },
//       {  title: "Human Rights",
//          body:   "This is the body text"
//       }
     
//    ])
// }
// insertPostData();


/**
 * Get/
 * POST- search Term
 * 
 */

router.post('/search' ,async (req, res)=> {

      try{
         const locals={
            title: "Search",
            description: "Blog by Lencho."
         }

         let searchTerm = req.body.searchTerm;
         const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")// remove all spacial character
         const data = await Post.find({
            $or: [
               {title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
               {body: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
            ]
         });
         res.render("search", {
            data,
            locals
         });
     
        
        // const data = await Post.find();
         //res.render('search', {locals ,data});
         //res.send(searchTerm);
   
      }catch(error){
         console.log(error);
   
      }
      //res.render('index');
     
   });

router.get('/new' ,(req, res)=> {
   res.render('admin/new');
})





router.get('/about' ,(req, res)=> {
    res.render('about');
 })

 router.get('/contact' ,(req, res)=> {
    res.render('contact');
 })

 router.get('/donate' ,(req, res)=> {
   res.render('donate');
})
 


module.exports = router;