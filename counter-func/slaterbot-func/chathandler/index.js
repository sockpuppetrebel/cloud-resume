const { OpenAI } = require("openai");

const openai = new OpenAI();

module.exports = async function (context, req) {
    const userMessage = req.body?.message || req.query?.message;

    if (!userMessage) {
        context.res = {
            status: 400,
            body: "Please pass a 'message' in the query or body."
        };
        return;
    }

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        });

        context.res = {
            status: 200,
            body: chatCompletion.choices[0].message.content
        };
    } catch (err) {
        context.log.error("OpenAI error:", err);
        context.res = {
            status: 500,
            body: "Something went wrong with the chatbot."
        };
    }
};

