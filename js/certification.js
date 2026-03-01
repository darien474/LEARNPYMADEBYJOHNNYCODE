// Certification functionality

// Initialize certification page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('certificate')) {
        checkCertificationEligibility();
        displayCertificate();
    }
});

// Check if user has completed all tests
function checkCertificationEligibility() {
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    const user = localStorage.getItem('currentUser');
    
    if (!user) {
        alert('Please login to view your certificate');
        window.location.href = 'index.html';
        return;
    }
    
    if (completedTests.length < 5) {
        alert('You need to complete all 5 tests before viewing your certificate');
        window.location.href = 'test.html';
        return;
    }
}

// Display certificate with user name
function displayCertificate() {
    const userName = localStorage.getItem('currentUser');
    document.getElementById('userName').textContent = userName || 'Student';
}

// Download certificate as image/PDF
function downloadCertificate() {
    const userName = localStorage.getItem('currentUser') || 'Student';
    const certificate = document.getElementById('certificate');
    
    // Simple HTML to image download
    const certificateHTML = `
        <div style="background: white; padding: 3rem; text-align: center; max-width: 600px; margin: 0 auto; border-radius: 10px; box-shadow: 0 5px 30px rgba(0,0,0,0.2);">
            <h1 style="color: #667eea; margin-bottom: 2rem;">Certificate of Completion</h1>
            <p>This is to certify that</p>
            <h2 style="font-size: 2rem; margin: 1rem 0; color: #333;">${userName}</h2>
            <p>has successfully completed all Python tests</p>
            <div style="font-size: 1.5rem; color: #4caf50; margin: 2rem 0; font-weight: bold;">
                Congratulations. You learn python!
            </div>
            <div style="margin-top: 2rem; color: #666;">
                <p>Made by JohnnyCode</p>
                <p>PyLearn Platform</p>
            </div>
        </div>
    `;
    
    // Create a new window for printing/saving
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Python Certificate - ${userName}</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                </style>
            </head>
            <body>
                ${certificateHTML}
                <p style="text-align: center; color: white; margin-top: 1rem;">Click Ctrl+P (or Cmd+P on Mac) to save as PDF</p>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Track test progress for certificate
function trackTestProgress() {
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    const progress = (completedTests.length / 5) * 100;
    
    if (document.getElementById('certificateProgress')) {
        document.getElementById('certificateProgress').style.width = `${progress}%`;
    }
    
    return completedTests.length === 5;
}