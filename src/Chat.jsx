import openai from "./config/openai.js";
import React, { useState, useEffect } from "react";

function Chat() {
    const [chatHistory, setChatHistory] = useState([]);
    const [input, setInput] = useState("");

    const updateChatHistory = (userinput,botResponse) => {
        setChatHistory(prevHistory=>{
            const newHistory = [...prevHistory];
            newHistory.push(['user',userinput]);
            newHistory.push(['assistant',botResponse]);
            return newHistory;
        })
    };

    async function handleInput() {
        if (input.trim() === '') return;

        let completion = '';
        completion = await Logic(input);
        updateChatHistory(input, completion);
        setInput('');
    }

    async function Logic(userInput) {
        try {
            const messages = chatHistory.map(([role, content]) => ({ role, content }));
            messages.push({ role: 'user', content: userInput });

            const chatBotResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k-0613',
                messages: messages
            });

            return chatBotResponse.choices[0].message.content;
        } catch (error) {
            console.error(error);
            return "Sorry, I encountered an error. Please try again";
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleInput();
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleInput();
                setInput('');
                window.removeEventListener('keydown', handleKeyPress);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [chatHistory, input]);
    return (
        <div className="chat-container">
            <h1>Welcome to the chatbot programme</h1>
            <h2>You can start chatting with the bot</h2>
            <div className="chat-history">
                {chatHistory.map(([role, content], index) => (
                    <p key={index} style={{ color: role === 'user' ? 'blue' : 'white', marginBottom: '5px' }}>
                        {role === 'user' ? 'You: ' : 'Bot: '}{content}
                    </p>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type here..."
                    style={{ marginRight: '5px', width: '70%', padding: '5px' }}
                />
                <button type="submit" className="send-btn">
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;
