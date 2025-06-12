restartBtn.addEventListener('click', restartQuiz);

// क्विज शुरू करें
async function startQuiz() {
    try {
        // Firebase से प्रश्न लोड करेंe('hide');
        
        // क्विज वेरिएबल्स रीसेट करें
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        timeLeft = 0;
        quizStarted = true;
        
        // टाइमर शुरू करें
        startTimer();
        
        // पहला प्रश्न दिखाएं
        showQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        alert("प्रश्न लोड करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।");
    }
}

// प्रश्न दिखाएं
function showQuestion() {
    // प्रगति बार अपडेट करें
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // वर्तमान प्रश्न
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    // विकल्पों को रीसेट करें
    optionsContainer.innerHTML = '';
    
    // विकल्प बटन बनाएं
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option.text;
        button.dataset.index = index;
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });
    
    // अगला बटन छुपाएं
    nextBtn.classList.add('hide');
}

// उत्तर चुनें
function selectAnswer(e) {
    if (!quizStarted) return;
    
    const selectedButton = e.target;
    const selectedIndex = selectedButton.dataset.index;
    const currentQuestion = questions[currentQuestionIndex];
    
    // सभी विकल्पों को डिसेबल करें
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
    });
    
    // सही उत्तर चेक करें
    if (currentQuestion.options[selectedIndex].correct) {
        selectedButton.classList.add('correct');
        score += 10;
        correctAnswers++;
        pointsElement.textContent = score;
    } else {
        selectedButton.classList.add('wrong');
        wrongAnswers++;
        
        // सही उत्तर हाइलाइट करें
        currentQuestion.options.forEach((option, index) => {
            if (option.correct) {
                optionsContainer.children[index].classList.add('correct');
            }
        });
    }
    
    // अगला बटन दिखाएं (अंतिम प्रश्न नहीं होने पर)
    if (currentQuestionIndex < questions.length - 1) {
        nextBtn.classList.remove('hide');
    } else {
        // क्विज समाप्त
        setTimeout(endQuiz, 1500);
    }
}

// अगला प्रश्न दिखाएं
function showNextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// क्विज समाप्त करें
function endQuiz() {
    quizStarted = false;
    clearInterval(timer);
    
    // UI अपडेट करें
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    
    // रिजल्ट अपडेट करें
    correctAnswersElement.textContent = correctAnswers;
    wrongAnswersElement.textContent = wrongAnswers;
    totalTimeElement.textContent = formatTime(timeLeft);
    totalScoreElement.textContent = score;
    
    // प्रदर्शन स्तर
    const percentage = (correctAnswers / questions.length) * 100;
    performanceLevel.style.width = `${percentage}%`;
    
    // प्रदर्शन टेक्स्ट
    if (percentage >= 80) {
        performanceText.textContent = "उत्कृष्ट प्रदर्शन!";
    } else if (percentage >= 60) {
        performanceText.textContent = "अच्छा प्रदर्शन!";
    } else if (percentage >= 40) {
        performanceText.textContent = "सामान्य प्रदर्शन";
    } else {
        performanceText.textContent = "अभ्यास की आवश्यकता";
    }
    
    // Firebase में रिजल्ट सेव करें (वैकल्पिक)
    const userId = "user_" + Math.floor(Math.random() * 10000);
    const resultData = {
        score: score,
        correctAnswers: correctAnswers,
        timeTaken: timeLeft,
        timestamp: new Date().toISOString()
    };
    saveResultToFirebase(userId, resultData);
}

// क्विज रीस्टार्ट करें
function restartQuiz() {
    resultScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    pointsElement.textContent = "0";
    timeElement.textContent = "00:00";
}

// टाइमर फंक्शन
function startTimer() {
    timeLeft = 0;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft++;
        updateTimerDisplay();
    }, 1000);
}

// टाइमर डिस्प्ले अपडेट करें
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// समय फॉर्मेट करें
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
