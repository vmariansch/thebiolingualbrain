 const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
});

const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.topbar nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

const regions = {
  ifg: {
    title: 'Left inferior frontal gyrus',
    text: 'Part of the network involved in selecting and producing the intended language while managing competition from the other language.'
  },
  presma: {
    title: 'pre-SMA',
    text: 'The pre-supplementary motor area contributes to action selection and switching, helping coordinate a change from one language response to another.'
  },
  acc: {
    title: 'Anterior cingulate cortex (ACC)',
    text: 'The ACC is involved in monitoring conflict and detecting when competing responses require additional control.'
  },
  caudate: {
    title: 'Caudate nucleus',
    text: 'A structure involved in selection and control. It is part of the broader network recruited when bilingual speakers manage competing language options.'
  },
  ipl: {
    title: 'Inferior parietal lobule (IPL)',
    text: 'This region is associated with language processing and has been among the areas where bilingual-related structural differences have been reported.'
  }
};
document.querySelectorAll('.region-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.region-tab').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const region = regions[tab.dataset.region];
    document.getElementById('regionTitle').textContent = region.title;
    document.getElementById('regionText').textContent = region.text;
  });
});

const questions = [
  {
    question: 'When a bilingual person speaks one language, what can happen to the other language?',
    answers: ['It becomes completely inactive.', 'It can remain active in parallel.', 'It is temporarily erased from memory.'],
    correct: 1,
    explanation: 'Exactly. Parallel activation means both languages can remain active, which makes language control necessary.'
  },
  {
    question: 'What does a later onset of dementia symptoms in some bilingual studies demonstrate?',
    answers: ['Bilingualism prevents dementia pathology.', 'Bilingualism guarantees better memory.', 'It may be consistent with cognitive reserve, not prevention of pathology.'],
    correct: 2,
    explanation: 'Right. Cognitive reserve may help maintain function for longer despite underlying disease. Later symptoms do not mean less pathology.'
  },
  {
    question: 'Which statement best describes the “bilingual advantage” in executive function?',
    answers: ['It is a settled, universal benefit.', 'It is debated; large-scale evidence has not found a reliable overall advantage.', 'It applies equally to every bilingual person and every task.'],
    correct: 1,
    explanation: 'Correct. Some studies report advantages, but the overall claim is contested and results vary with samples, tasks and context.'
  }
];
let currentQuestion = 0;
let score = 0;
let answered = false;
const questionText = document.getElementById('questionText');
const answersBox = document.getElementById('answers');
const feedback = document.getElementById('quizFeedback');
const nextButton = document.getElementById('nextQuestion');
const quizProgress = document.getElementById('quizProgress');
const questionCount = document.getElementById('questionCount');
const scoreLabel = document.getElementById('scoreLabel');
const quizHint = document.getElementById('quizHint');

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionText.textContent = item.question;
  questionCount.textContent = `QUESTION 0${currentQuestion + 1} / 03`;
  scoreLabel.textContent = `SCORE: ${score}`;
  quizProgress.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  feedback.textContent = '';
  quizHint.textContent = 'CHOOSE ONE ANSWER';
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'See results <span>→</span>' : 'Next question <span>→</span>';
  answersBox.innerHTML = '';
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));
    answersBox.appendChild(button);
  });
}
function chooseAnswer(selected) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answersBox.querySelectorAll('.answer')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add('correct');
    if (index === selected && selected !== item.correct) button.classList.add('wrong');
  });
  if (selected === item.correct) {
    score++;
    feedback.textContent = `✓ ${item.explanation}`;
  } else {
    feedback.textContent = `Not quite. ${item.explanation}`;
  }
  scoreLabel.textContent = `SCORE: ${score}`;
  quizHint.textContent = 'ANSWER RECORDED';
  nextButton.disabled = false;
}
nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    questionCount.textContent = 'QUIZ COMPLETE';
    questionText.textContent = `You scored ${score} out of ${questions.length}.`;
    answersBox.innerHTML = '';
    feedback.textContent = score === 3
      ? 'Excellent. You can separate the strong findings from the claims that remain debated.'
      : 'Good review. Revisit the evidence and aging sections to reinforce the key distinctions.';
    quizHint.textContent = 'KEEP QUESTIONING THE EVIDENCE';
    nextButton.textContent = 'Try again ↻';
    nextButton.disabled = false;
    nextButton.onclick = () => {
      currentQuestion = 0;
      score = 0;
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});
renderQuestion();
