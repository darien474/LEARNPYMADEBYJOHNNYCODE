// Main JavaScript file

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateUserInfo();
    
    // Add event listeners
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('loginForm')?.addEventListener('submit', login);
});

// Global functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        hideLoginModal();
    }
}