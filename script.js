// =====================================================
// UNDANGAN FIKRI & SYIFA - Botanical Minimalist
// Ubah bagian CONFIG saja untuk menyesuaikan.
// =====================================================

const CONFIG = {
  weddingDate: "2027-01-31T10:00:00+07:00",   // WIB
  appsScriptUrl: "MASUKKAN_URL_APPS_SCRIPT",  // URL Web App berakhiran /exec
  rekening: "XXXX XXXX XXXX"                  // samakan dengan yang tampil di index.html
};

const $ = (id) => document.getElementById(id);

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("on"), 2800);
}

// ---------- Nama tamu dari link: ?to=Budi%20Santoso ----------
const guest = new URLSearchParams(location.search).get("to");
if (guest) {
  $("guestName").textContent = guest;
  $("nama").value = guest;
}

// ---------- Buka undangan ----------
function openInvitation() {
  const cover = $("cover");
  const content = $("content");
  cover.classList.add("hide-cover");
  content.hidden = false;
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
  startReveal();
  setTimeout(() => { cover.style.display = "none"; }, 1100);
}
$("openBtn").addEventListener("click", openInvitation);

// ---------- Animasi muncul saat scroll ----------
function startReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => io.observe(el));
}

// ---------- Hitung mundur ----------
const weddingTime = new Date(CONFIG.weddingDate).getTime();
function updateCountdown() {
  const d = weddingTime - Date.now();
  if (d <= 0) {
    document.querySelector(".timer").innerHTML = "<p>Hari bahagia telah tiba</p>";
    clearInterval(cdTimer);
    return;
  }
  const pad = (n) => String(n).padStart(2, "0");
  $("days").textContent = Math.floor(d / 86400000);
  $("hours").textContent = pad(Math.floor((d % 86400000) / 3600000));
  $("minutes").textContent = pad(Math.floor((d % 3600000) / 60000));
  $("seconds").textContent = pad(Math.floor((d % 60000) / 1000));
}
const cdTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// ---------- Salin rekening ----------
async function copyRekening() {
  const text = CONFIG.rekening.replace(/\s/g, "");
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  toast("Nomor rekening disalin");
}
$("copyBtn").addEventListener("click", copyRekening);

// ---------- Daftar ucapan ----------
function renderWishes(list) {
  const box = $("wishes");
  box.innerHTML = "";
  if (!list.length) {
    box.innerHTML = '<p class="muted">Jadilah yang pertama memberi ucapan.</p>';
    return;
  }
  list.forEach(addWish);
}
function addWish(w, prepend) {
  const box = $("wishes");
  const el = document.createElement("div");
  el.className = "wish";
  const name = document.createElement("b");
  name.textContent = w.nama;
  const st = document.createElement("small");
  st.textContent = w.status;
  const msg = document.createElement("p");
  msg.textContent = w.pesan;
  el.append(name, st, msg);
  if (prepend) {
    const empty = box.querySelector(".muted");
    if (empty) empty.remove();
    box.prepend(el);
  } else {
    box.append(el);
  }
}
function loadWishes() {
  if (CONFIG.appsScriptUrl.startsWith("MASUKKAN")) {
    renderWishes([]);
    return;
  }
  fetch(CONFIG.appsScriptUrl)
    .then((r) => r.json())
    .then(renderWishes)
    .catch(() => {
      $("wishes").innerHTML = '<p class="muted">Ucapan belum dapat dimuat.</p>';
    });
}
loadWishes();

// ---------- RSVP ke Google Sheet ----------
const form = $("rsvpForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (CONFIG.appsScriptUrl.startsWith("MASUKKAN")) {
    toast("URL Apps Script belum diisi");
    return;
  }

  const data = {
    nama: $("nama").value.trim(),
    jumlah: $("jumlah").value,
    status: $("status").value,
    pesan: $("pesan").value.trim(),
    tanggal: new Date().toLocaleString("id-ID")
  };

  const btn = $("sendBtn");
  btn.disabled = true;
  btn.textContent = "Mengirim…";

  fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
  })
    .then(() => {
      toast("Terima kasih, konfirmasi Anda sudah terkirim");
      if (data.pesan) addWish(data, true);
      form.reset();
      $("jumlah").value = 1;
      if (guest) $("nama").value = guest;
    })
    .catch(() => toast("Gagal mengirim. Coba lagi."))
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Kirim konfirmasi";
    });
});
