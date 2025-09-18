// Your Firebase config (replace with your project’s values)
const firebaseConfig = {
    apiKey: "AIzaSyDpOCiiqEUBSEs_ELo7oyng6TI9-8i2KBM",
    authDomain: "to-do-list-163b8.firebaseapp.com",
    databaseURL: "https://to-do-list-163b8-default-rtdb.firebaseio.com",
    projectId: "to-do-list-163b8",
    storageBucket: "to-do-list-163b8.firebasestorage.app",
    messagingSenderId: "506026591571",
    appId: "1:506026591571:web:94ff9c8bd67c98e9e40da6"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const sidebar = document.querySelector(".sidebar");

let lastMessageKey = null; // store the last message key

// Create admin buttons (hidden by default)
const resetBtn = document.createElement("button");
resetBtn.textContent = "RESET";
resetBtn.style.background = "#d83c3e";
resetBtn.style.color = "white";
resetBtn.style.width = "100%";
resetBtn.style.padding = "10px";
resetBtn.style.marginTop = "10px";
resetBtn.style.border = "none";
resetBtn.style.borderRadius = "4px";
resetBtn.style.cursor = "pointer";

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "DELETE LAST";
deleteBtn.style.background = "#f04747";
deleteBtn.style.color = "white";
deleteBtn.style.width = "100%";
deleteBtn.style.padding = "10px";
deleteBtn.style.marginTop = "10px";
deleteBtn.style.border = "none";
deleteBtn.style.borderRadius = "4px";
deleteBtn.style.cursor = "pointer";

// Listen for new messages
db.ref("messages").on("child_added", snapshot => {
  const data = snapshot.val();
  lastMessageKey = snapshot.key; // track the last message key
  displayMessage(data.name, data.text);
});

function displayMessage(name, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  msgDiv.innerHTML = `<span class="author">${name}:</span> <span class="text">${text}</span>`;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message
sendBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim() || "Anonymous";
  const text = messageInput.value.trim();
  if (text.length > 0) {
    db.ref("messages").push({
      name: name,
      text: text
    });
    messageInput.value = "";
  }
});

// Allow "Enter" key to send
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Detect admin username
usernameInput.addEventListener("input", () => {
  if (usernameInput.value === "1234567890abcdefghij") {
    if (!sidebar.contains(resetBtn)) sidebar.appendChild(resetBtn);
    if (!sidebar.contains(deleteBtn)) sidebar.appendChild(deleteBtn);
  } else {
    if (sidebar.contains(resetBtn)) sidebar.removeChild(resetBtn);
    if (sidebar.contains(deleteBtn)) sidebar.removeChild(deleteBtn);
  }
});

// Admin actions
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to RESET all messages?")) {
    db.ref("messages").remove();
    messagesDiv.innerHTML = "";
  }
});

deleteBtn.addEventListener("click", () => {
  if (lastMessageKey) {
    db.ref("messages").child(lastMessageKey).remove();
    messagesDiv.removeChild(messagesDiv.lastElementChild);
    lastMessageKey = null;
  }
});
