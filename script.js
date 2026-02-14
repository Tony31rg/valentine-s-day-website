// script.js
// Interactions for the Valentine & Anniversary site

// Configurable password / anniversary date (change as needed)
const CORRECT_PASSWORD = '14-02-2025';
const ANNIV_DATE = '2025-02-14'; // ISO for calculations

// Simple page navigation
const pages = Array.from(document.querySelectorAll('.page'));
function showPage(id){
  pages.forEach(p=>p.classList.remove('active'));
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
  // If showing the Love Journey page, ensure counter is running
  if(id === 'page-4') initDaysCounter();
  // Add body classes for page-specific styling (used to hide lightbox controls on gallery)
  document.body.classList.toggle('page-3-active', id === 'page-3');
  document.body.classList.toggle('page-4-active', id === 'page-4');
}

// Landing -> Password
document.getElementById('startBtn').addEventListener('click',()=>{
  showPage('page-2');
});

// Password check with cute shake on fail
const pwInput = document.getElementById('passwordInput');
const pwMsg = document.getElementById('pwMsg');
document.getElementById('pwSubmit').addEventListener('click',()=>{
  const val = pwInput.value.trim();
  if(val === CORRECT_PASSWORD){
    pwMsg.textContent = '';
    // Show gallery first
    showPage('page-3');
  } else {
    pwMsg.textContent = "Oops baby, that's not our special day 😘";
    // animate shake
    const card = document.querySelector('#page-2 .card');
    card.style.animation = 'shake 0.6s';
    setTimeout(()=>card.style.animation='none',700);
  }
});

// Days together counter
function daysBetween(startISO){
  const start = new Date(startISO + 'T00:00:00');
  const today = new Date();
  const diff = today - start; // ms
  return Math.floor(diff / (1000*60*60*24));
}
function initDaysCounter(){
  const el = document.getElementById('daysCount');
  function update(){
    el.textContent = daysBetween(ANNIV_DATE);
  }
  update();
  // Update daily
  setInterval(update, 1000*60*60);
}

/* -----------------------
   Photo gallery lightbox
   ----------------------- */
const gallery = document.getElementById('gallery');
const galleryModal = document.getElementById('galleryModal');
const lbImage = document.getElementById('lbImage');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbGotoNextPage = document.getElementById('lbGotoNextPage');

let galleryItems = [];
let currentIndex = 0;
function initGallery(){
  if(!gallery) return;
  galleryItems = Array.from(gallery.querySelectorAll('img')).map(img=>img.getAttribute('src'));
  gallery.querySelectorAll('img').forEach((img,i)=>{
    img.addEventListener('click',()=>openLightbox(i));
  });
}
function openLightbox(i){
  currentIndex = i;
  lbImage.src = galleryItems[currentIndex];
  galleryModal.setAttribute('aria-hidden','false');
  galleryModal.classList.add('show');
}
function closeLightbox(){
  galleryModal.setAttribute('aria-hidden','true');
  galleryModal.classList.remove('show');
}
function showNext(n){
  currentIndex = (currentIndex + n + galleryItems.length) % galleryItems.length;
  lbImage.src = galleryItems[currentIndex];
}

// X button: close lightbox AND return to main landing page
lbClose.addEventListener('click', ()=>{ closeLightbox(); showPage('page-1'); });
lbPrev.addEventListener('click',()=>showNext(-1));
lbNext.addEventListener('click',()=>showNext(1));
// Next Page button: close lightbox and navigate to Love Journey page (page-4)
if(lbGotoNextPage) lbGotoNextPage.addEventListener('click', ()=>{ closeLightbox(); showPage('page-4'); });
// keyboard nav for lightbox
document.addEventListener('keydown',(e)=>{
  if(galleryModal.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'ArrowRight') showNext(1);
    if(e.key === 'ArrowLeft') showNext(-1);
    if(e.key === 'Escape') closeLightbox();
  }
});

// Init gallery on load
initGallery();

// Page navigation buttons (gallery and journey)
const galleryBackBtn = document.getElementById('galleryBack');
const galleryNextBtn = document.getElementById('galleryNext');
const journeyBackBtn = document.getElementById('journeyBack');
const journeyNextBtn = document.getElementById('journeyNext');

