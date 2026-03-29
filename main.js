// ========== DATA STORE ==========
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
  sizing: 'nn_sizing'
};

function load(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

// Default data
function defaultProducts() {
  return [
    { id: 1, name: 'The Rose Abaya', tag: 'Signature Piece', price: 'Contact for pricing', desc: 'A soft, flowing silhouette.', badge: 'new', sizes: ['S','M','L','XL'], color: 'g1', img: '', status: 'active', waMsg: 'Hi I want to order the Rose Abaya', basePrice: 85000 },
    { id: 2, name: 'Lavender Lace Set', tag: 'Limited Edition', price: 'Contact for pricing', desc: 'Delicate lace detail.', badge: 'limited', sizes: ['S','M','L'], color: 'g2', img: '', status: 'active', waMsg: 'Hi I want to order the Lavender Lace Set', basePrice: 95000 }
  ];
}
function getProducts() { return load(KEYS.products) || defaultProducts(); }

function defaultTestis() {
  return [
    { id: 1, name: 'Fatimah A.', loc: 'London, UK 🇬🇧', text: 'Absolutely obsessed with my Eid abaya.', stars: 5 }
  ];
}
function getTestimonials() { return load(KEYS.testimonials) || defaultTestis(); }

function defaultLookbook() {
  return [
    { id: 1, title: 'The Rose Feather Abaya', color: 'g1', img: '' }
  ];
}
function getLookbook() { return load(KEYS.lookbook) || defaultLookbook(); }

function getOrders() { return load(KEYS.orders) || []; }
function getSettings() { return load(KEYS.settings) || { lookbook: true, testi: true, wa: true, eid: false, paystackPublicKey: '' }; }
function getAnnouncement() { return load(KEYS.announcement) || { active: false, text: '', color: '#c9a84c' }; }
function getSiteConfig() { return load(KEYS.site) || defaultSiteConfig(); }
function getPassword() { return load(KEYS.password) || 'notnoor2024'; }
function getActivity() { return load(KEYS.activity) || []; }
function addActivity(msg) { let acts = getActivity(); acts.unshift({ msg, time: new Date().toLocaleString() }); save(KEYS.activity, acts.slice(0,20)); }

function defaultSiteConfig() {
  return {
    heroBadge: '<span class="hero-badge-dot"></span>Hijabi RTW · Worldwide Delivery 📦',
    heroTitle: 'This isn\'t just<br>a <span class="gold">shopping</span><br><span class="italic outline">page.</span>',
    heroSub: 'It\'s a space for modest fashion tips, styling ideas...',
    heroBtn1Text: '✦ Explore Collection',
    heroBtn1Link: '#collection-section',
    heroBtn2Text: 'How to Order',
    heroBtn2Link: 'order.html',
    heroBtn3Text: '💬 WhatsApp',
    heroBtn3Link: 'https://wa.me/2348020965505?text=Hi%20I%20want%20to%20order',
    marqueeItems: ['Hijabi RTW','Worldwide Delivery','Modest Fashion'],
    aboutQuote: '"Fashion isn\'t only about clothes..."',
    aboutAuthor: '— N0tN0Or · @not(noor) 👑',
    aboutTitle: 'More than a<br><span class="italic">clothing brand.</span>',
    aboutBody: 'N0tN0Or is a Hijabi RTW brand...',
    aboutPills: ['Hijabi RTW','Modest Fashion','Custom Sizing']
  };
}

function defaultSizing() {
  return [
    { size: 'XS', bust: '80–84', waist: '60–64', hips: '86–90', length: '140–142', sleeve: '58–60' },
    { size: 'S', bust: '84–88', waist: '64–68', hips: '90–94', length: '142–144', sleeve: '60–62' },
    { size: 'M', bust: '88–92', waist: '68–72', hips: '94–98', length: '144–146', sleeve: '62–64' },
    { size: 'L', bust: '92–96', waist: '72–76', hips: '98–102', length: '146–148', sleeve: '64–66' },
    { size: 'XL', bust: '96–102', waist: '76–82', hips: '102–108', length: '148–150', sleeve: '66–68' },
    { size: 'XXL', bust: '102–108', waist: '82–88', hips: '108–114', length: '150–152', sleeve: '68–70' },
    { size: '3XL', bust: '108–116', waist: '88–96', hips: '114–122', length: '152–154', sleeve: '70–72' },
    { size: 'Custom', bust: 'Send your exact measurements', waist: '', hips: '', length: '', sleeve: '' }
  ];
}
function getSizing() { return load(KEYS.sizing) || defaultSizing(); }

// ========== UTILITIES ==========
function toast(msg, dur=2800) { const t=document.getElementById('toast'); if(t){ t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),dur); } }
function openModal(id) { const m=document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id) { const m=document.getElementById(id); if(m) m.classList.remove('open'); }
document.addEventListener('keydown', e=>{ if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open')); });

// Scroll reveal
const revObs = new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); }), { threshold:0.1 });
function observeReveals(){ document.querySelectorAll('.reveal:not(.on)').forEach(r=>revObs.observe(r)); }

