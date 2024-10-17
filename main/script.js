const typingform = document.querySelector("#chat-form");
const chat_list = document.querySelector(".chat-list");
const textarea1 = document.getElementById('user-input');
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

    // Simulate bot response after a short delay
    setTimeout(() => {
        handleIncomingChat(userMessage);
    }, 1000); // Delay to simulate bot response
}

// Function to handle bot's response
async function handleIncomingChat(userMessage) {
    try {
        const botResponse = await getBotResponse(userMessage); // Wait for the promise to resolve

        const html = `
            <div class="message-content">
                <i class="fa-solid fa-robot chat_icon"></i>
                <p class="text"></p>
            </div>`;

        const incomingMessageDiv = createMessageElement(html, "incoming");
        incomingMessageDiv.querySelector(".text").textContent = botResponse;
        chat_list.appendChild(incomingMessageDiv);

        // Scroll to the bottom of the chat after receiving a message
        chat_list.scrollTop = chat_list.scrollHeight;
    } catch (error) {
        console.error("Error in bot response:", error);
    }
}

// Simulated bot response
async function getBotResponse(userMessage) {
  const lowerCaseMessage = userMessage.toLowerCase();

  if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! Atom is here to assist you. How can I help today?";
  } else if (lowerCaseMessage.includes("how are you")) {
      return "I'm just a bot, but I'm functioning at full capacity! How about you?";
  } else if (lowerCaseMessage.includes("thanks") || lowerCaseMessage.includes("thank you")) {
      return "You're welcome! Feel free to ask me anything.";
  } else if (lowerCaseMessage.includes("bye") || lowerCaseMessage.includes("goodbye")) {
      return "Goodbye! Have a great day ahead!";
  } else if (lowerCaseMessage.includes("help")) {
      return "Sure! I'm here to help. What do you need assistance with?";
  } else if (lowerCaseMessage.includes("what's your name")) {
      return "I'm Atom, your virtual assistant!";
  } else if (lowerCaseMessage.includes("who made you")) {
      return "I was created by a team of skilled developers to assist you!";
  } else if (lowerCaseMessage.includes("what can you do")) {
      return "I can chat with you, help with information, and much more! How can I assist today?";
  }    else if (lowerCaseMessage.includes("tell me a fact")) {
      return "Did you know? The first computer virus was created in 1986!";
  }
  else if (lowerCaseMessage.includes('open youtube')) {
      window.open('https://www.youtube.com', '_blank');
      return('Opening YouTube...');
} else if (lowerCaseMessage.includes('play music')) {
    window.open('https://www.spotify.com'); // Example link
    return('Playing some music...', 'assistant');
} else if (lowerCaseMessage.includes('tell me a joke')) {
    const jokes = [
        "Why don’t skeletons fight each other? They don’t have the guts!",
        "Why don’t eggs tell jokes? They’d crack each other up.",
        "What do you call fake spaghetti? An impasta!"
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return(joke, 'assistant');
    speakResponse(joke);
} else if (lowerCaseMessage.includes('what is the weather today')) {
    return('Today’s weather is sunny with a high of 25°C.', 'assistant');
    speakResponse('Today’s weather is sunny with a high of 25°C.');
} else if (lowerCaseMessage.includes('give me a quote')) {
    const quotes = [
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "Don’t watch the clock; do what it does. Keep going.",
        "Success is not how high you have climbed, but how you make a positive difference to the world."
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];vs
    return(quote, 'assistant');
    speakResponse(quote);
} else if (lowerCaseMessage.includes('can you hear me') || lowerCaseMessage.includes('hello')) {
    return('Yes, I can hear you loud and clear!', 'assistant');
    speakResponse('Yes, I can hear you loud and clear!');
} else if (lowerCaseMessage.includes('what is your name')) {
    return("I'm your friendly voice assistant!", 'assistant');
    speakResponse("I'm your friendly voice assistant!");
} else if (lowerCaseMessage.includes('who made you')) {
    return('I was created by Abhishek, your awesome developer!', 'assistant');
    speakResponse('I was created by Abhishek, your awesome developer!');
} else if (lowerCaseMessage.includes('what is the time')) {
    const currentTime = new Date().toLocaleTimeString();
    return(`The current time is ${currentTime}.`, 'assistant');
    speakResponse(`The current time is ${currentTime}.`);
} else if (lowerCaseMessage.includes('open google')) {
    window.open('https://www.google.com', '_blank');
    return('Opening Google...');
} else if (lowerCaseMessage.includes('search for') && lowerCaseMessage.includes('on google')) {
    const searchQuery = lowerCaseMessage.split('search for ')[1].split(' on google')[0];
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    return(`Searching Google for "${searchQuery}"...`);
} else if (lowerCaseMessage.includes('motivate me')) {
    const motivations = [
        "Believe you can and you're halfway there.",
        "The only way to do great work is to love what you do.",
        "Dream it. Wish it. Do it."
    ];
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];
    addMessage(motivation, 'assistant');
    speakResponse(motivation);
} else {
    // If no specific command is recognized, send to Google Cloud Natural Language API
    const response = await getGoogleResponse(userInput);
    addMessage(response, 'assistant');
    speakResponse(response);
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

document.getElementById('account').addEventListener('click', function() {
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
