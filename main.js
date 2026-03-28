// ========== DATA STORE (localStorage) ==========
const KEYS = {
  products: 'nn_products',
  orders: 'nn_orders',
  testimonials: 'nn_testimonials',
  lookbook: 'nn_lookbook',
  settings: 'nn_settings',
  announcement: 'nn_ann',
  site: 'nn_site',
  password: 'nn_pass',
  activity: 'nn_activity',
  sizing: 'nn_sizing'               // NEW: sizing chart data
};

function load(k) {
  try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
}
function save(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

// Default sizing chart (same as original)
function defaultSizing() {
  return [
    { size: 'XS', bust: '80–84', waist: '60–64', hips: '86–90', length: '140–142', sleeve: '58–60' },
    { size: 'S', bust: '84–88', waist: '64–68', hips: '90–94', length: '142–144', sleeve: '60–62' },
    { size: 'M', bust: '88–92', waist: '68–72', hips: '94–98', length: '144–146', sleeve: '62–64' },
    { size: 'L', bust: '92–96', waist: '72–76', hips: '98–102', length: '146–148', sleeve: '64–66' },
    { size: 'XL', bust: '96–102', waist: '76–82', hips: '102–108', length: '148–150', sleeve: '66–68' },
    { size: 'XXL', bust: '102–108', waist: '82–88', hips: '108–114', length: '150–152', sleeve: '68–70' },
    { size: '3XL', bust: '108–116', waist: '88–96', hips: '114–122', length: '152–154', sleeve: '70–72' },
    { size: 'Custom', bust: 'Send your exact measurements via WhatsApp 💬', waist: '', hips: '', length: '', sleeve: '' }
  ];
}
function getSizing() { return load(KEYS.sizing) || defaultSizing(); }

// ... (all previous functions: getProducts, defaultProducts, getTestimonials, etc. remain unchanged) ...

// ========== SIZING CHART ADMIN ==========
function renderAdminSizing() {
  const sizing = getSizing();
  const tbody = document.getElementById('sizingAdminTbody');
  if (!tbody) return;
  tbody.innerHTML = sizing.map((row, idx) => `
    <tr>
      <td><input type="text" value="${row.size}" id="size_${idx}" style="background:transparent;border:1px solid rgba(201,168,76,.3);color:white;padding:6px;"></td>
      <td><input type="text" value="${row.bust}" id="bust_${idx}"></td>
      <td><input type="text" value="${row.waist}" id="waist_${idx}"></td>
      <td><input type="text" value="${row.hips}" id="hips_${idx}"></td>
      <td><input type="text" value="${row.length}" id="length_${idx}"></td>
      <td><input type="text" value="${row.sleeve}" id="sleeve_${idx}"></td>
      <td><button class="ap-btn ap-del" onclick="deleteSizingRow(${idx})">Del</button></td>
    </tr>
  `).join('');
  // Add a row for new size
  const newRow = `
    <tr id="newSizingRow">
      <td><input type="text" id="new_size" placeholder="Size"></td>
      <td><input type="text" id="new_bust" placeholder="Bust"></td>
      <td><input type="text" id="new_waist" placeholder="Waist"></td>
      <td><input type="text" id="new_hips" placeholder="Hips"></td>
      <td><input type="text" id="new_length" placeholder="Length"></td>
      <td><input type="text" id="new_sleeve" placeholder="Sleeve"></td>
      <td><button class="ap-btn ap-edit" onclick="addSizingRow()">+ Add</button></td>
    </tr>
  `;
  tbody.insertAdjacentHTML('beforeend', newRow);
}

function saveSizingChart() {
  const sizing = [];
  const rows = document.querySelectorAll('#sizingAdminTbody tr:not(#newSizingRow)');
  rows.forEach((row, idx) => {
    const size = document.getElementById(`size_${idx}`)?.value;
    if (size) {
      sizing.push({
        size: size,
        bust: document.getElementById(`bust_${idx}`)?.value || '',
        waist: document.getElementById(`waist_${idx}`)?.value || '',
        hips: document.getElementById(`hips_${idx}`)?.value || '',
        length: document.getElementById(`length_${idx}`)?.value || '',
        sleeve: document.getElementById(`sleeve_${idx}`)?.value || ''
      });
    }
  });
  save(KEYS.sizing, sizing);
  toast('Sizing chart saved!');
  renderSizingPage(); // update public sizing page if open
}

function deleteSizingRow(idx) {
  const sizing = getSizing();
  sizing.splice(idx, 1);
  save(KEYS.sizing, sizing);
  renderAdminSizing();
  renderSizingPage();
}

function addSizingRow() {
  const newSize = document.getElementById('new_size')?.value.trim();
  if (!newSize) { toast('Please enter a size'); return; }
  const sizing = getSizing();
  sizing.push({
    size: newSize,
    bust: document.getElementById('new_bust')?.value || '',
    waist: document.getElementById('new_waist')?.value || '',
    hips: document.getElementById('new_hips')?.value || '',
    length: document.getElementById('new_length')?.value || '',
    sleeve: document.getElementById('new_sleeve')?.value || ''
  });
  save(KEYS.sizing, sizing);
  renderAdminSizing();
  renderSizingPage();
  toast('Size added');
}

// Render public sizing page
function renderSizingPage() {
  const sizing = getSizing();
  const tbody = document.getElementById('sizingPublicTbody');
  if (!tbody) return;
  tbody.innerHTML = sizing.map(row => `
    <tr>
      <td>${row.size}</td>
      <td>${row.bust}</td>
      <td>${row.waist}</td>
      <td>${row.hips}</td>
      <td>${row.length}</td>
      <td>${row.sleeve}</td>
    </tr>
  `).join('');
}

// ========== PAYMENT INTEGRATION (Paystack) ==========
// Owner can set Paystack public key in admin settings
function getPaystackKey() {
  const settings = getSettings();
  return settings.paystackPublicKey || ''; // will be stored in settings
}

function payWithPaystack(productName, amount, email) {
  const key = getPaystackKey();
  if (!key) {
    toast('Payment not configured. Please contact the owner.');
    return;
  }
  const handler = PaystackPop.setup({
    key: key,
    email: email,
    amount: amount * 100, // amount in kobo
    currency: 'NGN',
    ref: 'n0tn0or_' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      toast('Payment successful! Reference: ' + response.reference);
      // Optionally record order in localStorage
      addActivity(`Payment received for ${productName}, ref: ${response.reference}`);
    },
    onClose: function() {
      toast('Payment cancelled.');
    }
  });
  handler.openIframe();
}

