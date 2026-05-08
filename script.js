// ══════════════════════════════════════
//  PAW'D — APP LOGIC
//  Real photos + Claude AI chat
// ══════════════════════════════════════

// ── STATE ──
const state = {
  filter:      'all',
  deck:        [],
  matches:     [],
  currentChat: null,
  userProfile: { name: 'You', avatar: '🧑' },
  preferences: { boost: false, music: false },
  stats: {
    totalSwipes: 0,
    likes: 0,
    nopes: 0,
    superlikes: 0,
    typeLikes: { dog: 0, cat: 0 },
    currentStreak: 0,
    bestStreak: 0,
    lastSwipeDate: '',
    totalDays: 0,
  },
  audio: {
    context: null,
    ambient: null,
    musicOn: false,
  },
  isDragging:  false,
  startX:      0,
  startY:      0,
  currentX:    0,
  currentY:    0,
  activeCard:  null,
};

// ── DOM REFS ──
const screens = {
  home:    document.getElementById('screen-home'),
  swipe:   document.getElementById('screen-swipe'),
  matches: document.getElementById('screen-matches'),
  profile: document.getElementById('screen-profile'),
  stats:   document.getElementById('screen-stats'),
  chat:    document.getElementById('screen-chat'),
  empty:   document.getElementById('screen-empty'),
};

const cardStack    = document.getElementById('card-stack');
const matchOverlay = document.getElementById('match-overlay');


function loadPetPhoto(pet) {
  if (!pet || !pet.photo) return Promise.resolve();
  return new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = pet.photo;
  });
}

function preloadPhotos(pets, count = pets.length) {
  return Promise.all(pets.slice(0, count).map(loadPetPhoto));
}
// ══════════════════════════════════════
//  SCREEN NAVIGATION
// ══════════════════════════════════════
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
function init() {
  loadMatches();
  loadProfile();
  loadStats();
  loadPreferences();
  updateMatchCount();
  updateSwipeBadge();
  updateStreakDisplay();
  updateHomeGreeting();
  updateBoostButton();
  updateMusicButton();
  renderAvatarOptions();
}

function loadMatches() {
  const saved = localStorage.getItem('pawdMatches');
  state.matches = saved ? JSON.parse(saved) : [];
}

function saveMatches() {
  localStorage.setItem('pawdMatches', JSON.stringify(state.matches));
}

// ══════════════════════════════════════
//  HOME SCREEN
// ══════════════════════════════════════
document.getElementById('btn-start').addEventListener('click', () => {
  if (state.preferences.music) startAmbientMusic();
  startSwiping();
});
document.getElementById('btn-view-matches').addEventListener('click', () => {
  renderMatchesList();
  showScreen('matches');
});
document.getElementById('btn-open-profile').addEventListener('click', openProfile);
document.getElementById('btn-open-stats').addEventListener('click', openStats);
document.getElementById('btn-toggle-boost').addEventListener('click', toggleBoostMode);
document.getElementById('btn-toggle-music').addEventListener('click', toggleMusicMode);

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filter = btn.dataset.filter;
  });
});

function updateMatchCount() {
  document.getElementById('home-match-count').textContent = state.matches.length;
}

function updateSwipeBadge() {
  const badge = document.getElementById('swipe-match-badge');
  badge.classList.toggle('show', state.matches.length > 0);
}

function loadProfile() {
  const saved = localStorage.getItem('pawdUserProfile');
  if (saved) state.userProfile = JSON.parse(saved);
}

function saveProfile() {
  localStorage.setItem('pawdUserProfile', JSON.stringify(state.userProfile));
}

function loadStats() {
  const saved = localStorage.getItem('pawdStats');
  if (saved) state.stats = JSON.parse(saved);
}

function saveStats() {
  localStorage.setItem('pawdStats', JSON.stringify(state.stats));
}

function loadPreferences() {
  const saved = localStorage.getItem('pawdPreferences');
  if (saved) state.preferences = JSON.parse(saved);
}

