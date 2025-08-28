# AI-Powered E-commerce Chatbot

##  Overview

This project is an intelligent, conversational e-commerce chatbot built with **Google Dialogflow** for Natural Language Understanding (NLU) and a **Node.js** backend. The chatbot is powered by the **Google Gemini API** to provide dynamic, human-like responses and perform advanced tasks. It connects to a dummy e-commerce API (`dummyjson.com`) to fetch real-time product data.

This chatbot is designed to be integrated into any website to provide a rich, user-centric shopping assistance experience.

---

## ✨ Features

* **Smart Product Search:** Users can search for products by name or category. The chatbot displays results in professional-looking cards with images, prices, and links.
* **AI-Generated Descriptions:** Users can ask for a detailed description of any product, and the Gemini API will generate a unique and persuasive description on the fly.
* **Order Status Tracking:** A crucial feature for any e-commerce bot, allowing users to track their order status by providing an Order ID.
* **AI-Powered FAQ:** The bot can answer general store-related questions (e.g., Return Policy, Delivery Times) using a knowledge base processed by the Gemini API.
* **Inventory Check:** Users can ask how many total products are available in the store.
* **Multi-language Support (via Translation):** Users can ask for the last response to be translated into different languages.
* **Professional Fallbacks:** For irrelevant, off-topic questions, the bot politely refuses and guides the user back to shopping.

---

## 🛠️ Tech Stack

* **NLU Platform:** Google Dialogflow ES
* **Backend:** Node.js, Express.js
* **Generative AI:** Google Gemini API (`gemini-1.5-flash`)
* **E-commerce Data:** [DummyJSON](https://dummyjson.com/) (Free Fake API)
* **Libraries:** `axios`, `dialogflow-fulfillment`, `@google/generative-ai`

---

## 🚀 Setup and Installation

To run this project locally, follow these steps:

### Prerequisites

* **Node.js** (v18 or higher recommended)
* A **Dialogflow Agent** set up with the necessary intents and entities.
* A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    * Open the `index.js` file.
    * Find the following line:
        ```javascript
        const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
        ```
    * Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual Gemini API key.

---

## 🏃‍♂️ Usage

This project is designed to be run as a local server and connected to Dialogflow via a tunneling service like `ngrok`.

1.  **Start the local server:**
    ```bash
    node local-server.js
    ```
    You should see the message: `✅ Server is running and listening on port 3000`.

2.  **Expose your local server to the internet using `ngrok`:**
    ```bash
    ngrok http 3000
    ```
    `ngrok` will provide you with a public URL (e.g., `https://random-code.ngrok-free.app`).

3.  **Connect to Dialogflow:**
    * Go to your Dialogflow agent's **Fulfillment** section.
    * Enable the **Webhook**.
    * Paste your `ngrok` URL into the URL field.
    * **Save** the changes.

4.  **Test your chatbot** using the Dialogflow test console or any integrated UI.

---

## 🤖 Dialogflow Intent Setup

For the backend to work correctly, your Dialogflow agent must have the following intents with fulfillment enabled:

* `ProductSearch`
* `GetProductDescription`
* `OrderStatus`
* `ListAllProducts`
* `TranslateLastResult`
* `GeneralKnowledge`

---
## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
