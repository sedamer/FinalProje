const User =require('./userdb');
const nodemailer = require('nodemailer');

// wfitwellness@gmail.com
// şifre : workfitwellnes01

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'wfitwellness@gmail.com',
        pass: 'workfitwellnes01'
    },
    tls: {
        rejectUnauthorized: true
    }
});

function generateVerificationCode(){
    const length=6; // Doğrulama kodu uzunluğu
    const characters ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

const authentication=(req,res,next)=>{
    const dogrulamaKodu=req.params.dogrulamaKodu;
    console.log(dogrulamaKodu);
    User.findOne({verificationCode :dogrulamaKodu}).then(user=>{
        if(user){
            //kullanıcı bulundu, doğrulama işlemi gerçekleştiriliyor.
            user.verified=true;
            user.save();
            res.send('Hesap doğrulama başarılı');
        }
        else{
            res.send('Hesap doğrulama başarısız');
        }
    })
    .catch(error=>{
        res.send('hesap doğrulama başarısız');
    });
}



module.exports ={
    authentication
};