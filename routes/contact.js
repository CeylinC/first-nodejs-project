const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("site/contact");
});

router.post("/email", (req, res) => {
 const outputHTML = `
  <h2>Mail Details</h2>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message</h3>
  <p>${req.body.message}</p>
 `

 const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.mail,
    pass: process.env.password,
  },
});

async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Node Project Contact Form ${process.env.mail}`, // sender address
    to: process.env.mail, // list of receivers
    subject: "Node Contact Message", // Subject line
    text: "Hello world?", // plain text body
    html: outputHTML, // html body
  });

  console.log("Message sent: %s", info.messageId);

  req.session.sessionFlash = {
    type: "alert alert-success",
    message: "Mailiniz başarılı bir biçimde yollandı",
  };

  res.redirect('/contact')
}

main().catch(console.error);
});

module.exports = router;
