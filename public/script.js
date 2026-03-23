const socket = io();

// Views
const loginView = document.getElementById('login-view');
const chatView = document.getElementById('chat-view');

// Login Inputs
const usernameInput = document.getElementById('username-input');
const roomInput = document.getElementById('room-input');
const connectBtn = document.getElementById('connect-btn');

// Chat Elements
const roomDisplay = document.getElementById('room-display');
const onlineCount = document.getElementById('online-count');
const leaveBtn = document.getElementById('leave-btn');
const clearBtn = document.getElementById('clear-btn');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('msg-input');
const closeBtn = document.getElementById('close-btn');

connectBtn.addEventListener('click', () => {
    const user = usernameInput.value.trim() || 'Anonymous';
    const room = roomInput.value.trim();

    if (room) {
        loginView.classList.add('hidden');
        chatView.classList.remove('hidden');
        roomDisplay.innerText = room;

        socket.emit('joinRoom', { username: user, room: room });
    } else {
        alert('IP Address / Room Code is required.');
    }
});

socket.on('message', (message) => {
    const div = document.createElement('div');
    
    if (message.user === 'System') {
        div.className = 'system-msg';
        div.innerText = `— ${message.text} —`;
    } else {
        div.className = 'msg-line';
        div.innerHTML = `<span class="msg-user">${message.user}:</span> ${message.text}`;
    }
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({ users }) => {
    onlineCount.innerText = `${users.length} online`;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = msgInput.value;
    if (msg.trim()) {
        socket.emit('chatMessage', msg);
        msgInput.value = '';
    }
});

// Clear Button Logic
clearBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '<div class="system-msg">— Start of conversation —</div>';
});

// Close (X) button logic - clears input text
closeBtn.addEventListener('click', () => {
    msgInput.value = '';
});

// Leave Button Logic
leaveBtn.addEventListener('click', () => {
    window.location.reload(); 
});
