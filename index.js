'use strict';

const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = 'GEMNI API';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

exports.myEcommerceWebhook = (request, response) => {
    const agent = new WebhookClient({ request, response });

    // ==============================
    // Helper: Save Last Response
    // ==============================
    function saveLastResponse(agent, text) {
        agent.context.set({
            name: 'last-response-context',
            lifespan: 5,
            parameters: { last_response: text }
        });
    }

    // =================================================================
    //  1. PRODUCT SEARCH HANDLER
    // =================================================================
    async function productSearchHandler(agent) {
        let searchTerm = agent.parameters.product_name || (Array.isArray(agent.parameters.product_catalog) ? agent.parameters.product_catalog[0] : agent.parameters.product_catalog);

        if (!searchTerm || typeof searchTerm !== 'string') {
            agent.add("I'm sorry, I couldn't figure out what to search for. Please be more specific.");
            return;
        }

        try {
            const apiUrl = `https://dummyjson.com/products/search?q=${searchTerm}`;
            const productApiResponse = await axios.get(apiUrl);
            
            if (productApiResponse.data && productApiResponse.data.products.length > 0) {
                const products = productApiResponse.data.products.slice(0, 3);

                const richContent = [];
                products.forEach(product => {
                    richContent.push({
                        type: "info",
                        title: product.title,
                        subtitle: `Price: $${product.price} | Rating: ${product.rating} ★`,
                        image: { src: { rawUrl: product.thumbnail } },
                        actionLink: `https://dummyjson.com/products/${product.id}`
                    });
                });

                const payloadJson = { richContent: [richContent] };
                agent.add(new Payload(agent.UNSPECIFIED, payloadJson, { rawPayload: true, sendAsMessage: true }));

                let replyText = `Maine ${searchTerm} ke liye kuch products dhoonde hain.`;
                saveLastResponse(agent, replyText);

            } else {
                let replyText = `Maaf Kijiye, mujhe '${searchTerm}' se milta julta koi product nahi mila.`;
                agent.add(replyText);
                saveLastResponse(agent, replyText);
            }
        } catch (error) {
            console.error("Error in ProductSearch:", error);
            let replyText = "Maaf kijiye, system mein kuch kharabi hai.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  2. ORDER STATUS HANDLER
    // =================================================================
    async function orderStatusHandler(agent) {
        const orderId = agent.parameters.order_id;
        if (!orderId) {
            let replyText = "Zaroor, main aapka order status check kar sakta hoon. Please apna Order ID batayein.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
            return;
        }

        try {
            const apiUrl = `https://dummyjson.com/carts/${orderId}`;
            const orderApiResponse = await axios.get(apiUrl);
            const orderData = orderApiResponse.data;

            if (!orderData) {
                let replyText = `Maaf kijiye, mujhe Order ID #${orderId} se mutalliq koi maloomat nahi mili.`;
                agent.add(replyText);
                saveLastResponse(agent, replyText);
                return;
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an e-commerce order tracking assistant. A customer is asking for the status of their order #${orderId}. 
            The order contains ${orderData.totalProducts} items with a total value of $${orderData.total}.
            Based on this data, create a friendly and professional status update in Roman Urdu.`;

            const result = await model.generateContent(prompt);
            const replyText = (await result.response).text();
            agent.add(replyText);
            saveLastResponse(agent, replyText);

        } catch (error) {
            console.error("Error in OrderStatus:", error);
            let replyText = `Maaf kijiye, Order ID #${orderId} ghalat hai ya system mein koi kharabi hai.`;
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  3. GET PRODUCT REVIEWS HANDLER
    // =================================================================
    async function getProductReviewsHandler(agent) {
        const productName = agent.parameters.product_name;
        if (!productName) {
            let replyText = "Please tell me which product's reviews you want to see.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
            return;
        }

        try {
            const apiUrl = `https://dummyjson.com/products/search?q=${productName}`;
            const productApiResponse = await axios.get(apiUrl);
            const productData = productApiResponse.data.products[0];

            if (!productData) {
                let replyText = `I'm sorry, I couldn't find a product named '${productName}'.`;
                agent.add(replyText);
                saveLastResponse(agent, replyText);
                return;
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an expert product review analyst. A customer wants to know about the reviews for "${productData.title}".
            Product Details:
            - Category: ${productData.category}
            - Price: $${productData.price}
            - Rating: ${productData.rating} out of 5
            - Description: ${productData.description}
            Generate a summary in Roman Urdu.`;

            const result = await model.generateContent(prompt);
            const replyText = (await result.response).text();
            agent.add(replyText);
            saveLastResponse(agent, replyText);

        } catch (error) {
            console.error("Error in GetProductReviews:", error);
            let replyText = "Maaf kijiye, main is waqt is product ke reviews hasil nahi kar pa raha.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  4. GET PRODUCT DESCRIPTION HANDLER
    // =================================================================
    async function getProductDescriptionHandler(agent) {
        const productName = agent.parameters.product_name;
        if (!productName) {
            let replyText = "Please tell me which product's description you want.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
            return;
        }

        try {
            const apiUrl = `https://dummyjson.com/products/search?q=${productName}`;
            const productApiResponse = await axios.get(apiUrl);
            const productData = productApiResponse.data.products[0];

            if (!productData) {
                let replyText = `I'm sorry, I couldn't find a product named '${productName}'.`;
                agent.add(replyText);
                saveLastResponse(agent, replyText);
                return;
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are an expert e-commerce copywriter. Write an 80-100 word description in Roman Urdu for "${productData.title}".
            Category: ${productData.category}
            Price: $${productData.price}
            Original Description: ${productData.description}`;

            const result = await model.generateContent(prompt);
            const replyText = (await result.response).text();
            agent.add(replyText);
            saveLastResponse(agent, replyText);

        } catch (error) {
            console.error("Error in GetProductDescription:", error);
            let replyText = "Maaf kijiye, main is waqt description generate nahi kar pa raha.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  5. TRANSLATE LAST RESULT HANDLER
    // =================================================================
    async function translateLastResultHandler(agent) {
        const targetLanguage = agent.parameters.language || "English";
        const context = agent.context.get('last-response-context');
        const lastResponse = context ? context.parameters.last_response : null;

        if (!lastResponse) {
            agent.add("I'm sorry, I don't remember what to translate. Please ask something first.");
            return;
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Translate the following text into ${targetLanguage}. Only give the translation:\n"${lastResponse}"`;
            const result = await model.generateContent(prompt);
            agent.add((await result.response).text());
        } catch(error) {
            console.error("Error in Translation:", error);
            agent.add("I'm sorry, I couldn't translate that right now.");
        }
    }

    // =================================================================
    //  6. GENERAL KNOWLEDGE & FAQ HANDLER
    // =================================================================
    async function generalKnowledgeHandler(agent) {
        const userQuery = agent.query;
        const storeKnowledgeBase = `
        - Return Policy: Customers can return products within 7 days. The product must be in original condition.
        - Delivery Time: 3-5 business days.
        - Payment Methods: Cash on Delivery (COD) and Credit/Debit Cards.
        `;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `You are a helpful store assistant. Knowledge Base: ${storeKnowledgeBase}
            User's Question: "${userQuery}"
            Answer in Roman Urdu if possible.`;

            const result = await model.generateContent(prompt);
            const replyText = (await result.response).text();
            agent.add(replyText);
            saveLastResponse(agent, replyText);

        } catch (error) {
            console.error("Error in GeneralKnowledge:", error);
            let replyText = "I'm sorry, I'm having trouble thinking right now.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  7. LIST ALL PRODUCTS HANDLER
    // =================================================================
    async function listAllProductsHandler(agent) {
        try {
            const apiUrl = `https://dummyjson.com/products?limit=100`;
            const productApiResponse = await axios.get(apiUrl);
            
            if (productApiResponse.data && productApiResponse.data.products.length > 0) {
                const totalProducts = productApiResponse.data.total;
                const products = productApiResponse.data.products.slice(0, 5);
                let productExamples = "";
                products.forEach(product => {
                    productExamples += `- ${product.title}\n`;
                });

                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Customer asked how many products you have.
                Total: ${totalProducts}.
                Examples:\n${productExamples}
                Reply in Roman Urdu.`;

                const result = await model.generateContent(prompt);
                const replyText = (await result.response).text();
                agent.add(replyText);
                saveLastResponse(agent, replyText);

            } else {
                let replyText = "Maaf Kijiye, is waqt hum products ki list hasil nahi kar pa rahe.";
                agent.add(replyText);
                saveLastResponse(agent, replyText);
            }
        } catch (error) {
            console.error("Error in ListAllProducts:", error);
            let replyText = "Maaf kijiye, system mein kuch kharabi hai.";
            agent.add(replyText);
            saveLastResponse(agent, replyText);
        }
    }

    // =================================================================
    //  INTENT MAP
    // =================================================================
    let intentMap = new Map();
    intentMap.set('ProductSearch', productSearchHandler);
    intentMap.set('OrderStatus', orderStatusHandler);
    intentMap.set('GetProductReviews', getProductReviewsHandler);
    intentMap.set('GetProductDescription', getProductDescriptionHandler);
    intentMap.set('TranslateLastResult', translateLastResultHandler);
    intentMap.set('GeneralKnowledge', generalKnowledgeHandler); 
    intentMap.set('ListAllProducts', listAllProductsHandler);

    agent.handleRequest(intentMap);
};

