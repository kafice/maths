mkdir -p my-firebase-website && cd my-firebase-website && touch index.html styles.css app.js && echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>My Responsive Website</title>
    <!-- Bootstrap CSS for responsiveness -->
    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">
    <!-- Your custom CSS -->
    <link rel=\"stylesheet\" href=\"styles.css\">
</head>
<body>
    <!-- Navigation -->
    <nav class=\"navbar navbar-expand-lg navbar-light bg-light\">
        <div class=\"container\">
            <a class=\"navbar-brand\" href=\"#\">My Website</a>
            <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarNav\">
                <span class=\"navbar-toggler-icon\"></span>
            </button>
            <div class=\"collapse navbar-collapse\" id=\"navbarNav\">
                <ul class=\"navbar-nav ms-auto\">
                    <li class=\"nav-item\">
                        <a class=\"nav-link\" href=\"#\">Home</a>
                    </li>
                    <li class=\"nav-item\">
                        <a class=\"nav-link\" href=\"#\">About</a>
                    </li>
                    <li class=\"nav-item\">
                        <button id=\"loginBtn\" class=\"btn btn-outline-primary\">Login</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class=\"container mt-5\">
        <div class=\"row\">
            <div class=\"col-md-8\">
                <h1>Welcome to My Website</h1>
                <p>This is a responsive website with Firebase integration.</p>
                <div id=\"guestContent\" style=\"display: none;\">
                    <div class=\"alert alert-info\">
                        You're browsing as a guest. <button id=\"registerBtn\" class=\"btn btn-sm btn-primary\">Register</button>
                    </div>
                </div>
                <div id=\"userContent\" style=\"display: none;\">
                    <div class=\"alert alert-success\">
                        You're logged in! <button id=\"logoutBtn\" class=\"btn btn-sm btn-outline-danger\">Logout</button>
                    </div>
                </div>
            </div>
            <div class=\"col-md-4\">
                <div class=\"card\">
                    <div class=\"card-body\">
                        <h5 class=\"card-title\">Login/Register</h5>
                        <div id=\"loginForm\">
                            <div class=\"mb-3\">
                                <label for=\"email\" class=\"form-label\">Email</label>
                                <input type=\"email\" class=\"form-control\" id=\"email\">
                            </div>
                            <div class=\"mb-3\">
                                <label for=\"password\" class=\"form-label\">Password</label>
                                <input type=\"password\" class=\"form-control\" id=\"password\">
                            </div>
                            <button id=\"submitLoginBtn\" class=\"btn btn-primary\">Login</button>
                            <button id=\"submitRegisterBtn\" class=\"btn btn-secondary\">Register</button>
                            <button id=\"guestLoginBtn\" class=\"btn btn-link\">Continue as Guest</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>
    
    <!-- Firebase App (the core Firebase SDK) -->
    <script src=\"https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js\"></script>
    <!-- Firebase Authentication -->
    <script src=\"https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js\"></script>
    <!-- Firebase Database -->
    <script src=\"https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js\"></script>
    
    <!-- Your JavaScript file -->
    <script src=\"app.js\"></script>
</body>
</html>" > index.html && echo "/* Your custom styles */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

.navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    h1 {
        font-size: 1.8rem;
    }
}" > styles.css && echo "// Your Firebase configuration (replace with your actual config from Firebase console)
const firebaseConfig = {
    apiKey: \"YOUR_API_KEY\",
    authDomain: \"YOUR_PROJECT_ID.firebaseapp.com\",
    projectId: \"YOUR_PROJECT_ID\",
    storageBucket: \"YOUR_PROJECT_ID.appspot.com\",
    messagingSenderId: \"YOUR_MESSAGING_SENDER_ID\",
    appId: \"YOUR_APP_ID\"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth references
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const submitRegisterBtn = document.getElementById('submitRegisterBtn');
const guestLoginBtn = document.getElementById('guestLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const registerBtn = document.getElementById('registerBtn');
const guestContent = document.getElementById('guestContent');
const userContent = document.getElementById('userContent');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Login as guest
guestLoginBtn.addEventListener('click', () => {
    auth.signInAnonymously()
        .then(() => {
            console.log(\"Signed in as guest!\");
        })
        .catch(error => {
            console.error(\"Error signing in as guest:\", error);
            alert(\"Error signing in as guest: \" + error.message);
        });
});

// Register with email/password
submitRegisterBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log(\"Registered and signed in!\");
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch(error => {
            console.error(\"Error registering:\", error);
            alert(\"Error registering: \" + error.message);
        });
});

// Login with email/password
submitLoginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log(\"Signed in!\");
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch(error => {
            console.error(\"Error signing in:\", error);
            alert(\"Error signing in: \" + error.message);
        });
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log(\"Signed out!\");
        })
        .catch(error => {
            console.error(\"Error signing out:\", error);
        });
});

// Convert anonymous account to permanent
registerBtn.addEventListener('click', () => {
    // Show the login form
    loginForm.style.display = 'block';
    alert(\"Please create an account with email and password\");
});

// Auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log(\"User is signed in:\", user);
        loginForm.style.display = 'none';
        loginBtn.style.display = 'none';
        
        if (user.isAnonymous) {
            // Guest user
            guestContent.style.display = 'block';
            userContent.style.display = 'none';
        } else {
            // Registered user
            guestContent.style.display = 'none';
            userContent.style.display = 'block';
        }
    } else {
        // User is signed out
        console.log(\"User is signed out\");
        loginForm.style.display = 'block';
        loginBtn.style.display = 'block';
        guestContent.style.display = 'none';
        userContent.style.display = 'none';
    }
});" > app.js