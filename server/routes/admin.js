const express=require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const adminLayout ='../views/layouts/admin';
const jwSecret = process.env.JWT_SECRET;

//Routes



 /**
 * Midleware function
 *Admin Login check 
 */

const authMiddleware =(req, res , next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json ({ message: 'Unauthorized'});

    }
    try { 
        const decoded = jwt.verify(token, jwSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({message: "Unauthirized"});
    }
}



/**
 * Get/
 *Admin Login page
 */

router.get('/admin' ,async (req, res)=> {
       try{
        const locals={
            title: "Ethio Pluribus Admin ",
            description: "Blog by Lencho."
           }
    
          res.render('admin/index', {locals, layout: adminLayout });
    
       }catch(error){
          console.log(error);
    
       }
       //res.render('index');
      
    });

    
/**
 * Post/
 * Admin Check  Login
 */

// router.post('/admin' ,async (req, res)=> {
//     try{

//         const {username, password } = req.body;
//         //console.log(req.body);
//         //res.redirect('/admin');

//         if(req.body.username === 'admin' && req.body.password === 'password'){
//             res.send("you are logged in.")
            
//         }else
//         res.send('Wrong username or password');




//     }
//     catch (error){
//         console.log(error)
//     }
     
// });

/**
 * Post/
 * Admin Check  Login
 */

router.post('/admin' ,async (req, res)=> {
    try{

        const {username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            return res.status ( 401).json({ message : "Invalid credenitials"});

        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status ( 401).json({ message : "Invalid credenitials"});

        }

        const token = jwt.sign({userId: user._id}, jwSecret);
        res.cookie('token', token, {httpOnly :true});
        res.redirect('/dashboard');
        

    }
    catch (error){
        console.log(error)
    }

  
 
     
});




/**
 * Get/
 * Admin Check  Login
 */


router.get('/dashboard',authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Dashboard',
            description : 'Simple Blog Page'
        }
            
            const data = await Post.find();
            res.render('admin/dashboard', {
             locals,
            data,
            layout :adminLayout
                        
            });

    } catch (error) {
        console.log(error);
        
    }
    
  
  });
  
     

/**
 * Get/
 * Admin create new post
 */

router.get('/add-post',authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Add Post',
            description : 'Simple Blog Page'
        }
            
            const data = await Post.find();
            res.render('admin/add-post', {
             locals,
             data,
             layout :adminLayout
                        
            });

    } catch (error) {
        console.log(error);
        
    }
    
  
  });

    /**
 * POST/
 * Admin create new post---added to the data base
 */

    router.post('/add-post',authMiddleware, async (req, res) => {
        try {
            console.log(req.body);

            try {
                const newPost = new Post ({
                    title: req.body.title,
                    body: req.body.body
                });
                await Post.create(newPost);
                res.redirect('/dashboard');

            } catch (error) {
                console.log(error);
            }

    
        } catch (error) {
            console.log(error);
            
        }
        
      
      });


 /**
 * Get/
 * Admin edit new post
 */

router.get('/edit-post/:id',authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Add Post',
            description : 'Simple Blog Page'
        }
        const data = await Post.findOne({ _id: req.params.id});//to find the specifi post to edit
        //to didplay it 
        res.render('admin/edit-post',{
            locals,
            data,
            layout: adminLayout
        })
  

       
    } catch (error) {
        console.log(error);
        
    }
    
  
  });
    

  /**
 * Put/
 * Admin edit new post
 */

router.put('/edit-post/:id',authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body : req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);

       
    } catch (error) {
        console.log(error);
        
    }
    
  
  });

  /**
 * Delete/
 * Admin Delete new post
 */

  router.delete('/delete-post/:id',authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id});
        res.redirect('/dashboard');
            /**
         * Add an alreat message to notify a delete post
         * Admin Delete new post
         */
            

       
    } catch (error) {
        console.log(error);
        
    }

    });

    
 /**
 * Get/
 * Admin draft page
 */

 router.get('/draft/:id',authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Draft',
            description : 'Simple Blog Page'
        }
        const data = await Post.findOne({ _id: req.params.id});//to find the specifi post to edit
        //to didplay it 
        res.render('admin/draft',{
            locals,
            data,
            layout: adminLayout
        })
  

       
    } catch (error) {
        console.log(error);
        
    }
    
  
  });

    /**
 * Put/
 * Admin draft page 
 */

router.put('/draft/:id',authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body : req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/draft/:id/${req.params.id}`);

       
    } catch (error) {
        console.log(error);
        
    }
    
  
  });
    

    


router.get('/draft', authMiddleware, async (req, res) => {
    res.render('admin/draft');
});


    
/**
 * Post/
 *Admin Register
 */

 router.post('/register' ,async (req, res)=> {
    try{

        const {username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        //create the user

        try{
            const user = await User .create({username, password : hashedPassword});
            res.status(201).json({message: ' User created', user})
        }catch (error){
            if(error.code === 11000){
                res.status (409).json({message : 'User already in use!'})
            }
            res.status(500).json({message: 'Internal server error.'});

        }
        
    }
    catch (error){
        console.log(error)
    }
     
});

/**
 * Get/
 *Admin Log out Button
 */
router.get('/logout' , (req,res) =>{
    res.clearCookie('token');
    res.json({message: 'Logout successful.'});

});

/**
 * Get/
 *Admin photo page
 */


router.get('/photos', authMiddleware, async (req, res) => {
    res.render('admin/photos');
});

/**
 * Get/
 *Admin previousPosts
 */

// router.get('/previousPosts', async (req, res) => {
//     res.render('admin/previousPosts');
// });



/**
 * Get/
 * Admin /previousPosts
 */

router.get('/previousPosts',authMiddleware, async (req, res) => {
    try {

        const locals = {
            title: 'Previous Post',
            description : 'Simple Blog Page'
        }
            
            const data = await Post.find();
            res.render('admin/previousPosts', {
             locals,
             data,
             layout :adminLayout
                        
            });

    } catch (error) {
        console.log(error);
        
    }
    
  
  });

    /**
 * POST/
 * Admin admin/previousPosts
 */

    router.post('/previousPosts',authMiddleware, async (req, res) => {
        try {
            console.log(req.body);

            try {
                const newPost = new Post ({
                    title: req.body.title,
                    body: req.body.body
                });
                await Post.create(newPost);
                res.redirect('/dashboard');

            } catch (error) {
                console.log(error);
            }

    
        } catch (error) {
            console.log(error);
            
        }
        
      
      });








/**
 * Get/
 *Admin password-reset page
 */

router.get('/password-reset', authMiddleware, async (req, res) => {
    res.render('admin/password-reset');
});

module.exports = router;