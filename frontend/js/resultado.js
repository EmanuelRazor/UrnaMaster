const API_BASE = '../backend/api';

const realResults = document.getElementById('realResults');
const simResults = document.getElementById('simResults');
const realBlank = document.getElementById('realBlank');
const realTotal = document.getElementById('realTotal');
const simulationRules = document.getElementById('simulationRules');
const refreshButton = document.getElementById('refreshButton');
const resetButton = document.getElementById('resetButton');
const toast = document.getElementById('toast');

refreshButton.addEventListener('click', loadResults);
resetButton.addEventListener('click', resetVotes);

function candidateClass(number) {
    if (number === '13000') return 'lulatron';
    if (number === '14000') return 'renan';
    return 'cybernaro';
}

function resultRow(candidate, maxVotes = 1) {
    const percentage = maxVotes > 0
        ? Math.max(4, (candidate.votos / maxVotes) * 100)
        : 4;

    return `
        <div class="result-row">
            <div class="result-meta">
                <div>
                    <span>${candidate.numero}</span>
                    <strong>${candidate.nome}</strong>
                </div>
                <b>${candidate.votos}</b>
            </div>
            <div class="result-bar">
                <div
                    class="result-bar-fill ${candidateClass(candidate.numero)}"
                    style="width: ${percentage}%">
                </div>
            </div>
        </div>
    `;
}

async function loadResults() {
    refreshButton.disabled = true;

    try {
        const [realResponse, simResponse] = await Promise.all([
            fetch(`${API_BASE}/resultado.php`, { cache: 'no-store' }),
            fetch(`${API_BASE}/simulacao.php`, { cache: 'no-store' })
        ]);

        const realData = await realResponse.json();
        const simData = await simResponse.json();

        if (!realResponse.ok || !realData.success) {
            throw new Error(realData.message || 'Falha ao carregar a apuração.');
        }

        if (!simResponse.ok || !simData.success) {
            throw new Error(simData.message || 'Falha ao carregar a simulação.');
        }

        const realMax = Math.max(
            1,
            ...realData.candidatos.map(item => Number(item.votos))
        );

        realResults.innerHTML = realData.candidatos
            .map(item => resultRow(item, realMax))
            .join('');

        realBlank.textContent = realData.brancos;
        realTotal.textContent = `${realData.total} voto${realData.total === 1 ? '' : 's'}`;

        const simMax = Math.max(
            1,
            ...simData.simulados.map(item => Number(item.votos))
        );

        simResults.innerHTML = simData.simulados
            .map(item => resultRow(item, simMax))
            .join('');

        simulationRules.innerHTML = simData.regras
            .map(rule => `<li>${rule}</li>`)
            .join('');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        refreshButton.disabled = false;
    }
}

async function resetVotes() {
    const confirmed = window.confirm(
        'Deseja realmente apagar todos os votos registrados?'
    );

    if (!confirmed) return;

    resetButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/resetar.php`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Falha ao zerar a votação.');
        }

        showToast(data.message, 'success');
        await loadResults();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        resetButton.disabled = false;
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

loadResults();
