const landing = document.getElementById('landing');
const quiz = document.getElementById('quiz');
const loading = document.getElementById('loading');
// const result = document.getElementById('result'); // Removed

const qNumber = document.getElementById('q-number');
const qText = document.getElementById('question-text');
const aContainer = document.getElementById('answers-container');
const progressFill = document.getElementById('progress-fill');

const select = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
};

let currentQ = 0;

function startQuiz() {
    landing.classList.remove('active');
    quiz.classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    const q = qnaList[currentQ];
    qNumber.textContent = `Q${currentQ + 1}.`;
    qText.textContent = q.q;

    // Progress
    const progress = ((currentQ) / qnaList.length) * 100;
    progressFill.style.width = `${progress}%`;

    aContainer.innerHTML = '';
    q.a.forEach((answer) => {
        const btn = document.createElement('button');
        btn.classList.add('answer-btn');
        btn.textContent = answer.answer;
        btn.onclick = () => {
            handleAnswer(answer.type);
        };
        aContainer.appendChild(btn);
    });
}

function handleAnswer(types) {
    // Score update
    types.forEach(type => {
        select[type]++;
    });

    currentQ++;
    if (currentQ < qnaList.length) {
        // Animation delay for smoother feel
        setTimeout(() => {
            loadQuestion();
        }, 150);
    } else {
        showLoading();
    }
}

function showLoading() {
    quiz.classList.remove('active');
    loading.classList.add('active');

    // Simulate Processing
    setTimeout(() => {
        // loading.classList.remove('active'); // No need to remove, we redirect
        // result.classList.add('active'); // Removed
        calculateResult();
    }, 2500);
}

function calculateResult() {
    // Simple Logic mapping
    // E vs I
    // T vs F 
    // This maps to 4 basic types

    let resultIndex = 0;

    const isE = select.E >= select.I;
    const isT = select.T >= select.F;

    if (isE && isT) {
        resultIndex = 0; // Pistachio
    } else if (!isE && isT) {
        resultIndex = 1; // Dark Choco
    } else if (isE && !isT) {
        resultIndex = 2; // Strawberry
    } else {
        resultIndex = 3; // Matcha
    }

    // Redirect to static page
    const pages = [
        'results/pistachio.html',
        'results/dark-choco.html',
        'results/strawberry.html',
        'results/matcha.html'
    ];

    // Minimal delay to ensure loading screen is seen for a bit before redirect
    setTimeout(() => {
        window.location.href = pages[resultIndex];
    }, 500);
}

function restartQuiz() {
    currentQ = 0;
    // Reset Scores
    for (let key in select) select[key] = 0;

    // result.classList.remove('active'); // Removed
    landing.classList.add('active');
}

function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: '두쫀쿠 성격 테스트',
            text: '나와 어울리는 두바이 쫀득 쿠키는?',
            url: window.location.href,
        });
    } else {
        alert('링크가 복사되었습니다!');
        navigator.clipboard.writeText(window.location.href);
    }
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
