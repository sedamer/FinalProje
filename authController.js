// wfitwellness@gmail.com
// şifre : workfitwellnes01

const UserModel = require("./models/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwentoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wfitwellness@gmail.com",
    pass: "nuoqxcnhnhjpjdsk",
  },
});

var mailOptions = {
  from: "wfitwellness@gmail.com",
  to: "mrcnsedaa@gmail.com",
  subject: "selam sedacım",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