// Nav scroll & mobile menu
function initNavScroll(){ window.addEventListener('scroll',()=>{ const n=document.getElementById('mainNav'); if(n) n.classList.toggle('scrolled', window.scrollY>60); }); }
function initMobileMenu(){ const ham=document.getElementById('ham'), mob=document.getElementById('mobileMenu'), close=document.getElementById('mmClose'); if(ham) ham.onclick=()=>mob.classList.add('open'); if(close) close.onclick=()=>mob.classList.remove('open'); window.closeMM=()=>mob.classList.remove('open'); }

// ========== PAYMENT ==========
function payWithPaystack(productName, amount, email) {
  const key = getSettings().paystackPublicKey;
  if(!key) { toast('Payment not configured. Please contact owner.'); return; }
  const handler = PaystackPop.setup({
    key: key, email: email, amount: amount * 100, currency: 'NGN',
    ref: 'n0tn0or_'+Date.now(),
    callback: function(response){ toast('Payment successful! Ref: '+response.reference); addActivity(`Payment for ${productName}: ${response.reference}`); },
    onClose: function(){ toast('Payment cancelled.'); }
  });
  handler.openIframe();
}

// ========== HOME PAGE RENDERING ==========
function renderPublicProducts() {
  const grid = document.getElementById('publicProductGrid');
  if(!grid) return;
  let prods = getProducts().filter(p=>p.status!=='hidden');
  if(!prods.length) { grid.innerHTML='<div class="no-products">New collection coming soon 🌙</div>'; return; }
  grid.innerHTML = prods.map(p=>{
    const badge = p.badge ? `<div class="prod-badge ${p.badge==='sold'?'sold':(p.badge==='new'?'new':'')}">${p.badge.toUpperCase()}</div>` : '';
    const imgHTML = p.img ? `<img src="${p.img}" alt="${p.name}">` : `<div class="prod-visual-placeholder ${p.color||'g1'}"></div>`;
    const sizes = (p.sizes||[]).map(s=>`<option value="${s}">${s}</option>`).join('');
    return `
      <div class="prod-card" data-id="${p.id}">
        <div class="prod-visual">
          ${imgHTML}<div class="prod-shimmer"></div>${badge}
          <div class="prod-overlay">
            <div class="prod-tag">${p.tag||''}</div>
            <div class="prod-name">${p.name}</div>
            <div class="prod-desc">${p.desc||''}</div>
            ${p.price?`<div class="prod-price">${p.price}</div>`:''}
            <div class="size-selector" style="margin:10px 0;">
              <select class="product-size" style="background:rgba(0,0,0,0.7); border:1px solid var(--gold); color:white; padding:6px;"><option value="">Select size</option>${sizes}</select>
              <a href="sizing.html" target="_blank" style="font-size:0.7rem; margin-left:8px; color:var(--gold);">Size Chart</a>
            </div>
            <button class="order-now-btn" data-name="${p.name}" data-wamsg="${p.waMsg||'Hi I want to order '+p.name}">Order via WhatsApp →</button>
            <button class="pay-now-btn" data-name="${p.name}" data-price="${p.basePrice||0}">Pay Now</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  // attach events
  document.querySelectorAll('.order-now-btn').forEach(btn=>{
    btn.onclick = (e)=>{
      e.stopPropagation();
      const card = btn.closest('.prod-card');
      const size = card.querySelector('.product-size')?.value || '';
      let msg = btn.dataset.wamsg;
      if(size) msg += ` (Size: ${size})`;
      window.open(`https://wa.me/2348020965505?text=${encodeURIComponent(msg)}`,'_blank');
    };
  });
  document.querySelectorAll('.pay-now-btn').forEach(btn=>{
    btn.onclick = (e)=>{
      e.stopPropagation();
      const price = parseInt(btn.dataset.price);
      if(!price) { toast('Price not set'); return; }
      const email = prompt('Enter your email for payment receipt:','customer@example.com');
      if(email && email.includes('@')) payWithPaystack(btn.dataset.name, price, email);
      else toast('Valid email required');
    };
  });
  observeReveals();
}

function renderPublicTestimonials() {
  const grid = document.getElementById('testimonialGrid');
  if(!grid) return;
  const testis = getTestimonials();
  grid.innerHTML = testis.map(t=>`<div class="testi-card"><div class="testi-mark">"</div><div class="testi-top"><div class="testi-avatar">${t.name[0]}</div><div><div class="testi-name">${t.name}</div><div class="testi-loc">${t.loc||''}</div></div></div><div class="testi-stars">${'★'.repeat(t.stars||5)}</div><p class="testi-text">${t.text}</p></div>`).join('');
  observeReveals();
}

function renderLookbook() {
  const grid = document.getElementById('lookbookGrid');
  if(!grid) return;
  const items = getLookbook();
  grid.innerHTML = items.map((item,i)=>`<div class="lb-item reveal d${(i%4)+1}"><div class="lb-vis">${item.img?`<img src="${item.img}" style="width:100%;height:100%;object-fit:cover;">`:`<div class="lb-bg ${item.color||'g1'}"></div>`}<div class="lb-shine"></div><div class="lb-cap"><span class="lb-cap-text">${item.title}</span></div></div></div>`).join('');
  observeReveals();
}

