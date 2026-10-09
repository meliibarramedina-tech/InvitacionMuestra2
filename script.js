const audio = document.querySelector("#song");
const playButton = document.querySelector("#play-toggle");
const progress = document.querySelector("#music-progress");
const currentTimeLabel = document.querySelector("#current-time");
const durationLabel = document.querySelector("#duration");
const musicNote = document.querySelector("#music-note");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicNote.textContent = "Reproduciendo la canción";
    } catch {
      musicNote.textContent = "No se pudo reproducir el archivo de audio.";
    }
  } else {
    audio.pause();
    musicNote.textContent = "Canción en pausa";
  }
});

audio.addEventListener("play", () => {
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Pausar canción");
});

audio.addEventListener("pause", () => {
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Reproducir canción");
});

audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration)) {
    progress.value = String((audio.currentTime / audio.duration) * 100);
  }
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

function getNextPartyDate() {
  const now = new Date();
  const eventDate = new Date(now.getFullYear(), 5, 16, 19, 0, 0);
  return eventDate > now ? eventDate : new Date(now.getFullYear() + 1, 5, 16, 19, 0, 0);
}

const partyDate = getNextPartyDate();
const heroDate = document.querySelector("#hero-date");
const partyDateLabel = document.querySelector("#party-date-label");
const rsvpDeadlineLabel = document.querySelector("#rsvp-deadline-date");
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function formatHeroDate(date) {
  return `${String(date.getDate()).padStart(2, "0")} · ${String(date.getMonth() + 1).padStart(2, "0")} · ${date.getFullYear()}`;
}

function formatPartyDate(date) {
  const month = date.toLocaleString("es-MX", { month: "long" });
  return `16 de ${month} del ${date.getFullYear()}`;
}

function formatRsvpDeadline(date) {
  const deadline = new Date(date);
  deadline.setDate(10);
  deadline.setMonth(5);
  const month = deadline.toLocaleString("es-MX", { month: "long" });
  return `${deadline.getDate()} de ${month} de ${deadline.getFullYear()}`;
}

function updateDateLabels() {
  heroDate.textContent = formatHeroDate(partyDate);
  partyDateLabel.textContent = formatPartyDate(partyDate);
  rsvpDeadlineLabel.textContent = formatRsvpDeadline(partyDate);
}

function updateCountdown() {
  const millisecondsLeft = Math.max(0, partyDate.getTime() - Date.now());
  const totalSeconds = Math.floor(millisecondsLeft / 1000);
  countdownFields.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
  countdownFields.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
}

updateDateLabels();
updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));