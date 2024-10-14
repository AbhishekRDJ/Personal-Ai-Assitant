const typingform = document.querySelector("#chat-form");
const chat_list = document.querySelector(".chat-list");
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
function handleIncomingChat(userMessage) {
    const botResponse = getBotResponse(userMessage);

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
}

// Simulated bot response
function getBotResponse(userMessage) {
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
  } else if (lowerCaseMessage.includes("tell me a joke")) {
      return "Why don't programmers like nature? It has too many bugs!";
  } else if (lowerCaseMessage.includes("what's the weather")) {
      return "I'm unable to check the weather at the moment, but you can try a weather app!";
  } else if (lowerCaseMessage.includes("open youtube")) {
      return "I'm unable to open websites, but you can visit YouTube by opening a browser!";
  } else if (lowerCaseMessage.includes("tell me a fact")) {
      return "Did you know? The first computer virus was created in 1986!";
  } else {
      return "I'm not sure about that. Could you ask something else?";
  }
}


// Event listener for form submission
typingform.addEventListener("submit", function (e) {
    e.preventDefault();
    handleOutGoingChat();
});

hello all
