// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth and database references
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements - Authentication
const loginBtn = document.getElementById('loginBtn');
const homeLoginBtn = document.getElementById('homeLoginBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const loginForm = document.getElementById('loginForm');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const submitRegisterBtn = document.getElementById('submitRegisterBtn');
const guestLoginBtn = document.getElementById('guestLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const userName = document.getElementById('userName');
const dashboardBtn = document.getElementById('dashboardBtn');
const dashboard = document.getElementById('dashboard');
const userEmail = document.getElementById('userEmail');
const userType = document.getElementById('userType');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// DOM elements - Contact form
const contactForm = document.getElementById('contactForm');

// Show login modal
function showLoginModal() {
    loginModal.show();
}

// Login event listeners
loginBtn.addEventListener('click', showLoginModal);
homeLoginBtn.addEventListener('click', showLoginModal);

// Dashboard button
dashboardBtn.addEventListener('click', function() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show dashboard
    dashboard.style.display = 'block';
});

// Login as guest
guestLoginBtn.addEventListener('click', () => {
    auth.signInAnonymously()
        .then(() => {
            console.log("Signed in as guest!");
            loginModal.hide();
        })
        .catch(error => {
            console.error("Error signing in as guest:", error);
            alert("Error signing in as guest: " + error.message);
        });
});

// Register with email/password
submitRegisterBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("Registered and signed in!");
            loginModal.hide();
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch(error => {
            console.error("Error registering:", error);
            alert("Error registering: " + error.message);
        });
});

// Login with email/password
submitLoginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("Signed in!");
            loginModal.hide();
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch(error => {
            console.error("Error signing in:", error);
            alert("Error signing in: " + error.message);
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("Signed out!");
            // Return to home page if on dashboard
            if (dashboard.style.display === 'block') {
                dashboard.style.display = 'none';
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = '';
                });
            }
        })
        .catch(error => {
            console.error("Error signing out:", error);
        });
});

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('message').value;
        
        // Save to Firestore
        db.collection('messages').add({
            name: name,
            email: email,
            message: message,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userId: auth.currentUser ? auth.currentUser.uid : 'anonymous'
        })
        .then(() => {
            alert('Message sent successfully!');
            contactForm.reset();
        })
        .catch(error => {
            console.error("Error sending message:", error);
            alert("Error sending message: " + error.message);
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        
        // Update UI
        loginBtn.style.display = 'none';
        userGreeting.style.display = 'flex';
        
        // Update dashboard
        if (user.isAnonymous) {
            userName.textContent = 'Guest';
            userEmail.textContent = 'Email: Not available (Guest)';
            userType.textContent = 'Account Type: Guest';
        } else {
            userName.textContent = user.email.split('@')[0];
            userEmail.textContent = 'Email: ' + user.email;
            userType.textContent = 'Account Type: Registered User';
        }
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Update UI
        loginBtn.style.display = 'block';
        userGreeting.style.display = 'none';
        dashboard.style.display = 'none';
        
        // Make sure sections are visible if coming from dashboard
        document.querySelectorAll('section').forEach(section => {
            section.style.display = '';
        });
    }
});