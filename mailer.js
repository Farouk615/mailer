const nodemailer = require('nodemailer');
const http = require('http');
require('dotenv').config();

console.log("inside the mailer version 2")
// Create a transporter object with Gmail and OAuth2 credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_MAIL_ADDRESS,
        pass: process.env.PASSWORD
    }
});

// Create a mailOptions object with your email details
const mailOptions = {
    from: process.env.SENDER_MAIL_ADDRESS,
    to: process.env.RECEIVER_MAIL_ADDRESS,
    subject: '',
    text: ''
};

// Use the transporter.sendMail method to send the email
function sendMail() {
    console.log(`transporte ${transporter}`)
    console.log(`env variables sender : ${process.env.SENDER_MAIL_ADDRESS} to : ${process.env.RECEIVER_MAIL_ADDRESS} user : ${process.env.SENDER_MAIL_ADDRESS} and pass : ${process.env.PASSWORD}`)
    transporter.sendMail(mailOptions, function (error, info) {
        console.log(`error ${error}`)
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and OPTIONS requests
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    if (req.method === 'OPTIONS') {
        // Handle preflight requests (OPTIONS)
        res.writeHead(200);
        res.end();
    }
    if (req.method === 'POST' && req.url === '/send-email') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let body = '';
        req.on('data', (chunk) => {
            console.log(`chunk ${chunk}`)
            body += chunk;
        });
        req.on('end', async () => {
            const {fname, lname, message} = JSON.parse(body);
            mailOptions.subject = fname + lname;
            mailOptions.text = message;
            sendMail()
            res.setHeader('Access-Control-Allow-Origin', '*')
            // Create a Nodemailer transporter and send the email
            // (Configure SMTP settings, subject, body, etc.)
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Email sent successfully');
        });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});