function savePreferences() {
  localStorage.setItem('pawdPreferences', JSON.stringify(state.preferences));
}

function formatDistance(pet) {
  if (pet.distanceKm == null) {
    pet.distanceKm = Math.max(1, Math.round(((pet.id * 5.3) % 14) + 2));
  }
  return pet.distanceKm;
}

function enhancePet(pet) {
  if (pet.distanceKm == null) pet.distanceKm = formatDistance(pet);
  if (pet.premium == null) pet.premium = [2, 5, 8, 12, 14].includes(pet.id);
  return pet;
}

function updateHomeGreeting() {
  const welcome = document.getElementById('home-welcome');
  if (welcome) welcome.textContent = `Hey, ${state.userProfile.name}! Ready to swipe?`;
}

function updateBoostButton() {
  const boostBtn = document.getElementById('btn-toggle-boost');
  const boostBadge = document.getElementById('boost-badge');
  if (!boostBtn || !boostBadge) return;
  if (state.preferences.boost) {
    boostBtn.textContent = '⚡ Boost On';
    boostBadge.textContent = 'Boost on';
    boostBadge.classList.add('active');
  } else {
    boostBtn.textContent = '⚡ Boost Off';
    boostBadge.textContent = 'Boost off';
    boostBadge.classList.remove('active');
  }
}

function updateMusicButton() {
  const musicBtn = document.getElementById('btn-toggle-music');
  if (!musicBtn) return;
  if (state.preferences.music) {
    musicBtn.textContent = '🎵 Music On';
  } else {
    musicBtn.textContent = '🎵 Music Off';
  }
}

function toggleBoostMode() {
  state.preferences.boost = !state.preferences.boost;
  savePreferences();
  updateBoostButton();
}

function toggleMusicMode() {
  state.preferences.music = !state.preferences.music;
  savePreferences();
  updateMusicButton();
  if (state.preferences.music) startAmbientMusic();
  else stopAmbientMusic();
}

function getFavouriteType() {
  const { dog, cat } = state.stats.typeLikes;
  if (dog === cat) return dog === 0 ? 'None yet' : 'Both';
  return dog > cat ? 'Dogs' : 'Cats';
}

function recordSwipe(direction, pet) {
  const today = new Date().toISOString().slice(0, 10);
  const last = state.stats.lastSwipeDate;
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === yesterday) {
      state.stats.currentStreak += 1;
    } else {
      state.stats.currentStreak = 1;
    }
    state.stats.lastSwipeDate = today;
    state.stats.totalDays += 1;
    if (state.stats.currentStreak > state.stats.bestStreak) {
      state.stats.bestStreak = state.stats.currentStreak;
    }
  }
  state.stats.totalSwipes += 1;
  if (direction === 'like') {
    state.stats.likes += 1;
    state.stats.typeLikes[pet.type] += 1;
  } else if (direction === 'superlike') {
    state.stats.superlikes += 1;
    state.stats.typeLikes[pet.type] += 1;
  } else {
    state.stats.nopes += 1;
  }
  saveStats();
  updateStreakDisplay();
}

function updateStreakDisplay() {
  const streak = document.getElementById('streak-count');
  if (streak) streak.textContent = state.stats.currentStreak || 0;
}

function renderStatsScreen() {
  document.getElementById('stat-total-swipes').textContent = state.stats.totalSwipes;
  document.getElementById('stat-likes').textContent = state.stats.likes;
  document.getElementById('stat-nopes').textContent = state.stats.nopes;
  document.getElementById('stat-superlikes').textContent = state.stats.superlikes;
  document.getElementById('stat-match-rate').textContent = `${Math.round(((state.stats.likes + state.stats.superlikes) / Math.max(state.stats.totalSwipes, 1)) * 100)}%`;
  document.getElementById('stat-fav-type').textContent = getFavouriteType();
  document.getElementById('stat-current-streak').textContent = state.stats.currentStreak;
  document.getElementById('stat-best-streak').textContent = state.stats.bestStreak;
}

