const nodemailer = require('nodemailer');
const http = require('http');
require('dotenv').config();

function checkInternetConnectivity() {
    http.get('http://www.google.com', (res) => {
        if (res.statusCode === 200) {
            console.log('Internet is reachable.');
        } else {
            console.log('Internet is not reachable.');
        }
    }).on('error', (err) => {
        console.error('Error checking internet connectivity:', err.message);
    });
}

// Call the function to check internet connectivity

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
    subject: 'work',
    text: ''
};

// Use the transporter.sendMail method to send the email
async function sendMail() {
    console.log(`transporte ${transporter}`)
    let isSentCorrectly = true;
    await transporter.sendMail(mailOptions).catch((error) => {
        console.log(`error ${error}`)
        isSentCorrectly = !error;
        console.log(`isSentCorrectly value ${isSentCorrectly}`)
    })
    return isSentCorrectly;
}

const server = http.createServer(async (req, res) => {
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
        res.setHeader('Content-Type', 'application/json');
        let body = '';
        req.on('data', (chunk) => {
            console.log(`chunk ${chunk}`)
            body += chunk;
        });
        req.on('end', async () => {
            const {fname, lname, message} = JSON.parse(body);
            mailOptions.subject = fname + lname;
            mailOptions.text = message;
            if (await sendMail() === true) {
                res.statusCode = 200
                const customResponse = {
                    code: 200,
                    message: 'Email sent successfully'
                };
                res.end(JSON.stringify(customResponse));
            } else {
                res.statusCode = 400
                const customResponse = {
                    code: 400,
                    message: 'Error : email not sent'
                };
                res.end(JSON.stringify(customResponse));
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
});