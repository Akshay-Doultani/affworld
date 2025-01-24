const transporter = require('./config/transporter');

async function sendEmail() {
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'recipient-email@example.com', // Replace with recipient's email
        subject: 'Test Email',
        text: 'This is a test email sent using Nodemailer with OAuth2!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

sendEmail();
