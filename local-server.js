const express = require('express');
const path = require('path'); // 'path' ko import karein

// Aap ki asal chatbot logic ko index.js se import karein
const { myEcommerceWebhook } = require('./index.js');

// Ek nayi Express application banaen
const app = express();

// --- ZAROORI HISSAY ---
// 1. Webhook ke liye JSON body parser
app.use(express.json());

// 2. 'public' folder se static files (jaise index.html) serve karein
app.use(express.static(path.join(__dirname, 'public')));

// 3. Webhook ke liye ek alag raasta (route) banayein
app.post('/webhook', myEcommerceWebhook);
// --------------------

// Port number define karein jis par aap ka server chalega
const PORT = 3000;

// Server ko start karein
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('Ab ngrok ko is port se connect karein.');
});