// ========== UPDATE PRODUCT CARD WITH SIZE SELECTOR ==========
function renderPublicProducts() {
  const grid = document.getElementById('publicProductGrid');
  if (!grid) return;
  let prods = getProducts().filter(p => p.status !== 'hidden');
  if (!prods.length) {
    grid.innerHTML = '<div class="no-products">New collection coming soon 🌙</div>';
    return;
  }
  grid.innerHTML = prods.map(p => {
    const badge = p.badge ? `<div class="prod-badge ${p.badge === 'sold' ? 'sold' : (p.badge === 'new' ? 'new' : '')}">${p.badge.toUpperCase()}</div>` : '';
    const imgHTML = p.img ? `<img src="${p.img}" alt="${p.name}">` : `<div class="prod-visual-placeholder ${p.color || 'g1'}" style="height:100%;"></div>`;
    const sizes = (p.sizes || []).map(s => `<option value="${s}">${s}</option>`).join('');
    return `
      <div class="prod-card" data-product-id="${p.id}">
        <div class="prod-visual">
          ${imgHTML}
          <div class="prod-shimmer"></div>
          ${badge}
          <div class="prod-overlay">
            <div class="prod-tag">${p.tag || ''}</div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-desc">${p.desc || ''}</div>
            ${p.price ? `<div class="prod-price">${p.price}</div>` : ''}
            <div class="size-selector" style="margin: 10px 0;">
              <select class="product-size" style="background:rgba(0,0,0,0.7); border:1px solid var(--gold); color:white; padding:6px;">
                <option value="">Select size</option>
                ${sizes}
              </select>
              <a href="sizing.html" target="_blank" style="font-size:0.7rem; margin-left:8px; color:var(--gold);">Size Chart</a>
            </div>
            <button class="prod-order-btn order-now-btn" data-name="${p.name}" data-wamsg="${p.waMsg || 'Hi I want to order ' + p.name}">Order via WhatsApp →</button>
            <button class="pay-now-btn" data-name="${p.name}" data-price="${p.basePrice || 0}" style="margin-top:5px; background:var(--gold); color:black; border:none; padding:6px 12px; font-size:0.7rem; cursor:pointer;">Pay Now</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners after rendering
  document.querySelectorAll('.order-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      const sizeSelect = card.querySelector('.product-size');
      const selectedSize = sizeSelect ? sizeSelect.value : '';
      const productName = btn.dataset.name;
      let waMsg = btn.dataset.wamsg;
      if (selectedSize) waMsg += ` (Size: ${selectedSize})`;
      window.open(`https://wa.me/2348020965505?text=${encodeURIComponent(waMsg)}`, '_blank');
    });
  });

  document.querySelectorAll('.pay-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productName = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      if (!price) { toast('Price not available'); return; }
      // Prompt for email
      const email = prompt('Enter your email address for payment receipt:', 'customer@example.com');
      if (email && email.includes('@')) {
        payWithPaystack(productName, price, email);
      } else {
        toast('Valid email required');
      }
    });
  });
  observeReveals();
}