function renderAvatarOptions() {
  const options = ['🧑', '👩', '👨', '🐶', '🐱', '🦄', '🐾', '🥰'];
  const container = document.getElementById('avatar-options');
  if (!container) return;
  container.innerHTML = '';
  options.forEach(avatar => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `avatar-option${state.userProfile.avatar === avatar ? ' active' : ''}`;
    button.textContent = avatar;
    button.addEventListener('click', () => {
      state.userProfile.avatar = avatar;
      saveProfile();
      updateProfilePreview();
      renderAvatarOptions();
    });
    container.appendChild(button);
  });
}

function updateProfilePreview() {
  const previewAvatar = document.getElementById('profile-avatar-preview');
  const previewName = document.getElementById('profile-name-preview');
  const welcome = document.getElementById('home-welcome');
  if (previewAvatar) previewAvatar.textContent = state.userProfile.avatar;
  if (previewName) previewName.textContent = state.userProfile.name;
  if (welcome) welcome.textContent = `Hey, ${state.userProfile.name}! Ready to swipe?`;
}

function openProfile() {
  document.getElementById('profile-name').value = state.userProfile.name;
  renderAvatarOptions();
  updateProfilePreview();
  showScreen('profile');
}

function openStats() {
  renderStatsScreen();
  showScreen('stats');
}

function saveProfileSettings() {
  const input = document.getElementById('profile-name');
  if (!input) return;
  const value = input.value.trim();
  if (value) state.userProfile.name = value;
  saveProfile();
  updateProfilePreview();
  updateHomeGreeting();
  showScreen('home');
}

function resetStats() {
  state.stats = {
    totalSwipes: 0,
    likes: 0,
    nopes: 0,
    superlikes: 0,
    typeLikes: { dog: 0, cat: 0 },
    currentStreak: 0,
    bestStreak: 0,
    lastSwipeDate: '',
    totalDays: 0,
  };
  saveStats();
  renderStatsScreen();
  updateStreakDisplay();
}

function ensureAudioContext() {
  if (state.audio.context) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    state.audio.context = ctx;
    ctx.resume().catch(() => {});
  } catch (err) {
    state.preferences.music = false;
    updateMusicButton();
  }
}

function startAmbientMusic() {
  if (!state.preferences.music) return;
  ensureAudioContext();
  if (!state.audio.context || state.audio.ambient) return;
  const ctx = state.audio.context;
  const gain = ctx.createGain();
  gain.gain.value = 0.025;
  gain.connect(ctx.destination);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 110;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.18;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 12;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  osc.start();
  lfo.start();
  state.audio.ambient = { osc, lfo, gain };
}

function stopAmbientMusic() {
  if (!state.audio.ambient) return;
  const { osc, lfo, gain } = state.audio.ambient;
  osc.stop();
  lfo.stop();
  gain.disconnect();
  state.audio.ambient = null;
}

function playSwipeSound(type) {
  if (!state.preferences.music) return;
  ensureAudioContext();
  if (!state.audio.context) return;
  const ctx = state.audio.context;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.frequency.setValueAtTime(type === 'nope' ? 220 : type === 'superlike' ? 520 : 330, now);
  osc.type = type === 'superlike' ? 'triangle' : 'square';
  osc.start(now);
  osc.stop(now + 0.22);
}

// ══════════════════════════════
//  SWIPING
// ══════════════════════════════════════
async function startSwiping() {
  const matchedIds = state.matches.map(m => m.id);
  let pool = getPetsByFilter(state.filter)
    .map(enhancePet)
    .filter(p => !matchedIds.includes(p.id));

  if (state.preferences.boost) {
    pool = pool.sort((a, b) => {
      if (a.premium === b.premium) return Math.random() - 0.5;
      return (b.premium ? 1 : 0) - (a.premium ? 1 : 0);
    });
  } else {
    pool = pool.sort(() => Math.random() - 0.5);
  }

  state.deck = pool;

  if (state.deck.length === 0) { showScreen('empty'); return; }

  showScreen('swipe');
  if (state.preferences.music) startAmbientMusic();

  // Show loading state while fetching first photos
  cardStack.innerHTML = `
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    background:white;border-radius:24px;box-shadow:var(--shadow);flex-direction:column;gap:12px;">
      <div style="font-size:48px;animation:pawBounce 1s ease-in-out infinite">🐾</div>
      <p style="font-weight:700;color:var(--text-soft)">Finding cuties near you...</p>
    </div>`;

  await preloadPhotos(state.deck, 3);
  renderCards();
}

