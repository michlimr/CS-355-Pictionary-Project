class Chatbox {
    constructor(chatboxSelector) {
        this.chatboxElement = document.querySelector(chatboxSelector);
        this.messages = [];
        this.targetWord = 'magic';
        this.init();
    }

    init() {
        this.createChatUI();

        const sendButton = this.chatboxElement.querySelector('.send-button');
        sendButton.addEventListener('click', () => this.sendMessage());

        const messageInput = this.chatboxElement.querySelector('.message-input');
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    createChatUI() {
        const messageArea = document.createElement('div');
        messageArea.className = 'message-area';
        messageArea.style.overflowY = 'auto';
        messageArea.style.height = '80%';
        messageArea.style.marginBottom = '10px';
        this.chatboxElement.appendChild(messageArea);

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';

        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.className = 'message-input';
        messageInput.style.flexGrow = '1';
        messageInput.style.padding = '5px';

        const sendButton = document.createElement('button');
        sendButton.className = 'send-button';
        sendButton.textContent = 'Send';
        sendButton.style.marginLeft = '5px';
        sendButton.style.padding = '5px 10px';

        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(sendButton);

        this.chatboxElement.appendChild(inputContainer);
    }

    sendMessage() {
        const messageInput = this.chatboxElement.querySelector('.message-input');
        const messageText = messageInput.value.trim();

        if (messageText) {
            if (messageText.toLowerCase() === this.targetWord.toLowerCase()) {
                this.messages.push({ text: 'You guessed right!', sender: 'System', isCorrect: true });
            } else {
                this.messages.push({ text: messageText, sender: 'You', isCorrect: false });
            }

            this.displayMessages();

            messageInput.value = '';
        }
    }

    displayMessages() {
        const messageArea = this.chatboxElement.querySelector('.message-area');
        messageArea.innerHTML = '';

        this.messages.forEach((msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${msg.sender}: ${msg.text}`;
            messageDiv.style.marginBottom = '5px';

            if (msg.isCorrect) {
                messageDiv.style.color = 'green';
                messageDiv.style.fontWeight = 'bold';
            }

            messageArea.appendChild(messageDiv);
        });

        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbox('.chatbox');
});
