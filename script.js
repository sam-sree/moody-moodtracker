const daysContainer = document.querySelector(".days");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const modalDate = document.getElementById("modal-date");
const noteInput = document.getElementById("note-text");
const saveBtn = document.querySelector(".save");
const moodsEls = document.querySelectorAll(".mood");

const monthLabel = document.getElementById("month-label");
const prevBtn = document.querySelector(".month-btn.prev");
const nextBtn = document.querySelector(".month-btn.next");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
//pastel mood colors
const moodColors = {
  happy: '#F4E06D',
  calm: '#8FD694',
  anxious: '#B39DDB',
  sad: '#90CAF9',
  stressed: '#FF8A80'
};

const todayDate = new Date();
let currentMonth = todayDate.getMonth();
let currentYear = todayDate.getFullYear();

let selectedDateKey = null;
let selectedMoods = []; // Now an array

/* =========================
   CALENDAR GENERATION
   ========================= */

function generateCalendar(month, year) {
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    daysContainer.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;

    const key = `mood-${year}-${month}-${day}`;
    const saved = JSON.parse(localStorage.getItem(key));

    if (saved?.note) dayEl.classList.add("has-note");
    
    // Handle both new array format and legacy single mood format
    let dayMoods = [];
    if (saved?.moods) {
      dayMoods = saved.moods;
    } else if (saved?.mood) {
      dayMoods = [saved.mood];
    }

    if (dayMoods.length > 0) {
      applyMoodGradient(dayEl, dayMoods);
    }

    if (
      day === todayDate.getDate() &&
      month === todayDate.getMonth() &&
      year === todayDate.getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    dayEl.addEventListener("click", () => openModal(day, key));
    daysContainer.appendChild(dayEl);
  }

  monthLabel.textContent = `${months[month]} ${year}`;
}

function applyMoodGradient(el, moods) {
  let bg = "";
  if (moods.length === 1) {
    bg = moodColors[moods[0]];
  } else if (moods.length === 2) {
    bg = `linear-gradient(to bottom right, ${moodColors[moods[0]]} 50%, ${moodColors[moods[1]]} 50%)`;
  } else if (moods.length >= 3) {
    const c1 = moodColors[moods[0]];
    const c2 = moodColors[moods[1]];
    const c3 = moodColors[moods[2]];
    bg = `conic-gradient(${c1} 0 120deg, ${c2} 120deg 240deg, ${c3} 240deg 360deg)`;
  }
  
  if (bg) {
    el.style.setProperty('background', bg, 'important');
    el.style.setProperty('background-color', 'transparent', 'important');
  }
}

function openModal(day, key) {
  selectedDateKey = key;
  modalDate.textContent = `${months[currentMonth]} ${day}, ${currentYear}`;

  const saved = JSON.parse(localStorage.getItem(key));
  noteInput.value = saved?.note || "";
  
  if (saved?.moods) {
    selectedMoods = [...saved.moods];
  } else if (saved?.mood) {
    selectedMoods = [saved.mood];
  } else {
    selectedMoods = [];
  }

  console.log("Opened modal for:", key, "Existing moods:", selectedMoods);
  updateMoodPickerUI();
  modal.classList.remove("hidden");
}

function updateMoodPickerUI() {
  moodsEls.forEach(el => {
    const mood = el.dataset.mood;
    if (selectedMoods.includes(mood)) {
      el.classList.add("selected");
    } else {
      el.classList.remove("selected");
    }
  });
}

closeBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = e => e.target === modal && modal.classList.add("hidden");

moodsEls.forEach(el => {
  el.addEventListener("click", () => {
    const mood = el.dataset.mood;
    const index = selectedMoods.indexOf(mood);
    
    if (index > -1) {
      selectedMoods.splice(index, 1);
      console.log("Removed mood:", mood);
    } else {
      if (selectedMoods.length < 3) {
        selectedMoods.push(mood);
        console.log("Added mood:", mood);
      } else {
        console.log("Cap reached (3 moods max)");
      }
    }
    updateMoodPickerUI();
  });
});

saveBtn.addEventListener("click", () => {
  const note = noteInput.value.trim();
  console.log("Saving for", selectedDateKey, "Moods:", selectedMoods);

  if (!note && selectedMoods.length === 0) {
    localStorage.removeItem(selectedDateKey);
  } else {
    localStorage.setItem(
      selectedDateKey,
      JSON.stringify({ note, moods: selectedMoods })
    );
  }

  modal.classList.add("hidden");
  generateCalendar(currentMonth, currentYear);
});

nextBtn.onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
};

prevBtn.onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
};

generateCalendar(currentMonth, currentYear);