function renderCards() {
  cardStack.innerHTML = '';
  const toShow = state.deck.slice(0, 3);
  [...toShow].reverse().forEach(pet => {
    const card = createCard(pet);
    cardStack.appendChild(card);
  });
  attachDrag();
}

function createCard(pet) {
  const card = document.createElement('div');
  card.className = 'pet-card';
  card.dataset.id = pet.id;

  // Photo area — real image or gradient fallback
  const photoHTML = pet.photo
    ? `<img src="${pet.photo}" alt="${pet.name}" class="card-real-photo" 
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
       />
       <div class="card-photo-fallback" style="display:none;background:${pet.bg}">
         <span>${pet.emoji}</span>
       </div>`
    : `<div class="card-photo-fallback" style="background:${pet.bg}">
         <span>${pet.emoji}</span>
       </div>`;

  card.innerHTML = `
    <div class="card-photo-wrap">
      ${photoHTML}
      <div class="card-photo-gradient"></div>
      <div class="card-name-overlay">
        <div class="card-name-row">
          <span class="card-name">${pet.name}, ${pet.age}</span>
          <span class="card-breed-pill">${pet.type === 'dog' ? '🐶' : '🐱'} ${pet.breed}</span>
        </div>
        <div class="card-submeta">
          <span class="card-distance">📍 ${formatDistance(pet)} km away</span>
          ${pet.premium ? '<span class="boost-pill">⚡ Boosted</span>' : ''}
        </div>
      </div>
      <div class="stamp stamp-like"  id="stamp-like-${pet.id}">❤️ Like</div>
      <div class="stamp stamp-nope"  id="stamp-nope-${pet.id}">✕ Nope</div>
      <div class="stamp stamp-super" id="stamp-super-${pet.id}">⭐ Super!</div>
    </div>
    <div class="card-info">
      <p class="card-bio">${pet.bio}</p>
      <div class="card-tags">
        ${pet.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `;
  return card;
}

// ── DRAG ENGINE ──
function attachDrag() {
  const topCard = cardStack.firstElementChild;
  if (!topCard) return;
  state.activeCard = topCard;
  topCard.addEventListener('mousedown',  onDragStart);
  topCard.addEventListener('touchstart', onDragStart, { passive: true });
}

function onDragStart(e) {
  if (state.isDragging) return;
  state.isDragging = true;
  const point = e.touches ? e.touches[0] : e;
  state.startX  = point.clientX;
  state.startY  = point.clientY;
  state.currentX = 0;
  state.currentY = 0;
  document.addEventListener('mousemove',  onDragMove);
  document.addEventListener('touchmove',  onDragMove, { passive: true });
  document.addEventListener('mouseup',    onDragEnd);
  document.addEventListener('touchend',   onDragEnd);
}

function onDragMove(e) {
  if (!state.isDragging || !state.activeCard) return;
  const point = e.touches ? e.touches[0] : e;
  state.currentX = point.clientX - state.startX;
  state.currentY = point.clientY - state.startY;
  const rotate = state.currentX * 0.08;
  state.activeCard.style.transform =
    `translateX(${state.currentX}px) translateY(${state.currentY * 0.3}px) rotate(${rotate}deg)`;

  const petId = state.activeCard.dataset.id;
  const likeStamp  = document.getElementById(`stamp-like-${petId}`);
  const nopeStamp  = document.getElementById(`stamp-nope-${petId}`);
  const superStamp = document.getElementById(`stamp-super-${petId}`);
  if (likeStamp)  likeStamp.classList.toggle('show',  state.currentX > 60);
  if (nopeStamp)  nopeStamp.classList.toggle('show',  state.currentX < -60);
  if (superStamp) superStamp.classList.toggle('show', state.currentY < -60 && Math.abs(state.currentX) < 60);
}

