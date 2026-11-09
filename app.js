(function () {
'use strict';
/* ===== EDIT THESE LINES ===== */
var CLOUD_NAME = '';     // Cloudinary cloud name (turns on image and video uploads)
var UPLOAD_PRESET = '';  // Cloudinary UNSIGNED upload preset name
var OWNER_WHATSAPP = ''; // your number with country code, digits only, e.g. 919876543210
var OWNER_EMAIL = '';    // e.g. hello@yourdomain.com
/* ===== END ===== */
var $ = function (id) { return document.getElementById(id); };
function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : '#'; }
function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function api(url, body, headers) {
  if (url.indexOf('/api/') === 0) return Promise.reject(new Error('No server in the direct-upload version'));
  return fetch(url, { method: body ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}), body: body ? JSON.stringify(body) : undefined })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ('Error ' + r.status)); return j; }); });
}
function toast(t) { var e = $('toast'); e.textContent = t; e.className = 'show'; clearTimeout(toast.t); toast.t = setTimeout(function () { e.className = ''; }, 3800); }

var CFG = { price: 0, payments: false, ai: false }, ads = [], cat = 'All', shown = 12, page = 'home', draftPoster = null;
var CATS = ['Fashion', 'Food', 'Electronics', 'Home', 'Services'];
var EMO = { Fashion: '👗', Food: '🍽️', Electronics: '📱', Home: '🏠', Services: '🔧' };
var PAL = [['#c2185b', '#6a1b9a'], ['#e65100', '#bf360c'], ['#0d47a1', '#00838f'], ['#2e7d32', '#00695c'], ['#37474f', '#1565c0'], ['#ef6c00', '#c62828'], ['#6a1b9a', '#283593'], ['#ad1457', '#4527a0']];
var FXS = ['shine', 'glow', 'float', 'zoom', 'tilt', 'neon'];

/* ---------- sample ads (clearly marked, hidden when 12+ real ads exist) ---------- */
var SD = [['Kavi Silks', 'Festival silk sarees', 'Fashion', 'poster', [['Kavi Silks', 2499], ['Mall Store', 2899], ['Online Mart', 2750]]],
  ['Annam Kitchen', 'Family meal combo', 'Food', 'video', [['Annam Kitchen', 449], ['Food App A', 519], ['Food App B', 499]]],
  ['VoltPoint', 'Wireless earbuds', 'Electronics', 'poster', [['VoltPoint', 1299], ['Big Retail', 1599], ['E-shop', 1449]]],
  ['Homely Decor', 'Cotton bedsheet set', 'Home', 'video', [['Homely Decor', 899], ['Store X', 1099], ['Market Y', 999]]],
  ['QuickFix Care', 'AC service at home', 'Services', 'poster', [['QuickFix Care', 599], ['Service Hub', 749], ['FixIt Now', 699]]],
  ['Sweet Bite', 'Festival sweets box', 'Food', 'poster', [['Sweet Bite', 650], ['Sweet Shop B', 720], ['Online Sweets', 690]]],
  ['Urban Threads', 'Summer cotton shirts', 'Fashion', 'poster', [['Urban Threads', 799], ['Mall Store', 999], ['Online Mart', 899]]],
  ['ByteBazaar', 'Smart watch', 'Electronics', 'video', [['ByteBazaar', 2999], ['Big Retail', 3499], ['E-shop', 3199]]],
  ['Green Nest', 'Indoor plant pack', 'Home', 'poster', [['Green Nest', 499], ['Garden Hub', 599], ['Plant Mart', 549]]],
  ['CleanPro', 'Deep home cleaning', 'Services', 'poster', [['CleanPro', 1499], ['HomeHelp', 1799], ['FixIt Now', 1649]]],
  ['Spice Route', 'Biryani party pack', 'Food', 'video', [['Spice Route', 899], ['Food App A', 999], ['Food App B', 949]]],
  ['Trend Lane', 'Ethnic wear festival', 'Fashion', 'poster', [['Trend Lane', 1899], ['Mall Store', 2299], ['Online Mart', 2099]]]];
var SAMPLES = SD.map(function (r, i) {
  var p = PAL[i % PAL.length];
  return { id: 's' + i, sample: true, biz: r[0], title: r[1], cat: r[2], type: r[3], prices: r[4], fx: FXS[i % FXS.length], link: '', views: 0, clicks: 0,
    poster: { c1: p[0], c2: p[1], em: EMO[r[2]], head: r[1], sub: r[0], cta: 'Shop now' } };
});
function list() { var real = ads; return real.length >= 12 ? real : real.concat(SAMPLES); }

