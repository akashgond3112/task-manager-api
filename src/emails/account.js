const sgmail=require('@sendgrid/mail');
const sendGridAPIKey = process.env.SENDGRID_API;

sgmail.setApiKey(sendGridAPIKey)


const sendWelcomeEmail = (email,name) => {

    sgmail.send({
    to: email,
    from: "akashgond3112@gmail.com",
    subject: "Thanks For joining in!!!",
    text: `Welcome to the app, ${name}. Let me know how you get long with the app `,
    });

}

const sendCancellationEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: "akashgond3112@gmail.com",
    subject: "Sorry to see you go!!!",
    text: `Goodbye, ${name}. I hoep to see you back sometime soon. `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};