function renderSiteContent() {
  const c = getSiteConfig();
  if(document.getElementById('heroBadge')) document.getElementById('heroBadge').innerHTML = c.heroBadge;
  if(document.getElementById('heroTitle')) document.getElementById('heroTitle').innerHTML = c.heroTitle;
  if(document.getElementById('heroSub')) document.getElementById('heroSub').textContent = c.heroSub;
  const btn1 = document.getElementById('heroBtn1'); if(btn1){ btn1.textContent=c.heroBtn1Text; btn1.href=c.heroBtn1Link; }
  const btn2 = document.getElementById('heroBtn2'); if(btn2){ btn2.textContent=c.heroBtn2Text; btn2.href=c.heroBtn2Link; }
  const btn3 = document.getElementById('heroBtn3'); if(btn3){ btn3.textContent=c.heroBtn3Text; btn3.href=c.heroBtn3Link; }
  if(document.getElementById('marqueeTrack')) document.getElementById('marqueeTrack').innerHTML = (c.marqueeItems||[]).map(item=>`<span class="marquee-item">${item} <span>✦</span></span>`).join('');
  if(document.getElementById('aboutQuote')) document.getElementById('aboutQuote').textContent = c.aboutQuote;
  if(document.getElementById('aboutAuthor')) document.getElementById('aboutAuthor').textContent = c.aboutAuthor;
  if(document.getElementById('aboutTitle')) document.getElementById('aboutTitle').innerHTML = c.aboutTitle;
  if(document.getElementById('aboutBody')) document.getElementById('aboutBody').textContent = c.aboutBody;
  if(document.getElementById('aboutPills')) document.getElementById('aboutPills').innerHTML = (c.aboutPills||[]).map(p=>`<span class="pill">${p}</span>`).join('');
}

function applySettings() {
  const s = getSettings();
  const lb = document.getElementById('lookbook-section'); if(lb) lb.style.display = s.lookbook===false?'none':'';
  const tg = document.getElementById('testimonialGrid')?.closest('section'); if(tg) tg.style.display = s.testi===false?'none':'';
  const wa = document.querySelector('.wa-float'); if(wa) wa.style.display = s.wa===false?'none':'';
  updateAnnBar(getAnnouncement());
}

// ========== ANNOUNCEMENT ==========
function updateAnnBar(ann) {
  const bar = document.getElementById('annBar');
  if(!bar) return;
  if(ann.active && ann.text){
    bar.style.display='block'; bar.textContent=ann.text; bar.style.background=ann.color||'#c9a84c';
    bar.style.color=ann.color==='#111'?'white':'black';
    document.body.classList.add('ann-visible');
  } else { bar.style.display='none'; document.body.classList.remove('ann-visible'); }
}
function loadAnnouncement() { const a=getAnnouncement(); const t=document.getElementById('annToggle'); if(t) t.checked=a.active; const tx=document.getElementById('annText'); if(tx) tx.value=a.text||''; updateAnnBar(a); }
function saveAnnouncement() { const ann={active:document.getElementById('annToggle')?.checked||false, text:document.getElementById('annText')?.value||'', color:getAnnouncement().color||'#c9a84c'}; save(KEYS.announcement,ann); updateAnnBar(ann); const msg=document.getElementById('annSaveMsg'); if(msg){msg.style.display='block'; setTimeout(()=>msg.style.display='none',2000);} }
function setAnnColor(c){ const a=getAnnouncement(); a.color=c; save(KEYS.announcement,a); document.querySelectorAll('#annColorPicker > div').forEach(d=>{d.style.borderColor=d.dataset.color===c?'white':'transparent';}); updateAnnBar(a); }

// ========== CONTACT FORM ==========
function submitContactForm(){
  const name=document.getElementById('cf-name')?.value.trim();
  const msg=document.getElementById('cf-msg')?.value.trim();
  if(!name||!msg){ toast('Please fill in name and message'); return; }
  window.open(`https://wa.me/2348020965505?text=${encodeURIComponent(`Hi, my name is ${name}. ${msg}`)}`,'_blank');
  const s=document.getElementById('formSuccess'); if(s) s.style.display='block';
  setTimeout(()=>{ if(s) s.style.display='none'; },4000);
}
function subscribeNewsletter(){ const e=document.getElementById('newsletterEmail')?.value.trim(); if(!e||!e.includes('@')){ toast('Valid email required'); return; } document.getElementById('newsletterSuccess').style.display='block'; document.getElementById('newsletterEmail').value=''; setTimeout(()=>document.getElementById('newsletterSuccess').style.display='none',4000); }