// ========== UPDATE SETTINGS TO INCLUDE PAYSTACK KEY ==========
function loadSettings() {
  const s = getSettings();
  const look = document.getElementById('tog-lookbook');
  if (look) look.checked = s.lookbook !== false;
  const test = document.getElementById('tog-testi');
  if (test) test.checked = s.testi !== false;
  const wa = document.getElementById('tog-wa');
  if (wa) wa.checked = s.wa !== false;
  const eid = document.getElementById('tog-eid');
  if (eid) eid.checked = !!s.eid;
  const paystackKey = document.getElementById('paystackKey');
  if (paystackKey) paystackKey.value = s.paystackPublicKey || '';
}

function saveSettings() {
  const s = {
    lookbook: document.getElementById('tog-lookbook')?.checked ?? true,
    testi: document.getElementById('tog-testi')?.checked ?? true,
    wa: document.getElementById('tog-wa')?.checked ?? true,
    eid: document.getElementById('tog-eid')?.checked ?? false,
    paystackPublicKey: document.getElementById('paystackKey')?.value || ''
  };
  save(KEYS.settings, s);
  const msg = document.getElementById('settingsSaveMsg');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 2000);
  }
  applySettings();
}

// ========== UPDATE ADMIN PANEL SWITCH TO INCLUDE SIZING ==========
function showPanel(id) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  const link = document.querySelector(`.sb-link[data-panel="${id}"]`);
  if (link) link.classList.add('active');
  const sel = document.getElementById('adminPanelSelect');
  if (sel) sel.value = id;
  if (id === 'products') renderAdminProducts();
  if (id === 'lookbook') renderAdminLookbook();
  if (id === 'orders') renderOrders();
  if (id === 'testimonials') renderTestimonialsAdmin();
  if (id === 'announcements') loadAnnouncement();
  if (id === 'sizing') renderAdminSizing();
  if (id === 'settings') loadSettings();
}

// ========== INITIALIZATION (updated) ==========
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  observeReveals();

  const page = window.CURRENT_PAGE || 'home';
  if (page === 'home') {
    renderPublicProducts();
    renderPublicTestimonials();
    renderLookbook();
    renderSiteContent();
    applySettings();
    updateAnnBar(getAnnouncement());
    // Announcement color picker init
    const ann = getAnnouncement();
    document.querySelectorAll('#annColorPicker > div').forEach(d => {
      d.dataset.color = d.style.background;
      d.style.borderColor = d.style.background === ann.color ? 'var(--white)' : 'transparent';
    });
  } else if (page === 'admin') {
    if (!sessionStorage.getItem('nn_auth')) {
      window.location.href = 'login.html';
      return;
    }
    renderDashStats();
    renderAdminProducts();
    renderOrders();
    renderTestimonialsAdmin();
    renderAdminLookbook();
    renderAdminSizing();
    loadSettings();
    renderActivity();
    loadAnnouncement();
  } else if (page === 'login') {
    // Login page, do nothing extra
  } else if (page === 'sizing') {
    renderSizingPage();
    applySettings();
    updateAnnBar(getAnnouncement());
  } else {
    // Other pages: order, delivery, contact
    applySettings();
    updateAnnBar(getAnnouncement());
  }
});
