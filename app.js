const API_URL = "https://sheetdb.io/api/v1/05oc6xnvsq1hc";
let hadisDB = [];

// Fetch data
async function fetchHadis() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Filter kosong
    hadisDB = data.filter(item => item.teks_arab).map(item => ({
      lafaz: item.teks_arab,
      terjemah: item.terjemah,
      summary: item.summary,
      analysis: [
        { title: "Analisis Lughawi", content: item.analisis_lughawi },
        { title: "Analisis Kontekstual", content: item.analisis_kontekstual },
        { title: "Analisis Tematika", content: item.analisis_tematika },
        { title: "Implikasi Hukum", content: item.implikasi_hukum },
        { title: "Relevansi Kekinian", content: item.relevansi_kekinian }
      ]
    }));

    renderHadis(hadisDB);
  } catch (err) {
    console.error(err);
    document.getElementById('hadis-container').innerHTML = "<p>Gagal memuat data.</p>";
  }
}

// Render card
function renderHadis(data) {
  const container = document.getElementById('hadis-container');
  container.innerHTML = '';

  data.forEach(hadis => {
    const card = document.createElement('div');
    card.className = 'hadis-card';

    // Generate HTML card
    card.innerHTML = `
      <h2 class="lafaz">${hadis.lafaz}</h2>
      <p class="terjemah">${hadis.terjemah}</p>
      <div class="summary">${hadis.summary}</div>

      <div class="actions">
        <button class="btn-audio">🔊 Dengarkan Lafaz</button>
      </div>

      <div class="wave-container">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>

      <div class="accordion">
        ${hadis.analysis.map((a, idx) => `
          <button class="accordion-btn">${a.title}</button>
          <div class="panel"><p>${a.content}</p></div>
        `).join('')}
      </div>
    `;

    container.appendChild(card);

    // Audio
    const audioBtn = card.querySelector('.btn-audio');
    const waves = card.querySelectorAll('.wave');
    audioBtn.addEventListener('click', () => {
      speechSynthesis.cancel();
      waves.forEach(w => w.style.animationPlayState = 'running');

      const utterance = new SpeechSynthesisUtterance(hadis.lafaz);
      utterance.lang = "ar-SA";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => waves.forEach(w => w.style.animationPlayState = 'paused');
      speechSynthesis.speak(utterance);
    });

    // Accordion
    const accBtns = card.querySelectorAll('.accordion-btn');
    const panels = card.querySelectorAll('.panel');
    accBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        panels[i].style.display = panels[i].style.display === 'block' ? 'none' : 'block';
      });
    });
  });
}

// Search
function searchHadis() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const filtered = hadisDB.filter(h =>
    h.lafaz.toLowerCase().includes(keyword) ||
    h.terjemah.toLowerCase().includes(keyword) ||
    h.summary.toLowerCase().includes(keyword)
  );
  renderHadis(filtered);
}

// Initial fetch
fetchHadis();
 