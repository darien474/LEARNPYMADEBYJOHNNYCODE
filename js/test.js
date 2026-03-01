// Final tests functionality

// 5 final tests data
const finalTests = Array(5).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Final Test ${index + 1}`,
    description: `Complete this test to progress toward certification`,
    questions: [
        {
            question: "What is the correct way to create a function in Python?",
            options: ["function myFunction():", "def myFunction():", "create myFunction():", "func myFunction():"],
            correct: 1
        },
        {
            question: "Which of these is a Python framework?",
            options: ["Django", "Laravel", "Spring", "Rails"],
            correct: 0
        },
        {
            question: "What does pip stand for?",
            options: ["Python Installer Program", "Pip Installs Packages", "Python Index Package", "Package Installer for Python"],
            correct: 1
        },
        {
            question: "Which data type is immutable?",
            options: ["list", "dict", "set", "tuple"],
            correct: 3
        },
        {
            question: "What is the output of print(10 // 3)?",
            options: ["3.33", "3", "4", "3.0"],
            correct: 1
        }
    ],
    completed: false
}));

// Initialize tests display
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('testsContainer')) {
        displayTests();
        updateTestProgress();
    }
});

// Display all tests
function displayTests() {
    const testsContainer = document.getElementById('testsContainer');
    if (!testsContainer) return;
    
    // Get completed tests from localStorage
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    
    testsContainer.innerHTML = '';
    finalTests.forEach(test => {
        const isCompleted = completedTests.includes(test.id);
        const isLocked = test.id > 1 && !completedTests.includes(test.id - 1);
        
        const testCard = document.createElement('div');
        testCard.className = `test-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        testCard.innerHTML = `
            <h3>${test.title}</h3>
            <p>${test.description}</p>
            <p>${test.questions.length} questions</p>
            ${isCompleted ? '<span>Completed ✓</span>' : ''}
            ${isLocked ? '<span style="color: #999;">🔒 Complete previous test first</span>' : ''}
        `;
        
        if (!isLocked) {
            testCard.onclick = () => startTest(test.id);
        }
        
        testsContainer.appendChild(testCard);
    });
}

// Update test progress bar
function updateTestProgress() {
    const completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
    const progress = (completedTests.length / finalTests.length) * 100;
    
    const progressBar = document.getElementById('testProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${completedTests.length}/${finalTests.length} Tests`;
    }
    
    // Check if all tests are completed
    if (completedTests.length === finalTests.length) {
        setTimeout(() => {
            if (confirm('Congratulations! You have completed all tests! Would you like to view your certificate?')) {
                window.location.href = 'certification.html';
            }
        }, 500);
    }
}

// Start a test
function startTest(testId) {
    const test = finalTests.find(t => t.id === testId);
    if (!test) return;
    
    // Check if user is logged in
    if (!localStorage.getItem('currentUser')) {
        alert('Please login to take tests');
        showLoginModal();
        return;
    }
    
    // Create test modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.id = 'testModal';
    
    let currentQuestion = 0;
    let answers = new Array(test.questions.length).fill(null);
    let timeLeft = 300; // 5 minutes per test
    
    // Timer
    const timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitTest();
        }
    }, 1000);
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            timerDisplay.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            if (timeLeft < 60) {
                timerDisplay.style.color = 'red';
            }
        }
    }
    
    function showQuestion() {
        const question = test.questions[currentQuestion];
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="close" onclick="closeTestModal()">&times;</span>
                    <h2>${test.title} - Question ${currentQuestion + 1}/${test.questions.length}</h2>
                    <div id="timer"></div>
                </div>
                <p style="margin: 1rem 0; font-size: 1.1rem;">${question.question}</p>
                <div style="margin: 1rem 0;">
                    ${question.options.map((opt, idx) => `
                        <div style="margin: 0.5rem 0;">
                            <input type="radio" name="answer" value="${idx}" id="opt${idx}" ${answers[currentQuestion] === idx ? 'checked' : ''}>
                            <label for="opt${idx}">${opt}</label>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                    <button onclick="previousQuestion()" class="btn secondary" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button>
                    <div>
                        <span style="margin-right: 1rem;">Question ${currentQuestion + 1}/${test.questions.length}</span>
                        ${currentQuestion < test.questions.length - 1 ? 
                            '<button onclick="nextQuestion()" class="btn primary">Next</button>' : 
                            '<button onclick="submitTest()" class="btn primary">Submit Test</button>'}
                    </div>
                </div>
            </div>
        `;
        
        updateTimer();
        
        // Add navigation functions
        window.previousQuestion = function() {
            if (currentQuestion > 0) {
                // Save current answer
                const selected = document.querySelector('input[name="answer"]:checked');
                if (selected) {
                    answers[currentQuestion] = parseInt(selected.value);
                }
                currentQuestion--;
                showQuestion();
            }
        };
        
        window.nextQuestion = function() {
            // Save current answer
            const selected = document.querySelector('input[name="answer"]:checked');
            if (selected) {
                answers[currentQuestion] = parseInt(selected.value);
            }
            
            if (currentQuestion < test.questions.length - 1) {
                currentQuestion++;
                showQuestion();
            }
        };
        
        window.closeTestModal = function() {
            clearInterval(timer);
            modal.remove();
        };
    }
    
    function submitTest() {
        clearInterval(timer);
        
        // Calculate score
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === test.questions[index].correct) {
                score++;
            }
        });
        
        const passThreshold = 3; // Need 3/5 correct to pass
        const passed = score >= passThreshold;
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h2>Test Results</h2>
                <p style="font-size: 2rem; margin: 1rem 0;">${score}/${test.questions.length}</p>
                <p style="color: ${passed ? '#4caf50' : '#f44336'};">
                    ${passed ? 'Congratulations! You passed!' : 'You need to score at least 3/5 to pass.'}
                </p>
                <button onclick="document.getElementById('testModal').remove(); location.reload();" class="btn primary">Close</button>
            </div>
        `;
        
        // Update completion status
        if (passed) {
            let completedTests = JSON.parse(localStorage.getItem('completedTests') || '[]');
            if (!completedTests.includes(test.id)) {
                completedTests.push(test.id);
                localStorage.setItem('completedTests', JSON.stringify(completedTests));
            }
        }
        
        // Refresh display
        displayTests();
        updateTestProgress();
    }
    
    document.body.appendChild(modal);
    showQuestion();
}

// Global function to start test
window.startTest = startTest;