/* ---------- themes: Auto changes colours every hour ---------- */
var TH = [['gold', '#f28c0f'], ['ocean', '#1e88e5'], ['forest', '#43a047'], ['rose', '#e91e63'], ['violet', '#7e57c2'], ['teal', '#00a99d'], ['sunset', '#ff5a36'], ['night', '#1a1a22']];
var themeMode = 'auto';
try { themeMode = localStorage.getItem('promo-theme') || 'auto'; } catch (e) {}
function autoName() { return TH[Math.floor(Date.now() / 3600000) % TH.length][0]; }
function applyTheme() {
  var n = themeMode === 'auto' ? autoName() : themeMode;
  document.documentElement.setAttribute('data-theme', n);
  Array.prototype.forEach.call($('dots').children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === themeMode)); });
}
function nextTheme() {
  var cur = themeMode === 'auto' ? autoName() : themeMode, i = 0;
  TH.forEach(function (t, k) { if (t[0] === cur) i = k; });
  setTheme(TH[(i + 1) % TH.length][0]);
}
function setTheme(t) { themeMode = t; try { localStorage.setItem('promo-theme', t); } catch (e) {} applyTheme(); }
(function () {
  var h = '<button class="dot" data-t="auto" title="Auto: changes every hour" aria-label="Auto theme, changes every hour" style="background:conic-gradient(#f28c0f,#43a047,#1e88e5,#7e57c2,#e91e63,#f28c0f)"></button>';
  TH.forEach(function (t) { h += '<button class="dot" data-t="' + t[0] + '" aria-label="' + t[0] + ' theme" style="background:' + t[1] + '"></button>'; });
  $('dots').innerHTML = h;
  $('dots').addEventListener('click', function (e) { var t = e.target.dataset && e.target.dataset.t; if (t) setTheme(t); });
  applyTheme(); setInterval(function () { if (themeMode === 'auto') applyTheme(); }, 30000);
})();