if(galleryBackBtn) galleryBackBtn.addEventListener('click', ()=> showPage('page-2'));
if(galleryNextBtn) galleryNextBtn.addEventListener('click', ()=> showPage('page-4'));
if(journeyBackBtn) journeyBackBtn.addEventListener('click', ()=> showPage('page-3'));
if(journeyNextBtn) journeyNextBtn.addEventListener('click', ()=> showPage('page-5'));

// Envelope and gift box modals
const gift = document.getElementById('giftBox');
const envelope = document.getElementById('envelope');
const loveModal = document.getElementById('loveModal');
const closeModal = document.getElementById('closeModal');
const giftModal = document.getElementById('giftModal');
const closeGift = document.getElementById('closeGift');

function openLoveModal(options = { animateEnvelope: true }){
  // If requested, animate envelope flap
  if(options.animateEnvelope && envelope) envelope.classList.add('open');
  const delay = (options.animateEnvelope ? 420 : 0);
  setTimeout(()=>{
    loveModal.setAttribute('aria-hidden','false');
    loveModal.classList.add('show');
  }, delay);
}
function closeLoveModal(){
  loveModal.setAttribute('aria-hidden','true');
  loveModal.classList.remove('show');
  if(envelope) envelope.classList.remove('open');
}

// clicks: envelope opens the love-letter modal with flap animation
if(envelope) envelope.addEventListener('click', (e)=>{ e.stopPropagation(); openLoveModal({animateEnvelope:true}); });
if(envelope) envelope.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLoveModal({animateEnvelope:true}); } });
// clicking gift box opens the gift modal (short letter + photo)
function openGiftModal(){
  // small lid lift animation
  if(gift){
    const lid = gift.querySelector('.lid');
    if(lid) lid.style.transform = 'translateY(-36px) rotate(-6deg)';
  }
  setTimeout(()=>{
    if(giftModal){ giftModal.setAttribute('aria-hidden','false'); giftModal.classList.add('show'); }
  }, 300);
}
function closeGiftModal(){
  if(giftModal){ giftModal.setAttribute('aria-hidden','true'); giftModal.classList.remove('show'); }
  // reset lid
  if(gift){ const lid = gift.querySelector('.lid'); if(lid) lid.style.transform='translateY(0) rotate(0)'; }
}

if(gift) gift.addEventListener('click', (e)=>{ e.stopPropagation(); openGiftModal(); });
if(gift) gift.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGiftModal(); } });
if(closeModal) closeModal.addEventListener('click', ()=> closeLoveModal());
if(closeGift) closeGift.addEventListener('click', ()=> closeGiftModal());

// Floating hearts generator
function createHeart(){
  const heart = document.createElement('div');
  heart.className='heart';
  const size = (Math.random()*18)+8;
  heart.style.width = size+'px';
  heart.style.height = size+'px';
  heart.style.left = Math.random()*100+'%';
  heart.style.bottom = '-10vh';
  heart.style.opacity = (Math.random()*0.6)+0.3;
  const dur = (Math.random()*8)+6;
  heart.style.transition = `transform ${dur}s linear, bottom ${dur}s linear, opacity ${dur}s linear`;
  document.getElementById('hearts').appendChild(heart);
  // float up
  requestAnimationFrame(()=>{
    heart.style.transform = `translateY(-120vh) rotate(${Math.random()*360}deg)`;
    heart.style.bottom = '110vh';
    heart.style.opacity = 0;
  });
  // cleanup
  setTimeout(()=>heart.remove(), (dur+0.5)*1000);
}
// create hearts periodically
setInterval(createHeart, 600);
// seed a few
for(let i=0;i<8;i++) setTimeout(createHeart, i*200);

// Small accessibility: allow Escape to close modal
document.addEventListener('keydown',(e)=>{
  if(e.key === 'Escape'){
    // close any open modal/lightbox
    closeLoveModal();
    closeGiftModal();
    closeLightbox();
  }
});

// When user arrives directly to page-3 (if we need to support that), init counter
if(document.getElementById('page-4') && document.getElementById('page-4').classList.contains('active')) initDaysCounter();

/*
  Notes:
  - Change CORRECT_PASSWORD and ANNIV_DATE constants as needed.
  - Replace the YouTube iframe VIDEO_ID in index.html to autoplay the desired song.
*/