// ========== SIZING ADMIN & PUBLIC ==========
function renderAdminSizing(){
  const sizing = getSizing();
  const tbody = document.getElementById('sizingAdminTbody');
  if(!tbody) return;
  tbody.innerHTML = sizing.map((row,idx)=>`<tr><td><input type="text" value="${row.size}" id="size_${idx}"></td><td><input type="text" value="${row.bust}" id="bust_${idx}"></td><td><input type="text" value="${row.waist}" id="waist_${idx}"></td><td><input type="text" value="${row.hips}" id="hips_${idx}"></td><td><input type="text" value="${row.length}" id="length_${idx}"></td><td><input type="text" value="${row.sleeve}" id="sleeve_${idx}"></td><td><button class="ap-btn ap-del" onclick="deleteSizingRow(${idx})">Del</button></td></tr>`).join('');
  tbody.insertAdjacentHTML('beforeend',`<tr id="newSizingRow"><td><input id="new_size" placeholder="Size"></td><td><input id="new_bust" placeholder="Bust"></td><td><input id="new_waist" placeholder="Waist"></td><td><input id="new_hips" placeholder="Hips"></td><td><input id="new_length" placeholder="Length"></td><td><input id="new_sleeve" placeholder="Sleeve"></td><td><button class="ap-btn ap-edit" onclick="addSizingRow()">+ Add</button></td></tr>`);
}
function saveSizingChart(){
  const sizing = [];
  document.querySelectorAll('#sizingAdminTbody tr:not(#newSizingRow)').forEach((row,idx)=>{
    const size = document.getElementById(`size_${idx}`)?.value;
    if(size) sizing.push({ size, bust:document.getElementById(`bust_${idx}`).value, waist:document.getElementById(`waist_${idx}`).value, hips:document.getElementById(`hips_${idx}`).value, length:document.getElementById(`length_${idx}`).value, sleeve:document.getElementById(`sleeve_${idx}`).value });
  });
  save(KEYS.sizing, sizing);
  toast('Sizing chart saved!');
  renderSizingPage();
}
function deleteSizingRow(idx){ let s=getSizing(); s.splice(idx,1); save(KEYS.sizing,s); renderAdminSizing(); renderSizingPage(); }
function addSizingRow(){ const ns=document.getElementById('new_size')?.value.trim(); if(!ns){ toast('Enter size'); return; } const s=getSizing(); s.push({ size:ns, bust:document.getElementById('new_bust')?.value||'', waist:document.getElementById('new_waist')?.value||'', hips:document.getElementById('new_hips')?.value||'', length:document.getElementById('new_length')?.value||'', sleeve:document.getElementById('new_sleeve')?.value||'' }); save(KEYS.sizing,s); renderAdminSizing(); renderSizingPage(); toast('Size added'); }
function renderSizingPage(){ const t=document.getElementById('sizingPublicTbody'); if(!t) return; t.innerHTML=getSizing().map(r=>`<tr><td>${r.size}</td><td>${r.bust}</td><td>${r.waist}</td><td>${r.hips}</td><td>${r.length}</td><td>${r.sleeve}</td></tr>`).join(''); }

// ========== ADMIN DASHBOARD ==========
let _productFilter = '', _statusFilter = 'all';
let _editingProductId = null, _selectedColor = 'g1', _selectedSizes = [];

function showPanel(id){
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l=>l.classList.remove('active'));
  const p=document.getElementById('panel-'+id); if(p) p.classList.add('active');
  const l=document.querySelector(`.sb-link[data-panel="${id}"]`); if(l) l.classList.add('active');
  const sel=document.getElementById('adminPanelSelect'); if(sel) sel.value=id;
  if(id==='products') renderAdminProducts();
  if(id==='lookbook') renderAdminLookbook();
  if(id==='orders') renderOrders();
  if(id==='testimonials') renderTestimonialsAdmin();
  if(id==='sizing') renderAdminSizing();
  if(id==='settings') loadSettings();
}