/* ---------- poster rendering ---------- */
function imgUrl(u) { return /^https:\/\/[^\s'"()<>\\]+$/i.test(u || '') ? u : ''; }
function posterHTML(a) {
  var p = a.poster || {}, im = imgUrl(a.img), vid = imgUrl(a.vid);
  var bg = im ? "#111 url('" + im + "') center/cover no-repeat" : 'linear-gradient(160deg,' + esc(p.c1) + ',' + esc(p.c2) + ')';
  var play = '';
  if (a.type === 'video' && !a.sample && !a.preview) {
    play = vid ? '<button class="play" data-vid="' + esc(vid) + '" aria-label="Play video: ' + esc(a.title) + '">▶</button>' :
      '<a class="play" href="' + esc(safeUrl(a.link)) + '" target="_blank" rel="noopener" data-track="' + esc(a.id) + '" aria-label="Watch video: ' + esc(a.title) + '">▶</a>';
  }
  return '<div class="poster fx-' + esc(a.fx || 'none') + (im ? ' has-img' : '') + '"><div class="pbg" style="background:' + bg + '"></div>' +
    '<span class="tag">' + (a.type === 'video' ? 'Video ad' : 'Poster') + (a.sample ? ' · Sample' : '') + '</span><span class="em" aria-hidden="true">' + esc(p.em) + '</span>' + play +
    '<b>' + esc(p.head) + '</b><span class="sub">' + esc(p.sub) + '</span><i class="cta">' + esc(p.cta) + '</i></div>';
}
function cardHTML(a) {
  var min = Math.min.apply(null, a.prices.map(function (p) { return p[1]; }));
  var rows = a.prices.map(function (p) { return '<tr' + (p[1] === min ? ' class="best"' : '') + '><td>' + esc(p[0]) + '</td><td>' + inr(p[1]) + '</td></tr>'; }).join('');
  var contact = (a.phone || a.email) ? '<p class="biz">' + (a.phone ? '<a href="tel:' + esc(a.phone.replace(/[^\d+]/g, '')) + '">Call ' + esc(a.phone) + '</a>' : '') + (a.email ? '<a href="mailto:' + esc(a.email) + '">' + esc(a.email) + '</a>' : '') + '</p>' : '';
  var btn = a.sample ? '<span class="btn ghost" aria-disabled="true">Sample ad</span>' : '<a class="btn" href="' + esc(safeUrl(a.link)) + '" target="_blank" rel="noopener" data-track="' + esc(a.id) + '">' + (a.type === 'video' ? 'Watch and buy' : 'Visit offer') + '</a>';
  return '<article class="card" data-id="' + esc(a.id) + '" data-real="' + (a.sample ? '' : '1') + '">' + posterHTML(a) + '<div class="info"><p class="biz">' + esc(a.cat) + ' · ' + esc(a.biz) + '</p><table>' + rows + '</table>' +
    btn + contact + '</div></article>';
}
function visible() {
  var qv = ($('q').value || '').toLowerCase().trim();
  return list().filter(function (a) {
    if (page === 'videos' && a.type !== 'video') return false;
    if (cat !== 'All' && a.cat !== cat) return false;
    if (!qv) return true;
    var t = (a.title + ' ' + a.biz + ' ' + a.cat + ' ' + a.prices.map(function (p) { return p[0]; }).join(' ')).toLowerCase();
    return t.indexOf(qv) > -1;
  });
}
var io = null;
function render() {
  var all = visible(), qv = ($('q').value || '').trim();
  $('feed').innerHTML = all.length ? all.slice(0, shown).map(cardHTML).join('') + (all.length > shown ? '<button class="chip" id="more" style="grid-column:1/-1;justify-self:center">Show more ads (' + (all.length - shown) + ' left)</button>' : '') :
    '<p class="empty">' + (qv ? 'No ads match your search. Try another word.' : 'No ads here yet. Post the first one.') + '</p>';
  var cs = ['All'].concat(CATS);
  $('chips').innerHTML = cs.map(function (c) { return '<button class="chip" aria-pressed="' + (c === cat) + '" data-c="' + c + '">' + c + '</button>'; }).join('');
  if ('IntersectionObserver' in window) {
    if (io) io.disconnect();
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var id = e.target.dataset.id, k = 'v' + id;
        try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (x) {}
        api('/api/track', { id: id, t: 'v' }).catch(function () {});
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call($('feed').querySelectorAll('.card[data-real="1"]'), function (c) { io.observe(c); });
  }
}
$('feed').addEventListener('click', function (e) {
  var pv = e.target.closest && e.target.closest('[data-vid]'); if (pv) { openVideo(pv.dataset.vid); return; }
  if (e.target.id === 'more') { shown += 12; render(); return; }
  var t = e.target.closest && e.target.closest('[data-track]');
  if (t) api('/api/track', { id: t.dataset.track, t: 'c' }).catch(function () {});
});
$('feed').addEventListener('pointermove', function (e) {
  var p = e.target.closest && e.target.closest('.poster.fx-tilt'); if (!p) return;
  var r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  p.style.transform = 'perspective(600px) rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg)';
});
$('feed').addEventListener('pointerout', function (e) {
  var p = e.target.closest && e.target.closest('.poster.fx-tilt'); if (p && !p.contains(e.relatedTarget)) p.style.transform = '';
});
$('chips').addEventListener('click', function (e) { var c = e.target.getAttribute('data-c'); if (c) { cat = c; shown = 12; render(); } });
$('q').addEventListener('input', function () { shown = 12; render(); });

/* ---------- routing ---------- */
var HERO = { home: ['Watch the ad. Pick the best price.', 'Local businesses post posters and videos with prices side by side. Tap an offer to go straight to the seller.'],
  videos: ['Video ads', 'Watch short video ads from local businesses and compare their prices.'] };
function route() {
  var h = location.hash.replace('#', '');
  page = ['videos', 'studio', 'insights', 'how'].indexOf(h) > -1 ? h : 'home';
  var feedPage = page === 'home' || page === 'videos';
  ['sbar', 'chips', 'feed'].forEach(function (id) { $(id).hidden = !feedPage; });
  $('voiceMsg').hidden = !feedPage;
  $('hero').hidden = !feedPage; $('studio').hidden = page !== 'studio'; $('insights').hidden = page !== 'insights'; $('howpage').hidden = page !== 'how';
  if (feedPage) { $('h1').textContent = HERO[page][0]; $('hp').textContent = HERO[page][1]; }
  Array.prototype.forEach.call(document.querySelectorAll('nav a'), function (a) { if (a.getAttribute('href') === '#' + page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  shown = 12; render(); if (page === 'insights') renderInsights(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
function go(p) { if (location.hash === '#' + p) route(); else location.hash = p; }

/* ---------- poster generator (AI first, local fallback) ---------- */
var TONE_CTA = { Festive: 'Shop the festival sale', Premium: 'Discover more', Fun: 'Grab it now!', Urgent: 'Limited time – order now' };
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function localPoster(i) {
  var pal = pick(PAL), head = (i.product || i.biz || 'Great offer').slice(0, 40);
  return { c1: pal[0], c2: pal[1], em: EMO[i.cat] || '⭐', head: head, sub: i.biz || '', cta: TONE_CTA[i.tone] || 'Shop now' };
}
function genPoster(i) { return Promise.resolve({ p: localPoster(i), ai: false }); }
function studioInputs() { return { biz: $('s-biz').value.trim(), product: $('s-prod').value.trim(), cat: $('s-cat').value, tone: $('s-tone').value, lang: $('s-lang').value }; }
function showStudio() { $('s-prev').innerHTML = draftPoster ? posterHTML({ poster: draftPoster, fx: 'shine', type: 'poster' }) : '<p class="note" style="padding:30px;text-align:center">Fill in the form and tap Generate.</p>'; }
function wrapText(x, t, px, py, maxW, lh) {
  var words = String(t).split(' '), line = '', lines = [];
  words.forEach(function (w) { var test = line ? line + ' ' + w : w; if (x.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; });
  lines.push(line); var y = py - (lines.length - 1) * lh;
  lines.forEach(function (l, k) { x.fillText(l, px, y + k * lh); });
}
function downloadPoster(p) {
  var c = document.createElement('canvas'); c.width = 1080; c.height = 1350; var x = c.getContext('2d');
  var g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, p.c1); g.addColorStop(1, p.c2); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  var o = x.createLinearGradient(0, 500, 0, 1350); o.addColorStop(0, 'rgba(0,0,0,0)'); o.addColorStop(1, 'rgba(0,0,0,.6)'); x.fillStyle = o; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = 'right'; x.font = '300px serif'; x.fillText(p.em, 1030, 380);
  x.textAlign = 'left'; x.fillStyle = '#fff'; x.font = '700 40px system-ui,sans-serif'; x.fillText('Promo', 70, 110);
  x.font = '800 100px system-ui,sans-serif'; wrapText(x, p.head, 70, 920, 900, 108);
  x.font = '500 46px system-ui,sans-serif'; x.fillText(p.sub, 70, 1060);
  x.font = '700 44px system-ui,sans-serif'; var w = x.measureText(p.cta).width + 70; x.fillStyle = '#fff';
  x.beginPath(); if (x.roundRect) x.roundRect(70, 1120, w, 90, 45); else x.rect(70, 1120, w, 90); x.fill();
  x.fillStyle = '#111'; x.fillText(p.cta, 105, 1182);
  c.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'promo-poster.png'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000); });
}
$('s-gen').onclick = function () {
  var i = studioInputs(); if (!i.biz || !i.product) { $('s-note').textContent = 'Add your business name and product or offer first.'; return; }
  $('s-gen').disabled = true; $('s-note').textContent = 'Creating your poster…';
  genPoster(i).then(function (r) { draftPoster = r.p; showStudio(); $('s-note').textContent = 'Poster ready. Tap Generate again for new colours, or download it.'; $('s-gen').disabled = false; });
};
$('s-shuf').onclick = function () { if (!draftPoster) return; var pal = pick(PAL); draftPoster.c1 = pal[0]; draftPoster.c2 = pal[1]; showStudio(); };
$('s-dl').onclick = function () { if (draftPoster) downloadPoster(draftPoster); else toast('Generate a poster first.'); };
$('s-use').onclick = function () { if (!draftPoster) { toast('Generate a poster first.'); return; } $('f-biz').value = $('s-biz').value; $('f-title').value = draftPoster.head; openPost(); };

/* ---------- post ad + payment gate ---------- */
var dlg = $('dlg');
function curPoster() { return draftPoster || localPoster({ biz: $('f-biz').value.trim(), product: $('f-title').value.trim(), cat: $('f-cat').value, tone: 'Festive' }); }
var autoPoster = null;
function updPrev() { var p = draftPoster || autoPoster || (autoPoster = curPoster()); $('dPrev').innerHTML = posterHTML({ poster: p, fx: $('f-fx').value, type: $('f-type').value, id: 'x', title: '', img: upImg || imgUrl($('f-img').value.trim()), preview: true }); }
function openPost() { $('err').textContent = ''; autoPoster = null; upImg = ''; upVid = ''; $('f-file').value = ''; $('f-img').value = ''; upNote('Optional. Images up to 10 MB, videos up to 50 MB.', 0); updPrev(); if (!dlg.open) dlg.showModal(); }
$('open').onclick = openPost;
$('cancel').onclick = function () { dlg.close(); };
['f-fx', 'f-type'].forEach(function (id) { $(id).addEventListener('change', updPrev); });
['f-biz', 'f-title', 'f-cat'].forEach(function (id) { $(id).addEventListener('change', function () { if (!draftPoster) { autoPoster = null; updPrev(); } }); });
$('d-shuf').onclick = function () { var p = draftPoster || autoPoster || curPoster(), pal = pick(PAL); p.c1 = pal[0]; p.c2 = pal[1]; if (draftPoster) draftPoster = p; else autoPoster = p; updPrev(); };
$('d-ai').onclick = function () {
  var i = { biz: $('f-biz').value.trim(), product: $('f-title').value.trim(), cat: $('f-cat').value, tone: 'Festive', lang: 'English' };
  if (!i.biz || !i.product) { $('err').textContent = 'Add your business name and headline first.'; return; }
  $('err').textContent = ''; $('d-ai').disabled = true;
  genPoster(i).then(function (r) { draftPoster = r.p; updPrev(); $('d-ai').disabled = false;  });
};
var upImg = '', upVid = '';
function upNote(t, pct) { $('upNote').textContent = t; $('upProg').hidden = !pct; $('upProg').firstChild.style.width = (pct || 0) + '%'; }
function collect() {
  var v = function (id) { return $(id).value.trim(); }, prices = [];
  [1, 2, 3].forEach(function (n) { var s = v('s' + n), p = parseFloat(v('p' + n)); if (s && !isNaN(p) && p >= 0) prices.push([s, p]); });
  var d = { id: Math.random().toString(16).slice(2, 10), ts: Date.now(), biz: v('f-biz'), title: v('f-title'), cat: v('f-cat'), type: v('f-type'), fx: v('f-fx'), link: v('f-link'), phone: v('f-phone'), email: v('f-email'), prices: prices, poster: draftPoster || autoPoster || curPoster() };
  var pasted = imgUrl(v('f-img')), im = upImg || pasted;
  if (im) d.img = im; if (upVid) d.vid = upVid;
  if (!d.biz || !d.title) return 'Add your business name and headline.';
  if (prices.length < 2) return 'Add at least two sellers with prices.';
  if (v('f-img') && !pasted) return 'The image link must start with https://';
  if (!/^https?:\/\//i.test(d.link)) return 'The link must start with http:// or https://';
  if (!/^\+?[\d\s-]{10,15}$/.test(d.phone)) return 'Enter a valid contact number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Enter a valid email.';
  return d;
}
$('send').onclick = function () {
  var d = collect(); if (typeof d === 'string') { $('err').textContent = d; return; }
  var text = 'New Promo ad request\n\n' + JSON.stringify(d);
  try { navigator.clipboard.writeText(text); } catch (e) {}
  var url = OWNER_WHATSAPP ? 'https://wa.me/' + OWNER_WHATSAPP.replace(/\D/g, '') + '?text=' + encodeURIComponent(text) :
    OWNER_EMAIL ? 'mailto:' + OWNER_EMAIL + '?subject=' + encodeURIComponent('New Promo ad: ' + d.title) + '&body=' + encodeURIComponent(text) : '';
  if (url) window.open(url, '_blank', 'noopener');
  toast(url ? 'Send the message to submit your ad.' : 'Your ad details were copied. Paste them to the Promo owner.');
  dlg.close();
};
$('f-file').addEventListener('change', function () {
  var f = this.files && this.files[0]; if (!f) return;
  var vid = f.type.indexOf('video/') === 0, img = f.type.indexOf('image/') === 0;
  if (!vid && !img) { upNote('Please choose an image or a video.', 0); return; }
  if (f.size > (vid ? 50 : 10) * 1048576) { upNote('That file is too large. Images up to 10 MB, videos up to 50 MB.', 0); return; }
  if (!CLOUD_NAME || !UPLOAD_PRESET) { upNote('Uploads are not switched on yet. Paste an image link below instead.', 0); return; }
  var fd = new FormData(); fd.append('file', f); fd.append('upload_preset', UPLOAD_PRESET);
  var x = new XMLHttpRequest(); x.open('POST', 'https://api.cloudinary.com/v1_1/' + encodeURIComponent(CLOUD_NAME) + '/auto/upload');
  x.upload.onprogress = function (e) { if (e.lengthComputable) { var pc = Math.round(e.loaded / e.total * 100); upNote('Uploading… ' + pc + '%', Math.max(3, pc)); } };
  x.onload = function () {
    var j = {}; try { j = JSON.parse(x.responseText); } catch (e) {}
    if (x.status >= 200 && x.status < 300 && imgUrl(j.secure_url)) {
      if (vid) { upVid = j.secure_url; upImg = imgUrl(j.secure_url.replace(/\.[a-z0-9]+$/i, '.jpg')); $('f-type').value = 'video'; }
      else { upImg = j.secure_url; upVid = ''; }
      upNote('Uploaded ✓', 0); updPrev();
    } else upNote((j.error && j.error.message) || 'Upload failed. Please try again.', 0);
  };
  x.onerror = function () { upNote('Upload failed. Check your internet and try again.', 0); };
  x.send(fd);
});
$('f-img').addEventListener('change', updPrev);
function openVideo(u) { $('vplayer').src = u; $('vdlg').showModal(); var pr = $('vplayer').play(); if (pr && pr.catch) pr.catch(function () {}); }
$('vclose').onclick = function () { $('vdlg').close(); };
$('vdlg').addEventListener('close', function () { $('vplayer').pause(); $('vplayer').removeAttribute('src'); });

/* ---------- voice assistant ---------- */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null;
function vmsg(t) { $('voiceMsg').textContent = t; }
function say(t) { if (!window.speechSynthesis) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = $('lang').value; speechSynthesis.speak(u); }
function readAds() {
  var l = visible().slice(0, 3); if (!l.length) { say('There are no ads to read.'); return; }
  say(l.map(function (a) { var m = a.prices.slice().sort(function (x, y) { return x[1] - y[1]; })[0]; return a.title + ' from ' + a.biz + '. Best price ' + m[1] + ' rupees at ' + m[0] + '.'; }).join(' '));
}
function handle(t) {
  var l = t.toLowerCase().trim(), m;
  if (/^(stop|quiet|silence)/.test(l)) { if (window.speechSynthesis) speechSynthesis.cancel(); return; }
  if ((m = l.match(/(go to|open|show)\s+(home|videos?|studio|insights?|how)/))) { var k = m[2].replace(/s$/, ''); go({ home: 'home', video: 'videos', studio: 'studio', insight: 'insights', how: 'how' }[k] || 'home'); say('Opening ' + m[2]); return; }
  if (/(post|add|create).*(ad|advert)/.test(l)) { openPost(); say('Opening the post ad form.'); return; }
  if (/(next|change).*(theme|colou?r)/.test(l)) { nextTheme(); say('Theme changed.'); return; }
  if ((m = l.match(/(show|filter)\s+(fashion|food|electronics|home|services|all)/))) { cat = m[2] === 'all' ? 'All' : m[2].charAt(0).toUpperCase() + m[2].slice(1); go('home'); shown = 12; render(); say('Showing ' + m[2] + ' ads. ' + visible().length + ' found.'); return; }
  if (/^(read|tell me)/.test(l)) { readAds(); return; }
  m = l.match(/^(search|find|look for)( for)?\s+(.+)/); var q = m ? m[3] : t;
  $('q').value = q; cat = 'All'; go('home'); shown = 12; render(); say('Showing results for ' + q + '. ' + visible().length + ' ads found.');
}
$('mic').onclick = function () {
  if (!SR) { vmsg('Voice input is not supported in this browser. Try Chrome on Android or desktop.'); return; }
  if (rec) { try { rec.stop(); } catch (e) {} return; }
  rec = new SR(); rec.lang = $('lang').value; rec.interimResults = false; rec.maxAlternatives = 1;
  rec.onstart = function () { $('mic').setAttribute('aria-pressed', 'true'); vmsg('Listening… try “search sarees”, “show food”, “open videos”, “read ads”, “post an ad” or “change theme”.'); };
  rec.onresult = function (e) { var t = e.results[0][0].transcript; vmsg('You said: ' + t); handle(t); };
  rec.onerror = function (e) { vmsg('Voice problem: ' + e.error + (e.error === 'not-allowed' ? '. Please allow the microphone.' : '')); };
  rec.onend = function () { $('mic').setAttribute('aria-pressed', 'false'); rec = null; };
  rec.start();
};

/* ---------- business insights (computed from the ads on the page) ---------- */
function bar(label, val, max, extra) { return '<div class="r"><span>' + esc(label) + '</span><i style="width:' + Math.max(3, Math.round(val / (max || 1) * 100)) + '%"></i><span>' + esc(extra) + '</span></div>'; }
function renderInsights() {
  var src = ads.length ? ads : SAMPLES, byCat = {}, gaps = [], cheap = 0;
  CATS.forEach(function (c) { byCat[c] = 0; });
  src.forEach(function (a) {
    byCat[a.cat] = (byCat[a.cat] || 0) + 1;
    var ps = a.prices.map(function (p) { return p[1]; }), mx = Math.max.apply(null, ps), mn = Math.min.apply(null, ps);
    cheap += mn; if (mx > 0) gaps.push({ a: a, g: (mx - mn) / mx * 100, save: mx - mn });
  });
  var avgGap = gaps.length ? gaps.reduce(function (s, x) { return s + x.g; }, 0) / gaps.length : 0;
  var top = gaps.slice().sort(function (x, y) { return y.g - x.g; }).slice(0, 6);
  var mxN = Math.max.apply(null, Object.keys(byCat).map(function (k) { return byCat[k]; }).concat([1]));
  var least = Object.keys(byCat).sort(function (x, y) { return byCat[x] - byCat[y]; })[0], most = Object.keys(byCat).sort(function (x, y) { return byCat[y] - byCat[x]; })[0];
  var tips = ['Most ads are in ' + most + '. Shoppers there have the most choice.', 'Only ' + byCat[least] + ' ad(s) in ' + least + '. Approach businesses in that category first, since they will face less competition.',
    'On average the cheapest seller is ' + avgGap.toFixed(1) + '% below the highest price. Use that in your outreach: show your best price on Promo.', 'Launch tip: invite 10 local shops to post one ad each, then ask them to share the Promo link.'];
  $('idash').innerHTML = '<div class="kpis">' + [['Ads shown', src.length], ['Avg price gap', avgGap.toFixed(1) + '%'], ['Avg cheapest price', inr(src.length ? Math.round(cheap / src.length) : 0)], ['Posting fee', 'Free']].map(function (k) { return '<div class="card kpi"><b>' + esc(k[1]) + '</b><span>' + k[0] + '</span></div>'; }).join('') + '</div>' +
    '<div class="card pad bars"><h2>Ads by category</h2>' + Object.keys(byCat).map(function (k) { return bar(k, byCat[k], mxN, byCat[k] + ' ads'); }).join('') + '</div>' +
    '<div class="card pad"><h2>Biggest price gaps</h2><table>' + top.map(function (x) { return '<tr><td>' + esc(x.a.title) + ' · ' + esc(x.a.biz) + '</td><td>' + x.g.toFixed(0) + '% (' + inr(x.save) + ')</td></tr>'; }).join('') + '</table></div>' +
    '<div class="card pad"><h2>Where to grow</h2><ol>' + tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>';
  $('ains').textContent = ads.length ? 'Based on the ' + ads.length + ' live ads.' : 'No live ads yet, so this uses the sample ads.';
}
$('aload').onclick = renderInsights;

/* ---------- boot ---------- */
function fillCats() { var o = CATS.map(function (c) { return '<option>' + c + '</option>'; }).join(''); $('f-cat').innerHTML = o; $('s-cat').innerHTML = o; }
function loadAds() {
  $('priceBig').textContent = 'Free';
  return fetch('ads.json', { cache: 'no-store' }).then(function (r) { return r.json(); })
    .then(function (list) { ads = (Array.isArray(list) ? list : []).filter(function (x) { return x && x.biz && x.title && Array.isArray(x.prices) && x.prices.length; }).slice(0, 1000); render(); })
    .catch(function () { render(); });
}
fillCats(); showStudio(); route(); loadAds();
})();