function onDragEnd() {
  state.isDragging = false;
  document.removeEventListener('mousemove',  onDragMove);
  document.removeEventListener('touchmove',  onDragMove);
  document.removeEventListener('mouseup',    onDragEnd);
  document.removeEventListener('touchend',   onDragEnd);

  if (!state.activeCard) return;

  if (state.currentX > 100)       swipeCard('like');
  else if (state.currentX < -100) swipeCard('nope');
  else if (state.currentY < -80 && Math.abs(state.currentX) < 60) swipeCard('superlike');
  else {
    state.activeCard.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    state.activeCard.style.transform  = 'translateX(0) translateY(0) rotate(0)';
    setTimeout(() => { if (state.activeCard) state.activeCard.style.transition = ''; }, 400);
  }
}

function swipeCard(direction) {
  const card  = state.activeCard;
  if (!card) return;

  const petId = parseInt(card.dataset.id);
  const pet   = state.deck.find(p => p.id === petId);

  if (direction === 'like')      card.classList.add('fly-right');
  else if (direction === 'nope') card.classList.add('fly-left');
  else                           card.classList.add('fly-up');

  setTimeout(async () => {
    card.remove();
    state.deck = state.deck.filter(p => p.id !== petId);
    state.activeCard = null;

    // Preload next photo in background
    if (state.deck.length > 0) {
      loadPetPhoto(state.deck[Math.min(2, state.deck.length - 1)]);
    }

    attachDrag();
    if (state.deck.length === 0) setTimeout(() => showScreen('empty'), 300);
  }, 450);

  recordSwipe(direction, pet);
  playSwipeSound(direction);

  if (direction === 'like' || direction === 'superlike') {
    addMatch(pet, direction === 'superlike');
    showMatchOverlay(pet, direction === 'superlike');
  }
}

// ── BUTTONS + KEYBOARD ──
document.getElementById('btn-like').addEventListener('click',      () => { if (state.deck.length) swipeCard('like'); });
document.getElementById('btn-nope').addEventListener('click',      () => { if (state.deck.length) swipeCard('nope'); });
document.getElementById('btn-superlike').addEventListener('click', () => { if (state.deck.length) swipeCard('superlike'); });

document.addEventListener('keydown', e => {
  if (!screens.swipe.classList.contains('active')) return;
  if (e.key === 'ArrowRight') swipeCard('like');
  if (e.key === 'ArrowLeft')  swipeCard('nope');
  if (e.key === 'ArrowUp')    swipeCard('superlike');
});

document.getElementById('btn-back-home').addEventListener('click',   () => showScreen('home'));
document.getElementById('btn-goto-matches').addEventListener('click', () => {
  renderMatchesList(); showScreen('matches');
});
document.getElementById('btn-profile-back').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-stats-back').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-profile-save').addEventListener('click', saveProfileSettings);

document.getElementById('btn-reset-stats').addEventListener('click', resetStats);

// ══════════════════════════════════════
//  MATCH SYSTEM
// ══════════════════════════════════════
function addMatch(pet, isSuperlike = false) {
  if (state.matches.find(m => m.id === pet.id)) return;
  state.matches.push({ ...pet, superlike: isSuperlike, chatHistory: [] });
  saveMatches();
  updateMatchCount();
  updateSwipeBadge();
}

