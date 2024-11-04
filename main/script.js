const typingform = document.querySelector("#chat-form");
const chat_list = document.querySelector(".chat-list");
const textarea1 = document.getElementById('user-input');
const micbuttondown=document.querySelector(".fa-microphone")
let userMessage = null;

const textarea = document.getElementById('user-input');

// Adjust the height of the textarea as the user types
textarea.addEventListener('input', function () {
    this.style.height = 'auto'; // Reset the height to auto first to re-calculate
    const newHeight = this.scrollHeight;
    this.style.height = newHeight + 'px'; // Set the height to scrollHeight
    this.scrollTop = newHeight; // Ensure the scroll stays at the bottom
});

// Function to create a chat message element (either user or bot)
const createMessageElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
};
function addMessage(message, sender) {
    const chatContainer = document.getElementById('chat-list1'); // Ensure you have an element with id 'chat-container'

    if (!chatContainer) {
        console.error("Chat container not found!");
        return;
    }

    // Create the message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender); // 'message' class for styling, 'user' or 'assistant' for sender type

    // Replace markdown-like syntax with actual HTML tags
    message = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Convert bold (**text**) to <b>text</b>
    message = message.replace(/\*(.*?)\*/g, '<i>$1</i>');     // Convert italics (*text*) to <i>text</i>

    // Use innerHTML to properly render the formatted text
    messageElement.innerHTML = message;

    // Append the message to the chat container
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom of the chat container to keep the latest message in view
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to handle sending user's message
function handleOutGoingChat() {
    userMessage = textarea.value.trim();
    if (!userMessage) return;

    const userHtml = `
      <div class="message-content">
          <i class="fa-regular fa-user chat_icon"></i>
          <p class="text"></p>
      </div>`;

    const outGoingMessageDiv = createMessageElement(userHtml, "outgoing");
    outGoingMessageDiv.querySelector(".text").textContent = userMessage;
    chat_list.appendChild(outGoingMessageDiv);

    // Clear input field and reset height after sending the message
    textarea.value = '';
    textarea.style.height = 'auto'; // Reset the height to auto

    // Check if the message matches any predefined responses before calling the bot API
    setTimeout(() => {
        handleIncomingChat(userMessage);
    }, 1000); // Delay to simulate bot response
}
const API_key = "AIzaSyDbVgzGDQ9SbhrQh3ilUMTjNJq2KWJLv58";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_key}`;

const getGoogleResponse = async (userMessage) => {
    const data = {
        contents: [
            {
                parts: [
                    {
                        text: userMessage // Use the user's message here
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        let responseText = responseData.candidates[0].content.parts[0].text;
        
        // Replace markdown-like syntax (**text**) for bold and (*text*) for italics with HTML
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold
        responseText = responseText.replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italics
        
        console.log("Formatted response:", responseText);
        return responseText;

    } catch (error) {
        console.error("Error fetching Google response:", error);
        return "An error occurred while fetching the response.";
    }
};

// Function to handle bot's response
async function handleIncomingChat(userMessage) {
    try {
        const botResponse = await getBotResponse(userMessage); // Wait for the promise to resolve

        // Replace markdown-like syntax with HTML tags for bold and italics
        let formattedResponse = botResponse
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Convert **text** to <b>text</b>
            .replace(/\*(.*?)\*/g, '<i>$1</i>');     // Convert *text* to <i>text</i>

        const html = `
            <div class="message-content">
                <i class="fa-solid fa-robot chat_icon"></i>
                <p class="text"></p>
            </div>`;

        const incomingMessageDiv = createMessageElement(html, "incoming");

        // Use innerHTML to insert formatted text with HTML tags
        incomingMessageDiv.querySelector(".text").innerHTML = formattedResponse;
        chat_list.appendChild(incomingMessageDiv);

        // Scroll to the bottom of the chat after receiving a message
        chat_list.scrollTop = chat_list.scrollHeight;
    } catch (error) {
        console.error("Error in bot response:", error);
    }
}

// async function getGoogleResponse(prompt) {
//     try {
//         const response = await fetch('http://127.0.0.1:5000/get-gemini-response', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ prompt: prompt })
//         });

//         // Check if the response is okay (status in the range 200-299)
//         if (!response.ok) {
//             const errorText = await response.text(); // Get error details from the response
//             throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
//         }

//         // Parse the JSON data from the response
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching Google response:', error); // Log the error for debugging
//         throw error; // Rethrow the error for further handling
//     }
// }



// Simulated bot response
async function getBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hey")){
        return "Hello! Atom is here to assist you. How can I help today?";
    }else if (lowerCaseMessage.includes("how are you") || lowerCaseMessage.includes("how’s it going") || lowerCaseMessage.includes("how do you do")) {

        return "I'm just a bot, but I'm functioning at full capacity! How about you?";
    } else if (lowerCaseMessage.includes("thanks") || lowerCaseMessage.includes("thank you")) {
        return "You're welcome! Feel free to ask me anything.";
    } else if (lowerCaseMessage.includes("bye") || lowerCaseMessage.includes("goodbye") || lowerCaseMessage.includes("see you") || lowerCaseMessage.includes("later")) {

        return "Goodbye! Have a great day ahead!";
    } else if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("assist") || lowerCaseMessage.includes("support")) {

        return "Sure! I'm here to help. What do you need assistance with?";
    } else if (lowerCaseMessage.includes("what's your name") || lowerCaseMessage.includes("your name") || lowerCaseMessage.includes("who are you")) {

        return "I'm Atom, your virtual assistant!";
    } else if (lowerCaseMessage.includes("who made you") || lowerCaseMessage.includes("your creator") || lowerCaseMessage.includes("who built you")) {

        return "I was created by a team of skilled developers to assist you!";
    } else if (lowerCaseMessage.includes("what can you do") || lowerCaseMessage.includes("your abilities") || lowerCaseMessage.includes("what you can do")) {

        return "I can chat with you, help with information, and much more! How can I assist today?";
    } else if (lowerCaseMessage.includes("tell me a fact")) {
        return "Did you know? The first computer virus was created in 1986!";
    }
    else if (lowerCaseMessage.includes("open youtube") || lowerCaseMessage.includes("start youtube") || lowerCaseMessage.includes("launch youtube") || lowerCaseMessage.includes("open YouTube")) {

        window.open('https://www.youtube.com', '_blank');
        return ('Opening YouTube...');
    } else if (lowerCaseMessage.includes("play music") || lowerCaseMessage.includes("start music") || lowerCaseMessage.includes("launch music") || lowerCaseMessage.includes("play some songs")) {

        window.open('https://www.spotify.com'); // Example link
        return ('Playing some music...');
    } else if (lowerCaseMessage.includes("tell me a joke") || lowerCaseMessage.includes("say a joke") || lowerCaseMessage.includes("joke")) {

        const jokes = [
            "Why don’t skeletons fight each other? They don’t have the guts!",
            "Why don’t eggs tell jokes? They’d crack each other up.",
            "What do you call fake spaghetti? An impasta!"
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        return (joke);
        speakResponse(joke);
    } else if (lowerCaseMessage.includes('what is the weather today')) {
        return ('Today’s weather is sunny with a high of 25°C.', 'assistant');
        speakResponse('Today’s weather is sunny with a high of 25°C.');
    } else if (lowerCaseMessage.includes("give me a quote") || lowerCaseMessage.includes("say a quote") || lowerCaseMessage.includes("inspire me")) {

        const quotes = [
            "The best time to plant a tree was 20 years ago. The second best time is now.",
            "Don’t watch the clock; do what it does. Keep going.",
            "Success is not how high you have climbed, but how you make a positive difference to the world."
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)]; vs
        return (quote);
        speakResponse(quote);
    } else if (lowerCaseMessage.includes("can you hear me") || lowerCaseMessage.includes("hello")) {

        return ('Yes, I can hear you loud and clear!');
        speakResponse('Yes, I can hear you loud and clear!');
    } else if (lowerCaseMessage.includes('what is your name')) {
        return ("I'm your friendly voice assistant!");
        speakResponse("I'm your friendly voice assistant!");
    } else if (lowerCaseMessage.includes('who made you')) {
        return ('I was created by Abhishek, your awesome developer!');
        speakResponse('I was created by Abhishek, your awesome developer!');
    } else if (lowerCaseMessage.includes("what is the time") || lowerCaseMessage.includes("current time") || lowerCaseMessage.includes("time now")) {

        const currentTime = new Date().toLocaleTimeString();
        return (`The current time is ${currentTime}.`);
        speakResponse(`The current time is ${currentTime}.`);
    } else if (lowerCaseMessage.includes("open google") || lowerCaseMessage.includes("start google") || lowerCaseMessage.includes("launch google")) {

        window.open('https://www.google.com', '_blank');
        return ('Opening Google...');
    } else if (lowerCaseMessage.includes('search for') && lowerCaseMessage.includes('on google')) {
        const searchQuery = lowerCaseMessage.split('search for ')[1].split(' on google')[0];
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        return (`Searching Google for "${searchQuery}"...`);
    } else if (lowerCaseMessage.includes("motivate me") || lowerCaseMessage.includes("inspire me") || lowerCaseMessage.includes("give motivation")) {

        const motivations = [
            "Believe you can and you're halfway there.",
            "The only way to do great work is to love what you do.",
            "Dream it. Wish it. Do it."
        ];
        const motivation = motivations[Math.floor(Math.random() * motivations.length)];
        return (motivation);
        speakResponse(motivation);
    } else {
        const response = await getGoogleResponse(userMessage);
        console.log(response);
        addMessage(response,"assistant")
        // return (response); // Add the response to chat
        return response; // Return the response for display
        speakResponse(response); // Optional: Convert response to speech
    }
}





// Event listener for form submission
typingform.addEventListener("submit", function (e) {
    e.preventDefault();
    handleOutGoingChat();
});
textarea1.addEventListener('keydown', function (e) {
    if (e.key === "Enter" && !e.shiftKey) {  // Check if the "Enter" key was pressed (without Shift)
        e.preventDefault(); // Prevent the default behavior of adding a new line
        handleOutGoingChat(); // Call the same function as the submit button
    }
});

// making account logo to login page redirect

document.getElementById('account').addEventListener('click', function () {
    window.location.href = 'login/login.html'; // Redirect to login page
});

//   clear chat button function

// Getting the elements
const chat_list_var = document.getElementById('chat_list');
const clearButton = document.getElementById('clear_btn');

// Adding an event listener to the clear button
clearButton.addEventListener('click', () => {
    chat_list_var.innerHTML = ''; // This will clear all chat messages inside chat_list
});



// try to add voice intergration fucntion to get input from voice

let recognition;
if ('webkitSpeechRecognition' in window) { // Check if the Web Speech API is supported
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Your browser does not support Speech Recognition. Please try Chrome.");
}

// Configure the Speech Recognition settings
recognition.lang = 'en-US'; // Set the language
recognition.interimResults = false; // Don't show interim results
recognition.maxAlternatives = 1;



micbuttondown.addEventListener("click", () => {
    recognition.start();
    console.log("Voice recognition started. Speak into the microphone.");
});



// When the user finishes speaking

recognition.addEventListener("result", (event) => {
    const userMessage = event.results[0][0].transcript; // Get the recognized text
    console.log("User said:", userMessage);
    
    // Set the recognized text as if it's typed by the user in the input field
    textarea.value = userMessage;
    
    // Proceed with handling the outgoing chat (send it to the chat as a regular message)
    handleOutGoingChat();
});