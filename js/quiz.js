// Quiz functionality

// 20 quizzes data
const quizzes = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Quiz ${index + 1}`,
    questions: [
        {
            question: "What is the output of print(2**3)?",
            options: ["6", "8", "9", "5"],
            correct: 1
        },
        {
            question: "Which of these is a valid variable name?",
            options: ["2var", "_var", "var-2", "var 2"],
            correct: 1
        },
        {
            question: "What does len('Python') return?",
            options: ["5", "6", "7", "4"],
            correct: 1
        },
        {
            question: "Which data type is mutable?",
            options: ["tuple", "list", "string", "int"],
            correct: 1
        },
        {
            question: "What is the output of 'Hello' + 'World'?",
            options: ["Hello World", "HelloWorld", "Hello+World", "Error"],
            correct: 1
        }
    ],
    completed: false
}));

// Initialize quizzes display
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('quizGrid')) {
        displayQuizzes();
    }
});

// Display all quizzes
function displayQuizzes() {
    const quizGrid = document.getElementById('quizGrid');
    if (!quizGrid) return;
    
    // Get completed quizzes from localStorage
    const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
    
    quizGrid.innerHTML = '';
    quizzes.forEach(quiz => {
        const isCompleted = completedQuizzes.includes(quiz.id);
        const quizCard = document.createElement('div');
        quizCard.className = `quiz-card ${isCompleted ? 'completed' : ''}`;
        quizCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} questions</p>
            ${isCompleted ? '<span>Completed ✓</span>' : ''}
        `;
        quizCard.onclick = () => startQuiz(quiz.id);
        quizGrid.appendChild(quizCard);
    });
}

// Start a quiz
function startQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    // Store current quiz
    localStorage.setItem('currentQuiz', JSON.stringify(quiz));
    
    // Create quiz modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.id = 'quizModal';
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        const question = quiz.questions[currentQuestion];
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="close" onclick="document.getElementById('quizModal').remove()">&times;</span>
                <h2>${quiz.title} - Question ${currentQuestion + 1}/${quiz.questions.length}</h2>
                <p>${question.question}</p>
                <div style="margin: 1rem 0;">
                    ${question.options.map((opt, idx) => `
                        <div style="margin: 0.5rem 0;">
                            <input type="radio" name="answer" value="${idx}" id="opt${idx}">
                            <label for="opt${idx}">${opt}</label>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; gap: 1rem;">
                    ${currentQuestion > 0 ? '<button onclick="previousQuestion()" class="btn secondary">Previous</button>' : ''}
                    <button onclick="nextQuestion()" class="btn primary">Next</button>
                </div>
            </div>
        `;
        
        // Add navigation functions
        window.previousQuestion = function() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
            }
        };
        
        window.nextQuestion = function() {
            // Check answer
            const selected = document.querySelector('input[name="answer"]:checked');
            if (selected && parseInt(selected.value) === question.correct) {
                score++;
            }
            
            if (currentQuestion < quiz.questions.length - 1) {
                currentQuestion++;
                showQuestion();
            } else {
                // Quiz completed
                showResults();
            }
        };
    }
    
    function showResults() {
        const passThreshold = 3; // Need 3/5 correct to pass
        const passed = score >= passThreshold;
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h2>Quiz Results</h2>
                <p style="font-size: 2rem; margin: 1rem 0;">${score}/${quiz.questions.length}</p>
                <p style="color: ${passed ? '#4caf50' : '#f44336'};">
                    ${passed ? 'Congratulations! You passed!' : 'Try again to pass the quiz.'}
                </p>
                <button onclick="document.getElementById('quizModal').remove()" class="btn primary">Close</button>
            </div>
        `;
        
        // Update completion status
        if (passed) {
            let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
            if (!completedQuizzes.includes(quiz.id)) {
                completedQuizzes.push(quiz.id);
                localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
            }
        }
    }
    
    document.body.appendChild(modal);
    showQuestion();
}