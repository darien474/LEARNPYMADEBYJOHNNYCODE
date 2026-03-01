// Python IDE functionality using Pyodide

let pyodide;

// Initialize Pyodide
async function initPyodide() {
    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
        });
        console.log("Pyodide loaded");
    }
    return pyodide;
}

// Run Python code
async function runCode() {
    const code = document.getElementById('codeEditor').value;
    const output = document.getElementById('output');
    
    try {
        output.textContent = 'Running...';
        
        // Initialize Pyodide if needed
        await initPyodide();
        
        // Redirect stdout to capture print statements
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        
        // Run the user's code
        pyodide.runPython(code);
        
        // Get the output
        const result = pyodide.runPython('sys.stdout.getvalue()');
        output.textContent = result || 'Code executed successfully (no output)';
    } catch (error) {
        output.textContent = 'Error: ' + error.message;
    }
}

// Check answer against solution
async function checkAnswer() {
    const code = document.getElementById('codeEditor').value;
    const question = JSON.parse(localStorage.getItem('currentQuestion'));
    
    if (!question) {
        alert('Please select a question first');
        return;
    }
    
    // Simple solution check (in production, use more sophisticated comparison)
    if (code.trim() === question.solution.trim()) {
        alert('Correct! Great job!');
        
        // Track progress
        let progress = JSON.parse(localStorage.getItem('questionProgress') || '[]');
        if (!progress.includes(question.id)) {
            progress.push(question.id);
            localStorage.setItem('questionProgress', JSON.stringify(progress));
        }
    } else {
        alert('Not quite right. Try again!');
    }
}

// Initialize code editor with example
document.addEventListener('DOMContentLoaded', function() {
    const codeEditor = document.getElementById('codeEditor');
    if (codeEditor) {
        // Load last edited code if exists
        const savedCode = localStorage.getItem('lastCode');
        if (savedCode) {
            codeEditor.value = savedCode;
        }
        
        // Save code periodically
        codeEditor.addEventListener('input', function() {
            localStorage.setItem('lastCode', this.value);
        });
    }
});