const site = window.SITE || {};

const gate = document.getElementById("gate");
const letter = document.getElementById("letter");
const openBtn = document.getElementById("open-letter");
const song = document.getElementById("song");
const vinyl = document.getElementById("vinyl");
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const canvas = document.getElementById("petals");
const ctx = canvas ? canvas.getContext("2d") : null;

openBtn.addEventListener("click", () => {
  gate.hidden = true;
  letter.hidden = false;
  if (song && song.src) {
    song.play().catch(() => {});
  }
});

document.getElementById("her-name").textContent = site.herName || "For you";
document.getElementById("message").textContent = site.message || "";
document.getElementById("signoff").textContent = site.yourName
  ? `Always yours, ${site.yourName}`
  : "Always yours";

if (site.songFile) {
  song.src = site.songFile;
}

song.addEventListener("play", () => vinyl.classList.add("spinning"));
song.addEventListener("pause", () => vinyl.classList.remove("spinning"));
song.addEventListener("ended", () => vinyl.classList.remove("spinning"));

function renderGallery() {
  const photos = Array.isArray(site.photos) ? site.photos.filter(Boolean) : [];
  gallery.innerHTML = "";

  if (!photos.length) {
    gallery.innerHTML =
      '<p class="placeholder">Add your photos to the <strong>photos</strong> folder, then list them in <strong>config.js</strong>.</p>';
    return;
  }

  photos.forEach((src, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "polaroid";
    const img = document.createElement("img");
    img.src = src;
    img.alt = `A memory ${index + 1}`;
    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(src, img.alt));
    gallery.appendChild(button);
  });
}

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.hidden = false;
}

document.getElementById("lightbox-close").addEventListener("click", () => {
  lightbox.hidden = true;
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.hidden = true;
});

renderGallery();

const petals = Array.from({ length: 28 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 4 + Math.random() * 7,
  s: 0.4 + Math.random() * 0.9,
  a: Math.random() * Math.PI * 2,
}));

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawPetals() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach((p) => {
    p.y += p.s;
    p.x += Math.sin(p.a) * 0.4;
    p.a += 0.01;
    if (p.y > canvas.height + 10) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = "rgba(243, 198, 209, 0.75)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r * 0.65, p.a, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawPetals);
}

window.addEventListener("resize", resize);
resize();
drawPetals();
