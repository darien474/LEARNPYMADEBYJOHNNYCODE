// Authentication functions

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Update user info display
function updateUserInfo() {
    const user = localStorage.getItem('currentUser');
    const userInfo = document.getElementById('userInfo');
    
    if (user && userInfo) {
        userInfo.textContent = `Welcome, ${user}!`;
    }
}

// Login function
function login(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in production, use proper backend)
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        hideLoginModal();
        checkAuth();
        updateUserInfo();
        alert('Login successful!');
    } else {
        alert('Invalid username or password');
    }
}

// Register function
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        alert('Username already exists');
    } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        hideLoginModal();
        checkAuth();
        updateUserInfo();
        alert('Registration successful!');
    }
}

// Logout function
function logout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    checkAuth();
    updateUserInfo();
    window.location.href = 'index.html';
}
