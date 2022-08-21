const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c29b404f8741b4",
      pas: "777d16c2a6f0ef",
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
