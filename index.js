// const express =require('express');
// const path = require('path');
// const cors = require('cors');


// const AuthRoute = require('./auth');

// const databaseUser = require('./models/userdb');


// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { default: App } = require('../frontend/src/App');

// app.post('/register', (req, res) => {
    
//     bcrypt.hash(req.body.password,10,function(err, hashedPass){
//         if(err){
//             res.json({
//                 error:err
//             })
//         }
//         let usersregister = new databaseUser({
//         username : req.body.username,
//         password : hashedPass,
//         email : req.body.email
        
      
//         });

//         usersregister.save()
//         .then(result => {
//           console.log('Veri başarıyla eklendi.');
//         })
//         .catch(error => {
//           console.log('Veri eklenirken bir hata oluştu:', error);
//         }); 
      
        

    
//     })
//    // Todo: kullanici kayit kismi
//     res.send('Successful!');
// });


// app.get('/giris', (req, res) => {
//     // Kullanıcının oturum durumunu kontrol edin
//     const loggedIn = req.session.loggedIn || false;
//     res.send(`Navbar Durumu: ${loggedIn ? 'Giriş Yapıldı' : 'Çıkış Yapıldı'}`);
//   });

  


// const PORT=3000;
// server.listen(PORT,()=>console.log(`Server is working on ${PORT}`));


// app.use('/api', AuthRoute);
