// webhook_handler.js

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Parse incoming requests as JSON
app.use(bodyParser.json());

// Verify token set in Facebook app settings
const VERIFY_TOKEN = 'token-rand-12579642846135';

// Endpoint for receiving webhook events from Messenger
app.get('/webhook', (req, res) => {
    // Extract verify token from query parameters
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if mode and token exist and match the expected values
    if (mode && token === VERIFY_TOKEN) {
        // Respond with the challenge sent by Facebook for verification
        res.status(200).send(challenge);
    } else {
        // Verification failed
        res.sendStatus(403);
    }
});

// Endpoint for receiving messages from Messenger
app.post('/webhook', (req, res) => {
    // Handle incoming messages here
    console.log('Received webhook event:', req.body);
    
    // Extract messaging events from the request body
    const messagingEvents = req.body.entry[0].messaging;
    
    // Iterate over each messaging event
    messagingEvents.forEach(event => {
        // Extract sender's ID and message text (if available)
        const senderId = event.sender.id;
        const messageText = event.message && event.message.text;

        // If message text exists, send a welcome message with action buttons
        if (messageText) {
            sendWelcomeMessage(senderId);
        }
    });

    // Respond to Facebook's request with a 200 status code
    res.sendStatus(200);
});

// Function to send a welcome message with action buttons
function sendWelcomeMessage(recipientId) {
    // Construct the message object
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Welcome! Choose an action:",
            quick_replies: [
                {
                    content_type: "text",
                    title: "Button 1",
                    payload: "BUTTON_1_PAYLOAD"
                },
                {
                    content_type: "text",
                    title: "Button 2",
                    payload: "BUTTON_2_PAYLOAD"
                },
                {
                    content_type: "text",
                    title: "Button 3",
                    payload: "BUTTON_3_PAYLOAD"
                }
            ]
        }
    };

    // Send the message using the Send API
    sendMessage(messageData);
}

// Function to send message using the Send API
function sendMessage(messageData) {
    // Send the HTTP POST request to the Messenger Platform
    // Here you would use a library like Axios or the built-in HTTP module in Node.js to send the request
    // Example:
    // axios.post('https://graph.facebook.com/v13.0/me/messages', messageData, { params: { access_token: PAGE_ACCESS_TOKEN } })
    //     .then(response => {
    //         console.log('Message sent successfully:', response.data);
    //     })
    //     .catch(error => {
    //         console.error('Unable to send message:', error);
    //     });
    // Note: Replace PAGE_ACCESS_TOKEN with your actual Facebook Page Access Token
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
