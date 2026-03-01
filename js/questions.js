// Questions data and functions

// 100 Python questions
const questions = [
    // Beginner Questions (1-40)
    {
        id: 1,
        title: "Hello World",
        category: "beginner",
        description: "Write a program that prints 'Hello, World!' to the console.",
        example: "print('Hello, World!')",
        solution: "print('Hello, World!')"
    },
    {
        id: 2,
        title: "Variables",
        category: "beginner",
        description: "Create a variable 'name' with your name and print it.",
        example: "name = 'John'\nprint(name)",
        solution: "name = 'John'\nprint(name)"
    },
    {
        id: 3,
        title: "Basic Arithmetic",
        category: "beginner",
        description: "Calculate and print the sum of 5 and 3.",
        example: "print(5 + 3)",
        solution: "print(5 + 3)"
    },
    {
        id: 4,
        title: "User Input",
        category: "beginner",
        description: "Ask the user for their name and print a greeting.",
        example: "name = input('Enter your name: ')\nprint('Hello,', name)",
        solution: "name = input('Enter your name: ')\nprint('Hello,', name)"
    },
    {
        id: 5,
        title: "If Statement",
        category: "beginner",
        description: "Check if a number is positive and print the result.",
        example: "num = 5\nif num > 0:\n    print('Positive')",
        solution: "num = 5\nif num > 0:\n    print('Positive')"
    },
    // Add more beginner questions...
    
    // Intermediate Questions (41-80)
    {
        id: 41,
        title: "List Comprehension",
        category: "intermediate",
        description: "Create a list of squares from 1 to 10 using list comprehension.",
        example: "squares = [x**2 for x in range(1, 11)]\nprint(squares)",
        solution: "squares = [x**2 for x in range(1, 11)]\nprint(squares)"
    },
    // Add more intermediate questions...
    
    // Advanced Questions (81-100)
    {
        id: 81,
        title: "Decorators",
        category: "advanced",
        description: "Create a simple decorator that prints 'Function called' before execution.",
        example: "def decorator(func):\n    def wrapper():\n        print('Function called')\n        return func()\n    return wrapper\n\n@decorator\ndef hello():\n    print('Hello')",
        solution: "def decorator(func):\n    def wrapper():\n        print('Function called')\n        return func()\n    return wrapper\n\n@decorator\ndef hello():\n    print('Hello')"
    }
    // Add more questions to reach 100...
];

// Initialize questions display
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('questionsList')) {
        displayQuestions('all');
    }
});

// Display questions based on category
function displayQuestions(category) {
    const questionsList = document.getElementById('questionsList');
    if (!questionsList) return;
    
    const filteredQuestions = category === 'all' 
        ? questions 
        : questions.filter(q => q.category === category);
    
    questionsList.innerHTML = '';
    filteredQuestions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.setAttribute('data-id', q.id);
        questionDiv.innerHTML = `
            <h4>${q.id}. ${q.title}</h4>
            <small>${q.category}</small>
        `;
        questionDiv.onclick = () => loadQuestion(q.id);
        questionsList.appendChild(questionDiv);
    });
}

// Filter questions by category
function filterQuestions(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Display filtered questions
    displayQuestions(category);
}

// Load specific question
function loadQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    
    // Update active state in list
    document.querySelectorAll('.question-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.question-item[data-id="${id}"]`).classList.add('active');
    
    // Display question
    document.getElementById('questionTitle').textContent = `${id}. ${question.title}`;
    document.getElementById('questionDescription').textContent = question.description;
    document.getElementById('questionExample').innerHTML = `
        <h4>Example:</h4>
        <pre>${question.example}</pre>
    `;
    
    // Set current question for IDE
    localStorage.setItem('currentQuestion', JSON.stringify(question));
}