function showMatchOverlay(pet, isSuperlike) {
  document.getElementById('overlay-emoji').textContent = pet.photo
    ? pet.emoji : pet.emoji;

  // If real photo, show it in overlay
  const emojiEl = document.getElementById('overlay-emoji');
  if (pet.photo) {
    emojiEl.innerHTML = `<img src="${pet.photo}" 
      style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid white;" 
      onerror="this.outerHTML='${pet.emoji}'"
    />`;
  } else {
    emojiEl.textContent = pet.emoji;
  }

  document.getElementById('overlay-sub').textContent = isSuperlike
    ? `You Super Liked ${pet.name}! ⭐`
    : `You and ${pet.name} liked each other!`;

  matchOverlay.classList.add('show');
  spawnConfetti();

  document.getElementById('overlay-chat-btn').onclick = () => {
    matchOverlay.classList.remove('show');
    openChat(pet.id);
  };
  document.getElementById('overlay-continue-btn').onclick = () => {
    matchOverlay.classList.remove('show');
  };
}

// ══════════════════════════════════════
//  CONFETTI
// ══════════════════════════════════════
function spawnConfetti() {
  const colors = ['#ff4d6d','#ffd166','#06d6a0','#a8dadc','#ff8c69','#c77dff'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    el.style.cssText = `
      left:${Math.random()*100}vw; top:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px; height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*0.5}s;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

// ══════════════════════════════════════
//  MATCHES LIST
// ══════════════════════════════════════
function renderMatchesList() {
  const list  = document.getElementById('matches-list');
  const empty = document.getElementById('matches-empty');
  list.innerHTML = '';

  if (state.matches.length === 0) {
    list.style.display  = 'none';
    empty.style.display = 'flex';
    empty.style.flexDirection = 'column';
    empty.style.alignItems    = 'center';
    return;
  }

  list.style.display  = 'flex';
  empty.style.display = 'none';

  state.matches.forEach(pet => {
    const lastMsg = pet.chatHistory?.length > 0
      ? pet.chatHistory[pet.chatHistory.length - 1].text
      : 'Tap to say hi! 👋';

    // Avatar: real photo or emoji
    const avatarHTML = pet.photo
      ? `<img src="${pet.photo}" alt="${pet.name}" 
           style="width:56px;height:56px;border-radius:50%;object-fit:cover;"
           onerror="this.outerHTML='<span style=font-size:36px>${pet.emoji}</span>'"
         />`
      : `<span style="font-size:36px">${pet.emoji}</span>`;

    const item = document.createElement('div');
    item.className = 'match-item';
    item.innerHTML = `
      <div class="match-item-avatar" style="background:${pet.bg}">${avatarHTML}</div>
      <div class="match-item-info">
        <div class="match-item-name">${pet.name}</div>
        <div class="match-item-breed">${pet.breed}</div>
        ${pet.superlike ? '<span class="superlike-badge">⭐ Super Liked</span>' : ''}
        <div class="match-item-preview">${lastMsg}</div>
      </div>
      <div class="match-item-arrow"><i class="fas fa-chevron-right"></i></div>`;
    item.addEventListener('click', () => openChat(pet.id));
    list.appendChild(item);
  });
}

document.getElementById('btn-matches-back').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-empty-swipe').addEventListener('click', () => {
  showScreen('home');
  setTimeout(() => document.getElementById('btn-start').click(), 100);
});

// ══════════════════════════════════════
//  CHAT SYSTEM — Claude AI Powered
// ══════════════════════════════════════
function openChat(petId) {
  const pet = state.matches.find(m => m.id === petId);
  if (!pet) return;
  state.currentChat = pet;

  // Avatar in chat header
  const chatAvatar = document.getElementById('chat-avatar');
  if (pet.photo) {
    chatAvatar.innerHTML = `<img src="${pet.photo}" 
      style="width:100%;height:100%;border-radius:50%;object-fit:cover;"
      onerror="this.outerHTML='${pet.emoji}'"
    />`;
    chatAvatar.style.padding = '0';
  } else {
    chatAvatar.textContent = pet.emoji;
    chatAvatar.style.padding = '';
  }

  document.getElementById('chat-name').textContent = pet.name;
  renderChatHistory();
  showScreen('chat');

  // Auto greeting on first open
  if (!pet.chatHistory || pet.chatHistory.length === 0) {
    if (!pet.chatHistory) pet.chatHistory = [];
    setTimeout(() => getAIReply(pet, null), 800);
  }
}

function renderChatHistory() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = '';
  const pet = state.currentChat;
  if (!pet?.chatHistory) return;

  pet.chatHistory.forEach(msg => {
    const el = document.createElement('div');
    el.className = `msg ${msg.from === 'me' ? 'me' : 'them'}`;
    el.textContent = msg.text;
    container.appendChild(el);
  });
  scrollToBottom();
}

// ── AI REPLY via Anthropic API ──
async function getAIReply(pet, userMessage) {
  const container = document.getElementById('chat-messages');

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  container.appendChild(typing);
  scrollToBottom();

  try {
    // Build conversation history for context
    const history = (pet.chatHistory || []).map(msg => ({
      role: msg.from === 'me' ? 'user' : 'assistant',
      content: msg.text
    }));

    // If this is the opening message (userMessage is null), ask pet to greet first
    const messages = userMessage
      ? [...history, { role: 'user', content: userMessage }]
      : [{ role: 'user', content: `Say a fun, short opening greeting to someone who just matched with you on Paw'd!` }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: pet.personality,
        messages
      })
    });

    const data  = await response.json();
    const reply = data.content?.[0]?.text?.trim() || fallbackReply(pet);

    typing.remove();

    // Save and display reply
    const msg = { from: 'pet', text: reply };
    if (!pet.chatHistory) pet.chatHistory = [];
    pet.chatHistory.push(msg);
    saveMatches();

    const el = document.createElement('div');
    el.className = 'msg them';
    el.textContent = reply;
    container.appendChild(el);
    scrollToBottom();
    renderMatchesList();

  } catch (err) {
    typing.remove();
    // Fallback if API fails
    const reply = fallbackReply(pet);
    const msg = { from: 'pet', text: reply };
    if (!pet.chatHistory) pet.chatHistory = [];
    pet.chatHistory.push(msg);
    saveMatches();

    const el = document.createElement('div');
    el.className = 'msg them';
    el.textContent = reply;
    container.appendChild(el);
    scrollToBottom();
  }
}

