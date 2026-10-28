const API_BASE = '../backend/api';

const candidates = {
    '13000': {
        name: 'LulaTron',
        number: '13000',
        slogan: 'Bio Picanha — a carne artificial do futuro',
        initials: 'LT',
        theme: 'lulatron'
    },
    '14000': {
        name: 'Renan Tigrinho',
        number: '14000',
        slogan: 'Tecnologia, velocidade e memes',
        initials: 'RT',
        theme: 'renan'
    },
    '22000': {
        name: 'CyberNaro',
        number: '22000',
        slogan: 'Mais bytes, menos burocracia',
        initials: 'CN',
        theme: 'cybernaro'
    }
};

let typedNumber = '';
let blankVote = false;
let sending = false;

const digitBoxes = [...document.querySelectorAll('#digitBoxes span')];
const candidateArea = document.getElementById('candidateArea');
const toast = document.getElementById('toast');
const blankButton = document.getElementById('blankButton');
const correctButton = document.getElementById('correctButton');
const confirmButton = document.getElementById('confirmButton');

document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => addDigit(button.dataset.number));
});

blankButton.addEventListener('click', selectBlank);
correctButton.addEventListener('click', clearVote);
confirmButton.addEventListener('click', confirmVote);

document.addEventListener('keydown', event => {
    if (/^\d$/.test(event.key)) {
        addDigit(event.key);
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
        clearVote();
    }

    if (event.key === 'Enter') {
        confirmVote();
    }
});

function addDigit(number) {
    if (sending || blankVote || typedNumber.length >= 5) return;

    typedNumber += number;
    render();
}

function selectBlank() {
    if (sending) return;

    blankVote = true;
    typedNumber = '';
    render();
}

function clearVote() {
    if (sending) return;

    typedNumber = '';
    blankVote = false;
    render();
}

function render() {
    digitBoxes.forEach((box, index) => {
        box.textContent = typedNumber[index] || '';
        box.classList.toggle('filled', Boolean(typedNumber[index]));
    });

    if (blankVote) {
        candidateArea.innerHTML = `
            <div class="blank-screen">
                <span>VOTO EM</span>
                <strong>BRANCO</strong>
            </div>
        `;
        return;
    }

    if (typedNumber.length === 0) {
        candidateArea.innerHTML = `
            <div class="empty-state">
                Digite os 5 números do candidato
            </div>
        `;
        return;
    }

    if (typedNumber.length < 5) {
        candidateArea.innerHTML = `
            <div class="empty-state">
                Continue digitando...
            </div>
        `;
        return;
    }

    const candidate = candidates[typedNumber];

    if (!candidate) {
        candidateArea.innerHTML = `
            <div class="invalid-candidate">
                <strong>NÚMERO NÃO CADASTRADO</strong>
                <span>Pressione CORRIGE e tente novamente.</span>
            </div>
        `;
        return;
    }

    candidateArea.innerHTML = `
        <div class="candidate-card ${candidate.theme}">
            <div class="candidate-avatar">${candidate.initials}</div>
            <div>
                <span>Candidato</span>
                <h2>${candidate.name}</h2>
                <p>${candidate.slogan}</p>
            </div>
        </div>
    `;
}

async function confirmVote() {
    if (sending) return;

    if (!blankVote && typedNumber.length !== 5) {
        showToast('Digite os 5 números ou escolha BRANCO.', 'error');
        return;
    }

    if (!blankVote && !candidates[typedNumber]) {
        showToast('Número de candidato não cadastrado.', 'error');
        return;
    }

    sending = true;
    confirmButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/votar.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero: blankVote ? null : typedNumber,
                branco: blankVote
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Não foi possível registrar o voto.');
        }

        candidateArea.innerHTML = `
            <div class="confirmed-screen">
                <strong>FIM</strong>
                <span>Voto registrado</span>
            </div>
        `;

        showToast(data.message, 'success');

        setTimeout(() => {
            typedNumber = '';
            blankVote = false;
            sending = false;
            confirmButton.disabled = false;
            render();
        }, 1300);
    } catch (error) {
        sending = false;
        confirmButton.disabled = false;
        showToast(error.message, 'error');
    }
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.className = 'toast';
    }, 2600);
}

render();