function renderAdminProducts(){
  let prods = getProducts();
  if(_statusFilter !== 'all') prods = prods.filter(p => p.status === _statusFilter);
  if(_productFilter) prods = prods.filter(p => p.name.toLowerCase().includes(_productFilter) || (p.tag && p.tag.toLowerCase().includes(_productFilter)));
  const grid = document.getElementById('adminProductGrid');
  if(!grid) return;
  if(!prods.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(250,248,245,.3);">No products found. <button onclick="openAddProduct()" style="color:var(--gold);background:none;border:none;">Add one +</button></div>'; return; }
  grid.innerHTML = prods.map(p=>{
    const imgHTML = p.img ? `<img src="${p.img}" style="width:100%;height:100%;object-fit:cover;">` : `<div class="admin-prod-img-placeholder ${p.color||'g1'}">👗</div>`;
    return `<div class="admin-prod-card">
      <div class="admin-prod-img">${imgHTML}</div>
      <div class="admin-prod-info">
        <div class="admin-prod-tag">${p.tag||'—'} ${p.badge?`· <span style="color:var(--rose-light)">${p.badge}</span>`:''}</div>
        <div class="admin-prod-name">${p.name}</div>
        <div class="admin-prod-price">${p.price||'—'} · ${p.status}</div>
        <div class="admin-prod-actions">
          <button class="ap-btn ap-edit" onclick="openEditProduct(${p.id})">Edit</button>
          <button class="ap-btn ap-toggle" onclick="toggleProductStatus(${p.id})">${p.status==='active'?'Hide':'Show'}</button>
          <button class="ap-btn ap-del" onclick="deleteProduct(${p.id})">Del</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function filterProducts(v){ _productFilter=v.toLowerCase(); renderAdminProducts(); }
function filterProductsByStatus(v){ _statusFilter=v; renderAdminProducts(); }
function deleteProduct(id){ if(!confirm('Delete this product?')) return; const prods=getProducts().filter(p=>p.id!==id); save(KEYS.products,prods); addActivity(`Deleted product #${id}`); renderAdminProducts(); renderDashStats(); renderPublicProducts(); toast('Product deleted.'); }
function toggleProductStatus(id){ const prods=getProducts(); const p=prods.find(x=>x.id===id); if(!p) return; p.status=p.status==='active'?'hidden':'active'; save(KEYS.products,prods); addActivity(`${p.status==='active'?'Showed':'Hid'} product: ${p.name}`); renderAdminProducts(); renderPublicProducts(); toast(`Product ${p.status==='active'?'now visible':'now hidden'}.`); }
function clearAllProducts(){ save(KEYS.products,[]); renderAdminProducts(); renderDashStats(); renderPublicProducts(); toast('All products cleared.'); }

function openAddProduct(){
  _editingProductId=null; _selectedColor='g1'; _selectedSizes=[];
  document.getElementById('productModalTitle').textContent='Add Product';
  document.getElementById('editProductId').value='';
  ['pName','pTag','pPrice','pDesc','pDetails','pWAMsg'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  const badge=document.getElementById('pBadge'); if(badge) badge.value='';
  const status=document.getElementById('pStatus'); if(status) status.value='active';
  const imgPrev=document.getElementById('imgPreview'); if(imgPrev){ imgPrev.style.display='none'; imgPrev.src=''; }
  document.querySelectorAll('.size-chip').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('selected'));
  const firstColor=document.querySelector('.color-chip[data-val="g1"]'); if(firstColor) firstColor.classList.add('selected');
  openModal('productModal');
}
function openEditProduct(id){
  const p=getProducts().find(x=>x.id===id);
  if(!p) return;
  _editingProductId=id; _selectedColor=p.color||'g1'; _selectedSizes=[...(p.sizes||[])];
  document.getElementById('productModalTitle').textContent='Edit Product';
  document.getElementById('editProductId').value=id;
  document.getElementById('pName').value=p.name||'';
  document.getElementById('pTag').value=p.tag||'';
  document.getElementById('pPrice').value=p.price||'';
  document.getElementById('pDesc').value=p.desc||'';
  document.getElementById('pDetails').value=p.details||'';
  document.getElementById('pBadge').value=p.badge||'';
  document.getElementById('pStatus').value=p.status||'active';
  document.getElementById('pWAMsg').value=p.waMsg||'';
  const imgPrev=document.getElementById('imgPreview');
  if(p.img){ imgPrev.src=p.img; imgPrev.style.display='block'; } else { imgPrev.style.display='none'; }
  document.querySelectorAll('.size-chip').forEach(c=>c.classList.toggle('selected',_selectedSizes.includes(c.dataset.val)));
  document.querySelectorAll('.color-chip').forEach(c=>c.classList.toggle('selected',c.dataset.val===_selectedColor));
  openModal('productModal');
}
function saveProduct(){
  const name=document.getElementById('pName').value.trim();
  if(!name){ toast('Product name required'); return; }
  const prods=getProducts();
  const imgSrc=document.getElementById('imgPreview').src;
  const hasImg=imgSrc && imgSrc!=='' && !imgSrc.includes('n0tn0or_full.html');
  const data={
    name, tag:document.getElementById('pTag').value.trim(), price:document.getElementById('pPrice').value.trim(),
    desc:document.getElementById('pDesc').value.trim(), details:document.getElementById('pDetails').value.trim(),
    badge:document.getElementById('pBadge').value, sizes:_selectedSizes, color:_selectedColor,
    img:hasImg?imgSrc:'', status:document.getElementById('pStatus').value,
    waMsg:document.getElementById('pWAMsg').value.trim()||'Hi I want to order '+name,
    basePrice: 80000 + Math.floor(Math.random()*50000)
  };
  if(_editingProductId){
    const idx=prods.findIndex(p=>p.id===_editingProductId);
    if(idx>-1) prods[idx]={...prods[idx],...data};
    addActivity(`Updated product: ${name}`);
  } else {
    data.id=Date.now();
    prods.push(data);
    addActivity(`Added new product: ${name}`);
  }
  save(KEYS.products,prods);
  closeModal('productModal');
  renderAdminProducts(); renderDashStats(); renderPublicProducts();
  toast(_editingProductId?'Product updated!':'Product added!');
}
function toggleSizeChip(el){ el.classList.toggle('selected'); _selectedSizes=Array.from(document.querySelectorAll('.size-chip.selected')).map(c=>c.dataset.val); }
function selectColor(el,val){ _selectedColor=val; document.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('selected')); el.classList.add('selected'); }
function handleImageUpload(input){ const file=input.files[0]; if(!file) return; if(file.size>5*1024*1024){ toast('Image too large (max 5MB)'); return; } const reader=new FileReader(); reader.onload=e=>{ const prev=document.getElementById('imgPreview'); prev.src=e.target.result; prev.style.display='block'; }; reader.readAsDataURL(file); }
function handleLookbookUpload(input){ const file=input.files[0]; if(!file) return; if(file.size>5*1024*1024){ toast('Image too large (max 5MB)'); return; } const reader=new FileReader(); reader.onload=e=>{ const prev=document.getElementById('lbImgPreview'); prev.src=e.target.result; prev.style.display='block'; }; reader.readAsDataURL(file); }

// Lookbook admin
let _editingLookbookId=null, _selectedLbColor='g1';
function renderAdminLookbook(){
  const items=getLookbook();
  const grid=document.getElementById('adminLookbookGrid');
  if(!grid) return;
  if(!items.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;">No lookbook items. <button onclick="openAddLookbookItem()" style="color:var(--gold);background:none;border:none;">Add one +</button></div>'; return; }
  grid.innerHTML=items.map(item=>`<div class="admin-prod-card"><div class="admin-prod-img"><div class="admin-prod-img-placeholder ${item.color||'g1'}">📷</div></div><div class="admin-prod-info"><div class="admin-prod-name">${item.title}</div><div class="admin-prod-actions"><button class="ap-btn ap-edit" onclick="openEditLookbookItem(${item.id})">Edit</button><button class="ap-btn ap-del" onclick="deleteLookbookItem(${item.id})">Del</button></div></div></div>`).join('');
}
function openAddLookbookItem(){ _editingLookbookId=null; _selectedLbColor='g1'; document.getElementById('lookbookModalTitle').textContent='Add Lookbook Item'; document.getElementById('editLookbookId').value=''; document.getElementById('lbTitle').value=''; document.getElementById('lbImgPreview').style.display='none'; document.getElementById('lbImgPreview').src=''; document.getElementById('lbImgFileInput').value=''; document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.remove('selected')); document.querySelector('#lbColorSwatches .color-chip[data-val="g1"]').classList.add('selected'); openModal('lookbookModal'); }
function openEditLookbookItem(id){ const item=getLookbook().find(x=>x.id===id); if(!item) return; _editingLookbookId=id; _selectedLbColor=item.color||'g1'; document.getElementById('lookbookModalTitle').textContent='Edit Lookbook Item'; document.getElementById('editLookbookId').value=id; document.getElementById('lbTitle').value=item.title||''; document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.toggle('selected',c.dataset.val===_selectedLbColor)); if(item.img){ document.getElementById('lbImgPreview').src=item.img; document.getElementById('lbImgPreview').style.display='block'; } else { document.getElementById('lbImgPreview').style.display='none'; document.getElementById('lbImgPreview').src=''; } document.getElementById('lbImgFileInput').value=''; openModal('lookbookModal'); }
function saveLookbookItem(){ const title=document.getElementById('lbTitle').value.trim(); if(!title){ toast('Caption required'); return; } const items=getLookbook(); const imgSrc=document.getElementById('lbImgPreview').src; const hasImg=imgSrc && document.getElementById('lbImgPreview').style.display!=='none'; const data={ title, color:_selectedLbColor, img:hasImg?imgSrc:'' }; if(_editingLookbookId){ const idx=items.findIndex(i=>i.id===_editingLookbookId); if(idx>-1) items[idx]={...items[idx],...data}; addActivity(`Updated lookbook item: ${title}`); } else { data.id=Date.now(); items.push(data); addActivity(`Added lookbook item: ${title}`); } save(KEYS.lookbook,items); closeModal('lookbookModal'); renderAdminLookbook(); renderLookbook(); toast(_editingLookbookId?'Updated!':'Added!'); }
function deleteLookbookItem(id){ if(!confirm('Delete this lookbook item?')) return; const items=getLookbook().filter(i=>i.id!==id); save(KEYS.lookbook,items); renderAdminLookbook(); renderLookbook(); toast('Item deleted.'); }
function selectLbColor(el,val){ _selectedLbColor=val; document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.remove('selected')); el.classList.add('selected'); }

// Orders admin
function renderOrders(){
  const orders=getOrders();
  const tbody=document.getElementById('ordersTbody');
  if(!tbody) return;
  if(!orders.length){ tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:40px;">No orders yet.</td></tr>'; return; }
  const statusMap={ pending:'status-pending', confirmed:'status-confirmed', shipped:'status-shipped', delivered:'status-delivered', cancelled:'status-cancelled' };
  tbody.innerHTML=[...orders].reverse().map(o=>`<tr><td style="color:var(--gold);">#${o.id}</td><td>${o.name}</td><td>${o.product}</td><td>${o.country||'—'}</td><td><span class="order-status ${statusMap[o.status]||'status-pending'}">${o.status}</span></td><td>${o.date||'—'}</td><td><button class="order-action-btn" onclick="openEditOrder(${o.id})">Edit</button><button class="order-action-btn" style="border-color:rgba(224,80,80,.3);color:#e05050;" onclick="deleteOrder(${o.id})">Del</button></td></tr>`).join('');
}
function openAddOrder(){ document.getElementById('editOrderId').value=''; ['oName','oCountry','oProd','oContact','oNotes'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); const status=document.getElementById('oStatus'); if(status) status.value='pending'; openModal('orderModal'); }
function openEditOrder(id){ const o=getOrders().find(x=>x.id===id); if(!o) return; document.getElementById('editOrderId').value=id; document.getElementById('oName').value=o.name||''; document.getElementById('oCountry').value=o.country||''; document.getElementById('oProd').value=o.product||''; document.getElementById('oContact').value=o.contact||''; document.getElementById('oNotes').value=o.notes||''; document.getElementById('oStatus').value=o.status||'pending'; openModal('orderModal'); }
function saveOrder(){ const name=document.getElementById('oName').value.trim(); if(!name){ toast('Customer name required'); return; } const orders=getOrders(); const editId=document.getElementById('editOrderId').value; const data={ name, country:document.getElementById('oCountry').value.trim(), product:document.getElementById('oProd').value.trim(), contact:document.getElementById('oContact').value.trim(), notes:document.getElementById('oNotes').value.trim(), status:document.getElementById('oStatus').value, date:new Date().toLocaleDateString() }; if(editId){ const idx=orders.findIndex(o=>o.id==editId); if(idx>-1) orders[idx]={...orders[idx],...data}; addActivity(`Updated order for: ${name}`); } else { data.id=Date.now(); orders.push(data); addActivity(`New order added: ${name} — ${data.product}`); } save(KEYS.orders,orders); closeModal('orderModal'); renderOrders(); renderDashStats(); toast(editId?'Order updated!':'Order added!'); }
function deleteOrder(id){ if(!confirm('Delete this order?')) return; save(KEYS.orders,getOrders().filter(o=>o.id!==id)); renderOrders(); renderDashStats(); toast('Order deleted.'); }
function clearAllOrders(){ save(KEYS.orders,[]); renderOrders(); renderDashStats(); toast('All orders cleared.'); }

// Testimonials admin
function renderTestimonialsAdmin(){
  const testis=getTestimonials();
  const grid=document.getElementById('adminTestiGrid');
  if(!grid) return;
  if(!testis.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;">No reviews yet.</div>'; return; }
  grid.innerHTML=testis.map(t=>`<div class="admin-prod-card"><div class="admin-prod-info" style="padding:24px;"><div class="admin-prod-tag">${'★'.repeat(t.stars||5)}</div><div class="admin-prod-name">${t.name}</div><div class="admin-prod-price">${t.loc||''}</div><p style="font-size:.8rem;color:rgba(250,248,245,.5);line-height:1.6;margin:10px 0 16px;font-style:italic;">"${t.text}"</p><div class="admin-prod-actions"><button class="ap-btn ap-edit" onclick="openEditTesti(${t.id})">Edit</button><button class="ap-btn ap-del" onclick="deleteTesti(${t.id})">Delete</button></div></div></div>`).join('');
}
function openAddTestimonial(){ document.getElementById('editTestiId').value=''; ['tName','tLoc','tText'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); const stars=document.getElementById('tStars'); if(stars) stars.value='5'; openModal('testiModal'); }
function openEditTesti(id){ const t=getTestimonials().find(x=>x.id===id); if(!t) return; document.getElementById('editTestiId').value=id; document.getElementById('tName').value=t.name||''; document.getElementById('tLoc').value=t.loc||''; document.getElementById('tText').value=t.text||''; document.getElementById('tStars').value=t.stars||5; openModal('testiModal'); }
function saveTestimonial(){ const name=document.getElementById('tName').value.trim(); const text=document.getElementById('tText').value.trim(); if(!name||!text){ toast('Name and review text required'); return; } const testis=getTestimonials(); const editId=document.getElementById('editTestiId').value; const data={ name, loc:document.getElementById('tLoc').value.trim(), text, stars:parseInt(document.getElementById('tStars').value) }; if(editId){ const idx=testis.findIndex(t=>t.id==editId); if(idx>-1) testis[idx]={...testis[idx],...data}; addActivity(`Updated review: ${name}`); } else { data.id=Date.now(); testis.push(data); addActivity(`Added review: ${name}`); } save(KEYS.testimonials,testis); closeModal('testiModal'); renderTestimonialsAdmin(); renderPublicTestimonials(); toast('Review saved!'); }
function deleteTesti(id){ if(!confirm('Delete this review?')) return; save(KEYS.testimonials,getTestimonials().filter(t=>t.id!==id)); renderTestimonialsAdmin(); renderPublicTestimonials(); toast('Review deleted.'); }

// Dashboard stats
function renderDashStats(){
  const prods=getProducts(); const orders=getOrders(); const testis=getTestimonials(); const active=prods.filter(p=>p.status==='active').length;
  const statsDiv=document.getElementById('dashStats'); if(!statsDiv) return;
  statsDiv.innerHTML=`<div class="dash-stat"><span class="dash-stat-icon">👗</span><div class="dash-stat-val">${prods.length}</div><div class="dash-stat-lbl">Total Products</div></div><div class="dash-stat"><span class="dash-stat-icon">✅</span><div class="dash-stat-val">${active}</div><div class="dash-stat-lbl">Active Products</div></div><div class="dash-stat"><span class="dash-stat-icon">📦</span><div class="dash-stat-val">${orders.length}</div><div class="dash-stat-lbl">Total Orders</div></div><div class="dash-stat"><span class="dash-stat-icon">💬</span><div class="dash-stat-val">${testis.length}</div><div class="dash-stat-lbl">Reviews</div></div>`;
}
function renderActivity(){
  const acts=getActivity(); const feed=document.getElementById('activityFeed'); if(!feed) return;
  if(!acts.length){ feed.innerHTML='<p style="font-size:.8rem;color:rgba(250,248,245,.3);padding:12px 0;">No activity yet.</p>'; return; }
  feed.innerHTML=acts.slice(0,8).map(a=>`<div class="activity-item"><div class="act-dot"></div><div><div class="act-text">${a.msg}</div><div class="act-time">${a.time}</div></div></div>`).join('');
}

// Settings
function loadSettings(){
  const s=getSettings();
  const look=document.getElementById('tog-lookbook'); if(look) look.checked=s.lookbook!==false;
  const test=document.getElementById('tog-testi'); if(test) test.checked=s.testi!==false;
  const wa=document.getElementById('tog-wa'); if(wa) wa.checked=s.wa!==false;
  const eid=document.getElementById('tog-eid'); if(eid) eid.checked=!!s.eid;
  const ps=document.getElementById('paystackKey'); if(ps) ps.value=s.paystackPublicKey||'';
}
function saveSettings(){
  const s={ lookbook:document.getElementById('tog-lookbook')?.checked??true, testi:document.getElementById('tog-testi')?.checked??true, wa:document.getElementById('tog-wa')?.checked??true, eid:document.getElementById('tog-eid')?.checked??false, paystackPublicKey:document.getElementById('paystackKey')?.value||'' };
  save(KEYS.settings,s); toast('Settings saved'); applySettings();
}
function changePassword(){
  const cur=document.getElementById('pwCurrent')?.value; const nw=document.getElementById('pwNew')?.value; const cf=document.getElementById('pwConfirm')?.value; const msg=document.getElementById('pwSaveMsg');
  if(!msg) return;
  if(cur!==getPassword()){ msg.style.display='block'; msg.style.color='#e05050'; msg.textContent='Current password incorrect.'; return; }
  if(nw.length<6){ msg.style.display='block'; msg.style.color='#e05050'; msg.textContent='New password must be 6+ characters.'; return; }
  if(nw!==cf){ msg.style.display='block'; msg.style.color='#e05050'; msg.textContent="Passwords don't match."; return; }
  save(KEYS.password,nw); msg.style.display='block'; msg.style.color='#25d366'; msg.textContent='✓ Password updated successfully';
  ['pwCurrent','pwNew','pwConfirm'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; }); addActivity('Password changed'); setTimeout(()=>msg.style.display='none',3000);
}

// Login/Logout
function doLogin(){ const u=document.getElementById('loginUser')?.value.trim(); const p=document.getElementById('loginPass')?.value; if((u==='noor'||u==='admin'||u==='notnoor')&&p===getPassword()){ sessionStorage.setItem('nn_auth','1'); window.location.href='admin.html'; } else { const err=document.getElementById('loginErr'); if(err) err.style.display='block'; } }
function doLogout(){ sessionStorage.removeItem('nn_auth'); window.location.href='login.html'; }

// ========== CURRENCY ==========
const exchangeRates={ NGN:1, USD:0.00065, GBP:0.00051, EUR:0.00060 };
const currencySymbols={ NGN:'₦', USD:'$', GBP:'£', EUR:'€' };
let currentCurrency='NGN';
function changeCurrency(cur){ currentCurrency=cur; renderPublicProducts(); }
function formatPrice(basePriceNGN){ if(isNaN(basePriceNGN)) return basePriceNGN; const converted=basePriceNGN*exchangeRates[currentCurrency]; return currencySymbols[currentCurrency]+converted.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0}); }
const originalGetProducts=getProducts;
window.getProducts=function(){ let prods=originalGetProducts(); return prods.map(p=>{ if(!p.basePrice){ if(p.price && p.price!=='Contact for pricing' && /\d/.test(p.price)){ let num=parseInt(p.price.replace(/\D/g,'')); p.basePrice=num>0?num:(80000+(p.id*5000)); } else { p.basePrice=80000+(p.id*5000); } } p.price=formatPrice(p.basePrice); return p; }); };

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded',()=>{
  initNavScroll(); initMobileMenu(); observeReveals();
  const page = window.CURRENT_PAGE || 'home';
  if(page==='home'){
    renderPublicProducts(); renderPublicTestimonials(); renderLookbook(); renderSiteContent(); applySettings(); updateAnnBar(getAnnouncement());
    const ann=getAnnouncement(); document.querySelectorAll('#annColorPicker > div').forEach(d=>{ d.dataset.color=d.style.background; d.style.borderColor=d.style.background===ann.color?'white':'transparent'; });
  } else if(page==='admin'){
    if(!sessionStorage.getItem('nn_auth')){ window.location.href='login.html'; return; }
    renderDashStats(); renderAdminProducts(); renderOrders(); renderTestimonialsAdmin(); renderAdminLookbook(); renderAdminSizing(); loadSettings(); renderActivity(); loadAnnouncement();
  } else if(page==='login'){
    // nothing
  } else if(page==='sizing'){
    renderSizingPage(); applySettings(); updateAnnBar(getAnnouncement());
  } else {
    applySettings(); updateAnnBar(getAnnouncement());
  }
});