// Fallback replies if API is unavailable
function fallbackReply(pet) {
  const fallbacks = {
    dog: ["Woof!! 🐶 *wags tail*", "bork bork!! 🎾", "*licks your face*", "TREAT?? 🍗"],
    cat: ["*slow blink*", "...mrow.", "*knocks something off the table*", "Purrrr 🐱"]
  };
  const options = fallbacks[pet.type] || fallbacks.cat;
  return options[Math.floor(Math.random() * options.length)];
}

// ── SEND MESSAGE ──
document.getElementById('btn-send').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text || !state.currentChat) return;

  const pet = state.currentChat;
  if (!pet.chatHistory) pet.chatHistory = [];

  // Add my message
  const msg = { from: 'me', text };
  pet.chatHistory.push(msg);
  saveMatches();

  const container = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'msg me';
  el.textContent = text;
  container.appendChild(el);
  input.value = '';
  scrollToBottom();

  // Get AI reply
  setTimeout(() => getAIReply(pet, text), 400);
}

function scrollToBottom() {
  const c = document.getElementById('chat-messages');
  c.scrollTop = c.scrollHeight;
}

document.getElementById('btn-back-matches').addEventListener('click', () => {
  renderMatchesList();
  showScreen('matches');
});

// ══════════════════════════════════════
//  EMPTY SCREEN
// ══════════════════════════════════════
document.getElementById('btn-empty-matches').addEventListener('click', () => {
  renderMatchesList(); showScreen('matches');
});

document.getElementById('btn-reset').addEventListener('click', () => {
  startSwiping();
});

// ══════════════════════════════════════
//  KICK OFF
// ══════════════════════════════════════
init();