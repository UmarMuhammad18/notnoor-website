
// ═══════════════════════════════════════
// DATA STORE (localStorage)
// ═══════════════════════════════════════
const KEYS = { products:'nn_products', orders:'nn_orders', testimonials:'nn_testimonials', lookbook:'nn_lookbook', settings:'nn_settings', announcement:'nn_ann', site:'nn_site', password:'nn_pass', activity:'nn_activity' };

function load(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v));}

function getProducts(){return load(KEYS.products)||defaultProducts();}
function getOrders(){return load(KEYS.orders)||[];}
function getTestimonials(){return load(KEYS.testimonials)||defaultTestis();}
function getLookbook(){return load(KEYS.lookbook)||defaultLookbook();}
function getSettings(){return load(KEYS.settings)||{lookbook:true,testi:true,wa:true,eid:false};}
function getAnnouncement(){return load(KEYS.announcement)||{active:false,text:'',color:'#c9a84c'};}
function getSiteConfig(){return load(KEYS.site)||defaultSiteConfig();}
function getPassword(){return load(KEYS.password)||'notnoor2024';}
function getActivity(){return load(KEYS.activity)||[];}

function addActivity(msg){
  const acts=getActivity();
  acts.unshift({msg,time:new Date().toLocaleString()});
  save(KEYS.activity,acts.slice(0,20));
}

function defaultProducts(){
  return [
    {id:1,name:'The Rose Abaya',tag:'Signature Piece',price:'Contact for pricing',desc:'A soft, flowing silhouette with delicate details. Made to move with you.',badge:'new',sizes:['S','M','L','XL'],color:'g1',img:'',status:'active',waMsg:'Hi I want to order the Rose Abaya'},
    {id:2,name:'Lavender Lace Set',tag:'Limited Edition',price:'Contact for pricing',desc:'Delicate lace detail with a modern silhouette. Elegance in every fold.',badge:'limited',sizes:['S','M','L'],color:'g2',img:'',status:'active',waMsg:'Hi I want to order the Lavender Lace Set'},
    {id:3,name:'Emerald Shimmer Abaya',tag:'Ramadan Collection',price:'Contact for pricing',desc:'Lightweight shimmer fabric perfect for celebrations.',badge:'ramadan',sizes:['M','L','XL','XXL'],color:'g3',img:'',status:'active',waMsg:'Hi I want to order the Emerald Shimmer Abaya'},
    {id:4,name:'Caramel Feather Coat',tag:'Soft Luxury',price:'Contact for pricing',desc:'Luxurious feather trim for the woman who commands presence.',badge:'',sizes:['S','M','L','XL'],color:'g4',img:'',status:'active',waMsg:'Hi I want to order the Caramel Feather Coat'},
    {id:5,name:'Dusty Pink Kaftan',tag:'Bestseller',price:'Contact for pricing',desc:'Our most-loved piece — comforting, graceful, and endlessly wearable.',badge:'bestseller',sizes:['S','M','L','XL','XXL'],color:'g5',img:'',status:'active',waMsg:'Hi I want to order the Dusty Pink Kaftan'},
    {id:6,name:'Midnight Drape Gown',tag:'Custom',price:'Contact for pricing',desc:'A dramatic drape gown for evenings that deserve to be remembered.',badge:'',sizes:['Custom'],color:'g6',img:'',status:'active',waMsg:'Hi I want to order the Midnight Drape Gown'},
  ];
}

function defaultTestis(){
  return [
    {id:1,name:'Fatimah A.',loc:'London, UK 🇬🇧',text:'Absolutely obsessed with my Eid abaya. The quality is beyond anything I expected. Soft, luxurious, and perfectly modest.',stars:5},
    {id:2,name:'Aisha K.',loc:'Lagos, Nigeria 🇳🇬',text:"I sent in my own fabric and the result was breathtaking. She took my vision and transformed it into something I'll cherish forever.",stars:5},
    {id:3,name:'Nadia R.',loc:'Birmingham, UK 🇬🇧',text:"Received my package all the way in Birmingham — the packaging was so beautiful! The feather detail is everything. Ordering again!",stars:5},
  ];
}

function defaultLookbook(){
  return [
    {id:1,title:'The Rose Feather Abaya — Soft luxury',color:'g1',img:''},
    {id:2,title:'Emerald Shimmer Kaftan',color:'g3',img:''},
    {id:3,title:'Caramel Drape Collection',color:'g4',img:''},
    {id:4,title:'Twilight Abaya Series',color:'g2',img:''},
    {id:5,title:'Ramadan Collection',color:'g5',img:''},
    {id:6,title:'N0tN0Or Signature',color:'g6',img:''},
  ];
}

function defaultSiteConfig(){
  return {
    heroBadge:'<span class="hero-badge-dot"></span>Hijabi RTW · Worldwide Delivery 📦',
    heroTitle:'This isn\'t just<br>a <span class="gold">shopping</span><br><span class="italic outline">page.</span>',
    heroSub:'It\'s a space for modest fashion tips, styling ideas, and learning how to wear what you already have beautifully. Fashion is about confidence, creativity, and helping each other feel good.',
    heroBtn1Text:'✦ Explore Collection',
    heroBtn1Link:'#collection-section',
    heroBtn2Text:'How to Order',
    heroBtn2Link:'order-page',
    heroBtn3Text:'💬 WhatsApp',
    heroBtn3Link:'https://wa.me/2348020965505?text=Hi%20I%20want%20to%20order',
    marqueeItems:['Hijabi RTW','Worldwide Delivery','Modest Fashion','Custom Sizing','N0tN0Or','Designed to Shine','Send Your Fabrics','Soft Luxury'],
    aboutQuote:'"Fashion isn\'t only about clothes — it\'s about confidence, creativity, and helping each other feel good in what we wear."',
    aboutAuthor:'— N0tN0Or · @not(noor) 👑',
    aboutTitle:'More than a<br><span class="italic">clothing brand.</span>',
    aboutBody:'N0tN0Or is a Hijabi RTW brand built for the confident, modern Muslim woman. We specialise in beautifully crafted abayas, kaftans and modest wear — with worldwide delivery and the option to send in your own fabrics.',
    aboutPills:['Hijabi RTW','Modest Fashion','Custom Sizing','Worldwide Delivery 📦','Send Your Fabrics','Eid Bookings'],
  };
}

function renderLookbook(){
  const items=getLookbook();
  const grid=document.getElementById('lookbookGrid');
  if(!grid)return;
  if(!items.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(250,248,245,.3);font-size:.85rem;">No lookbook items yet. Add one via the dashboard.</div>';
    return;
  }
  grid.innerHTML=items.map((item,i)=>{
    const bgHTML=item.img?`<img src="${item.img}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;">`:`<div class="lb-bg ${item.color||'g1'}"></div>`;
    return `<div class="lb-item reveal d${(i%4)+1}"><div class="lb-vis">${bgHTML}<div class="lb-shine"></div><div class="lb-cap"><span class="lb-cap-text">${item.title}</span></div></div></div>`;
  }).join('');
  setTimeout(observeReveals,50);
}

// ═══════════════════════════════════════
// PAGE NAVIGATION
// ═══════════════════════════════════════
function nav(id){
    // Mock nav() since we are multipage now
});
  const pg=document.getElementById('page-'+id);
  if(pg){pg.classList.add('active');}
  window.scrollTo(0,0);
  document.querySelectorAll('.nav-links a').forEach(a=>{a.classList.toggle('active-link',a.dataset.page===id);});

  if(id==='admin' || id==='login'){
    if(mainNav) mainNav.style.display='none';
    if(annBar) annBar.style.display='none';
    document.body.classList.remove('ann-visible');
  } else {
    if(mainNav) mainNav.style.display='';
    applySettings();
  }

  if(id==='home'){renderPublicProducts();renderLookbook();renderSiteContent();}
  if(id==='admin'){
    if(!sessionStorage.getItem('nn_auth')){nav('login');return;}
    renderDashStats();renderAdminProducts();renderOrders();renderTestimonials_admin();loadSettings();renderActivity();
  }
  if(id!=='admin' && id!=='login'){setupFooters(id);}
}

function setupFooters(){}
  });
}

// ═══════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════
const revObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on');}),{threshold:.1});
function observeReveals(){document.querySelectorAll('.reveal:not(.on)').forEach(r=>revObs.observe(r));}
observeReveals();

// NAV SCROLL
window.addEventListener('scroll',()=>{
  const n=document.getElementById('mainNav');
  if(window.scrollY>60){n.classList.add('scrolled');}else{n.classList.remove('scrolled');}
});

// MOBILE MENU
document.getElementById('ham').onclick=()=>document.getElementById('mobileMenu').classList.add('open');
document.getElementById('mmClose').onclick=closeMM;
function closeMM(){document.getElementById('mobileMenu').classList.remove('open');}

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
function toast(msg,dur=2800){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),dur);
}

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  if((u==='noor'||u==='admin'||u==='notnoor')&&p===getPassword()){
    sessionStorage.setItem('nn_auth','1');
    document.getElementById('loginErr').style.display='none';
    window.location.href='admin.html';
  }else{
    document.getElementById('loginErr').style.display='block';
  }
}else{
    document.getElementById('loginErr').style.display='block';
  }
}
function doLogout(){
  sessionStorage.removeItem('nn_auth');
  window.location.href='login.html';
}

// ═══════════════════════════════════════
// ADMIN PANEL SWITCH
// ═══════════════════════════════════════
function showPanel(id){
  document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  document.querySelector(`.sb-link[data-panel="${id}"]`).classList.add('active');
  const sel = document.getElementById('adminPanelSelect');
  if(sel) sel.value = id;
  if(id==='products')renderAdminProducts();
  if(id==='lookbook')renderAdminLookbook();
  if(id==='orders')renderOrders();
  if(id==='testimonials')renderTestimonials_admin();
  // if(id==='site')renderSiteEditor(); // disabled while Site Editor is commented out
}

// ═══════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════
function renderDashStats(){
  const prods=getProducts(),orders=getOrders(),testis=getTestimonials();
  const active=prods.filter(p=>p.status==='active').length;
  document.getElementById('dashStats').innerHTML=`
    <div class="dash-stat"><span class="dash-stat-icon">👗</span><div class="dash-stat-val">${prods.length}</div><div class="dash-stat-lbl">Total Products</div></div>
    <div class="dash-stat"><span class="dash-stat-icon">✅</span><div class="dash-stat-val">${active}</div><div class="dash-stat-lbl">Active Products</div></div>
    <div class="dash-stat"><span class="dash-stat-icon">📦</span><div class="dash-stat-val">${orders.length}</div><div class="dash-stat-lbl">Total Orders</div></div>
    <div class="dash-stat"><span class="dash-stat-icon">💬</span><div class="dash-stat-val">${testis.length}</div><div class="dash-stat-lbl">Reviews</div></div>
  `;
}
function renderActivity(){
  const acts=getActivity();
  const feed=document.getElementById('activityFeed');
  if(!acts.length){feed.innerHTML='<p style="font-size:.8rem;color:rgba(250,248,245,.3);padding:12px 0;">No activity yet.</p>';return;}
  feed.innerHTML=acts.slice(0,8).map(a=>`<div class="activity-item"><div class="act-dot"></div><div><div class="act-text">${a.msg}</div><div class="act-time">${a.time}</div></div></div>`).join('');
}

// ═══════════════════════════════════════
// PUBLIC PRODUCT GRID
// ═══════════════════════════════════════
function renderPublicProducts(){
  const prods=getProducts().filter(p=>p.status!=='hidden');
  const grid=document.getElementById('publicProductGrid');
  if(!grid)return;
  if(!prods.length){grid.innerHTML='<div class="no-products">New collection coming soon 🌙</div>';return;}
  grid.innerHTML=prods.map(p=>{
    const badgeHTML=p.badge?`<div class="prod-badge ${p.badge==='sold'?'sold':p.badge==='new'?'new':''}">${p.badge.toUpperCase()}</div>`:'';
    const imgHTML=p.img?`<img src="${p.img}" alt="${p.name}">`:`<div class="prod-visual-placeholder ${p.color||'g1'}" style="height:100%;"></div>`;
    const waLink=`https://wa.me/2348020965505?text=${encodeURIComponent(p.waMsg||'Hi I want to order '+p.name)}`;
    return `<div class="prod-card" onclick="openProductDetail(${p.id})">
      <div class="prod-visual">${imgHTML}<div class="prod-shimmer"></div>${badgeHTML}
        <div class="prod-overlay">
          <div class="prod-tag">${p.tag||''}</div>
          <div class="prod-name">${p.name}</div>
          <div class="prod-desc">${p.desc||''}</div>
          ${p.price?`<div class="prod-price">${p.price}</div>`:''}
          <a class="prod-order-btn" href="${waLink}" target="_blank" onclick="event.stopPropagation()">Order via WhatsApp →</a>
        </div>
      </div>
    </div>`;
  }).join('');
  setTimeout(observeReveals,100);
}

function openProductDetail(id){
  const p=getProducts().find(x=>x.id===id);
  if(!p) return;
  document.getElementById('productDetailTitle').textContent=p.name;
  document.getElementById('productDetailSub').textContent=p.tag?`${p.tag} · ${p.price||''}`:p.price||'';
  const imgContainer=document.getElementById('productDetailImg');
  if(p.img){
    imgContainer.innerHTML=`<img src="${p.img}" style="width:100%;height:100%;object-fit:cover;" alt="${p.name}">`;
  } else {
    imgContainer.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.4rem;color:rgba(250,248,245,.35);background:linear-gradient(135deg,rgba(201,168,76,.1),rgba(0,0,0,.2));">📷</div>`;
  }
  document.getElementById('productDetailDesc').textContent=p.desc||'No description provided.';
  document.getElementById('productDetailDetails').textContent=p.details||'No additional details.';
  const sizesEl=document.getElementById('productDetailSizes');
  sizesEl.innerHTML = (p.sizes||[]).map(s=>`<span style="padding:6px 12px;border:1px solid rgba(201,168,76,.25);border-radius:999px;font-size:.75rem;color:rgba(250,248,245,.7);">${s}</span>`).join('');
  const waLink=`https://wa.me/2348020965505?text=${encodeURIComponent(p.waMsg||'Hi I want to order '+p.name)}`;
  const orderBtn=document.getElementById('productDetailOrder');
  orderBtn.href=waLink;
  openModal('productDetailModal');
}

// ═══════════════════════════════════════
// ADMIN PRODUCTS
// ═══════════════════════════════════════
let _productFilter='',_statusFilter='all';
function renderAdminProducts(){
  let prods=getProducts();
  if(_statusFilter!=='all')prods=prods.filter(p=>p.status===_statusFilter||(_statusFilter==='sold'&&p.badge==='sold'));
  if(_productFilter)prods=prods.filter(p=>p.name.toLowerCase().includes(_productFilter)||p.tag.toLowerCase().includes(_productFilter));
  const grid=document.getElementById('adminProductGrid');
  if(!prods.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(250,248,245,.3);font-size:.85rem;">No products found. <button onclick="openAddProduct()" style="color:var(--gold);background:none;border:none;font-size:.85rem;">Add one +</button></div>';return;}
  grid.innerHTML=prods.map(p=>{
    const imgHTML=p.img?`<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`:`<div class="admin-prod-img-placeholder ${p.color||'g1'}">👗</div>`;
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
function filterProducts(v){_productFilter=v.toLowerCase();renderAdminProducts();}
function filterProductsByStatus(v){_statusFilter=v;renderAdminProducts();}
function deleteProduct(id){
  if(!confirm('Delete this product?'))return;
  const prods=getProducts().filter(p=>p.id!==id);
  save(KEYS.products,prods);
  addActivity(`Deleted product #${id}`);
  renderAdminProducts();renderDashStats();renderPublicProducts();
  toast('Product deleted.');
}
function toggleProductStatus(id){
  const prods=getProducts();
  const p=prods.find(x=>x.id===id);
  if(!p)return;
  p.status=p.status==='active'?'hidden':'active';
  save(KEYS.products,prods);
  addActivity(`${p.status==='active'?'Showed':'Hid'} product: ${p.name}`);
  renderAdminProducts();renderPublicProducts();
  toast(`Product ${p.status==='active'?'now visible':'now hidden'}.`);
}
function clearAllProducts(){save(KEYS.products,[]);renderAdminProducts();renderDashStats();renderPublicProducts();toast('All products cleared.');}

// ═══════════════════════════════════════
// LOOKBOOK ADMIN
// ═══════════════════════════════════════
let _editingLookbookId=null,_selectedLbColor='g1';
function renderAdminLookbook(){
  const items=getLookbook();
  const grid=document.getElementById('adminLookbookGrid');
  if(!grid)return;
  if(!items.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(250,248,245,.3);font-size:.85rem;">No lookbook items yet. <button onclick="openAddLookbookItem()" style="color:var(--gold);background:none;border:none;font-size:.85rem;">Add one +</button></div>';
    return;
  }
  grid.innerHTML=items.map(item=>`<div class="admin-prod-card">
      <div class="admin-prod-img"><div class="admin-prod-img-placeholder ${item.color||'g1'}">📷</div></div>
      <div class="admin-prod-info">
        <div class="admin-prod-name">${item.title}</div>
        <div class="admin-prod-actions">
          <button class="ap-btn ap-edit" onclick="openEditLookbookItem(${item.id})">Edit</button>
          <button class="ap-btn ap-del" onclick="deleteLookbookItem(${item.id})">Del</button>
        </div>
      </div>
    </div>`).join('');
}
function openAddLookbookItem(){
  _editingLookbookId=null;_selectedLbColor='g1';
  document.getElementById('lookbookModalTitle').textContent='Add Lookbook Item';
  document.getElementById('editLookbookId').value='';
  document.getElementById('lbTitle').value='';
  document.getElementById('lbImgPreview').style.display='none';
  document.getElementById('lbImgPreview').src='';
  document.getElementById('lbImgFileInput').value='';
  document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.remove('selected'));
  document.querySelector('#lbColorSwatches .color-chip[data-val="g1"]').classList.add('selected');
  openModal('lookbookModal');
}
function openEditLookbookItem(id){
  const item=getLookbook().find(x=>x.id===id);if(!item)return;
  _editingLookbookId=id;_selectedLbColor=item.color||'g1';
  document.getElementById('lookbookModalTitle').textContent='Edit Lookbook Item';
  document.getElementById('editLookbookId').value=id;
  document.getElementById('lbTitle').value=item.title||'';
  document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.toggle('selected',c.dataset.val===_selectedLbColor));
  if(item.img){
    document.getElementById('lbImgPreview').src=item.img;
    document.getElementById('lbImgPreview').style.display='block';
  } else {
    document.getElementById('lbImgPreview').style.display='none';
    document.getElementById('lbImgPreview').src='';
  }
  document.getElementById('lbImgFileInput').value='';
  openModal('lookbookModal');
}
function saveLookbookItem(){
  const title=document.getElementById('lbTitle').value.trim();
  if(!title){toast('Caption is required.');return;}
  const items=getLookbook();
  const imgSrc=document.getElementById('lbImgPreview').src;
  const hasImg=document.getElementById('lbImgPreview').style.display!=='none'&&imgSrc;
  const data={title,color:_selectedLbColor,img:hasImg?imgSrc:''};
  if(_editingLookbookId){
    const idx=items.findIndex(i=>i.id===_editingLookbookId);
    if(idx>-1){items[idx]={...items[idx],...data};}
    addActivity(`Updated lookbook item: ${title}`);
  } else {
    data.id=Date.now();
    items.push(data);
    addActivity(`Added lookbook item: ${title}`);
  }
  save(KEYS.lookbook,items);
  closeModal('lookbookModal');
  renderAdminLookbook();
  renderLookbook();
  toast(_editingLookbookId?'Updated!':'Added!');
}
function deleteLookbookItem(id){
  if(!confirm('Delete this lookbook item?'))return;
  const items=getLookbook().filter(i=>i.id!==id);
  save(KEYS.lookbook,items);
  renderAdminLookbook();
  renderLookbook();
  toast('Item deleted.');
}
function selectLbColor(el,val){_selectedLbColor=val;document.querySelectorAll('#lbColorSwatches .color-chip').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');}

// ═══════════════════════════════════════
// PRODUCT MODAL
// ═══════════════════════════════════════
let _editingProductId=null,_selectedColor='g1',_selectedSizes=[];
function openAddProduct(){
  _editingProductId=null;_selectedColor='g1';_selectedSizes=[];
  document.getElementById('productModalTitle').textContent='Add Product';
  document.getElementById('editProductId').value='';
  ['pName','pTag','pPrice','pDesc','pWAMsg'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('pBadge').value='';
  document.getElementById('pStatus').value='active';
  document.getElementById('pWAMsg').value='';
  document.getElementById('pDetails').value='';
  document.getElementById('imgPreview').style.display='none';
  document.getElementById('imgPreview').src='';
  document.querySelectorAll('.size-chip').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('selected'));
  document.querySelector('.color-chip[data-val="g1"]').classList.add('selected');
  openModal('productModal');
}
function openEditProduct(id){
  const p=getProducts().find(x=>x.id===id);
  if(!p)return;
  _editingProductId=id;_selectedColor=p.color||'g1';_selectedSizes=[...(p.sizes||[])];
  document.getElementById('productModalTitle').textContent='Edit Product';
  document.getElementById('pName').value=p.name||'';
  document.getElementById('pTag').value=p.tag||'';
  document.getElementById('pPrice').value=p.price||'';
  document.getElementById('pDesc').value=p.desc||'';
  document.getElementById('pDetails').value=p.details||'';
  document.getElementById('pBadge').value=p.badge||'';
  document.getElementById('pStatus').value=p.status||'active';
  document.getElementById('pWAMsg').value=p.waMsg||'';
  if(p.img){document.getElementById('imgPreview').src=p.img;document.getElementById('imgPreview').style.display='block';}else{document.getElementById('imgPreview').style.display='none';}
  document.querySelectorAll('.size-chip').forEach(c=>{c.classList.toggle('selected',_selectedSizes.includes(c.dataset.val));});
  document.querySelectorAll('.color-chip').forEach(c=>{c.classList.toggle('selected',c.dataset.val===_selectedColor);});
  openModal('productModal');
}
function saveProduct(){
  const name=document.getElementById('pName').value.trim();
  if(!name){toast('Product name is required.');return;}
  const prods=getProducts();
  const imgSrc=document.getElementById('imgPreview').src;
  const hasImg=document.getElementById('imgPreview').style.display!=='none'&&imgSrc&&!imgSrc.endsWith('n0tn0or_full.html');
  const data={
    name,tag:document.getElementById('pTag').value.trim(),
    price:document.getElementById('pPrice').value.trim(),
    desc:document.getElementById('pDesc').value.trim(),
    details:document.getElementById('pDetails').value.trim(),
    badge:document.getElementById('pBadge').value,
    sizes:_selectedSizes,color:_selectedColor,
    img:hasImg?imgSrc:'',
    status:document.getElementById('pStatus').value,
    waMsg:document.getElementById('pWAMsg').value.trim()||'Hi I want to order '+name
  };
  if(_editingProductId){
    const idx=prods.findIndex(p=>p.id===_editingProductId);
    if(idx>-1){prods[idx]={...prods[idx],...data};}
    addActivity(`Updated product: ${name}`);
  }else{
    data.id=Date.now();
    prods.push(data);
    addActivity(`Added new product: ${name}`);
  }
  save(KEYS.products,prods);
  closeModal('productModal');
  renderAdminProducts();renderDashStats();renderPublicProducts();
  toast(_editingProductId?'Product updated! ✦':'Product added! ✦');
}
function toggleSizeChip(el){el.classList.toggle('selected');_selectedSizes=Array.from(document.querySelectorAll('.size-chip.selected')).map(c=>c.dataset.val);}
function selectColor(el,val){_selectedColor=val;document.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');}
function handleImageUpload(input){
  const file=input.files[0];if(!file)return;
  if(file.size>5*1024*1024){toast('Image too large (max 5MB)');return;}
  const reader=new FileReader();
  reader.onload=e=>{const prev=document.getElementById('imgPreview');prev.src=e.target.result;prev.style.display='block';};
  reader.readAsDataURL(file);
}
function handleLookbookUpload(input){
  const file=input.files[0];if(!file)return;
  if(file.size>5*1024*1024){toast('Image too large (max 5MB)');return;}
  const reader=new FileReader();
  reader.onload=e=>{const prev=document.getElementById('lbImgPreview');prev.src=e.target.result;prev.style.display='block';};
  reader.readAsDataURL(file);
}

// ═══════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════
function renderOrders(){
  const orders=getOrders();
  const tbody=document.getElementById('ordersTbody');
  if(!orders.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;padding:40px;color:rgba(250,248,245,.3);">No orders yet.</td></tr>';return;}
  const statusMap={pending:'status-pending',confirmed:'status-confirmed',shipped:'status-shipped',delivered:'status-delivered',cancelled:'status-cancelled'};
  tbody.innerHTML=[...orders].reverse().map(o=>`<tr>
    <td style="color:var(--gold);">#${o.id}</td>
    <td>${o.name}</td>
    <td>${o.product}</td>
    <td>${o.country||'—'}</td>
    <td><span class="order-status ${statusMap[o.status]||'status-pending'}">${o.status}</span></td>
    <td>${o.date||'—'}</td>
    <td>
      <button class="order-action-btn" onclick="openEditOrder(${o.id})">Edit</button>
      <button class="order-action-btn" style="border-color:rgba(224,80,80,.3);color:#e05050;" onclick="deleteOrder(${o.id})">Del</button>
    </td>
  </tr>`).join('');
}
function openAddOrder(){
  document.getElementById('editOrderId').value='';
  ['oName','oCountry','oProd','oContact','oNotes'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('oStatus').value='pending';
  openModal('orderModal');
}
function openEditOrder(id){
  const o=getOrders().find(x=>x.id===id);if(!o)return;
  document.getElementById('editOrderId').value=id;
  document.getElementById('oName').value=o.name||'';
  document.getElementById('oCountry').value=o.country||'';
  document.getElementById('oProd').value=o.product||'';
  document.getElementById('oContact').value=o.contact||'';
  document.getElementById('oNotes').value=o.notes||'';
  document.getElementById('oStatus').value=o.status||'pending';
  openModal('orderModal');
}
function saveOrder(){
  const name=document.getElementById('oName').value.trim();
  if(!name){toast('Customer name required');return;}
  const orders=getOrders();
  const editId=document.getElementById('editOrderId').value;
  const data={name,country:document.getElementById('oCountry').value.trim(),product:document.getElementById('oProd').value.trim(),contact:document.getElementById('oContact').value.trim(),notes:document.getElementById('oNotes').value.trim(),status:document.getElementById('oStatus').value,date:new Date().toLocaleDateString()};
  if(editId){
    const idx=orders.findIndex(o=>o.id==editId);
    if(idx>-1)orders[idx]={...orders[idx],...data};
    addActivity(`Updated order for: ${name}`);
  }else{
    data.id=Date.now();orders.push(data);
    addActivity(`New order added: ${name} — ${data.product}`);
  }
  save(KEYS.orders,orders);
  closeModal('orderModal');renderOrders();renderDashStats();
  toast(editId?'Order updated!':'Order added!');
}
function deleteOrder(id){
  if(!confirm('Delete this order?'))return;
  save(KEYS.orders,getOrders().filter(o=>o.id!==id));
  renderOrders();renderDashStats();toast('Order deleted.');
}
function clearAllOrders(){save(KEYS.orders,[]);renderOrders();renderDashStats();toast('All orders cleared.');}

// ═══════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════
function renderTestimonials_admin(){
  const testis=getTestimonials();
  const grid=document.getElementById('adminTestiGrid');
  if(!testis.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:rgba(250,248,245,.3);">No reviews yet.</div>';return;}
  grid.innerHTML=testis.map(t=>`<div class="admin-prod-card">
    <div class="admin-prod-info" style="padding:24px;">
      <div class="admin-prod-tag">${'★'.repeat(t.stars||5)}</div>
      <div class="admin-prod-name">${t.name}</div>
      <div class="admin-prod-price">${t.loc||''}</div>
      <p style="font-size:.8rem;color:rgba(250,248,245,.5);line-height:1.6;margin:10px 0 16px;font-style:italic;">"${t.text}"</p>
      <div class="admin-prod-actions">
        <button class="ap-btn ap-edit" onclick="openEditTesti(${t.id})">Edit</button>
        <button class="ap-btn ap-del" onclick="deleteTesti(${t.id})">Delete</button>
      </div>
    </div>
  </div>`).join('');
}
function openAddTestimonial(){
  document.getElementById('editTestiId').value='';
  ['tName','tLoc','tText'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('tStars').value='5';
  openModal('testiModal');
}
function openEditTesti(id){
  const t=getTestimonials().find(x=>x.id===id);if(!t)return;
  document.getElementById('editTestiId').value=id;
  document.getElementById('tName').value=t.name||'';
  document.getElementById('tLoc').value=t.loc||'';
  document.getElementById('tText').value=t.text||'';
  document.getElementById('tStars').value=t.stars||5;
  openModal('testiModal');
}
function saveTestimonial(){
  const name=document.getElementById('tName').value.trim(),text=document.getElementById('tText').value.trim();
  if(!name||!text){toast('Name and review text required');return;}
  const testis=getTestimonials();
  const editId=document.getElementById('editTestiId').value;
  const data={name,loc:document.getElementById('tLoc').value.trim(),text,stars:parseInt(document.getElementById('tStars').value)};
  if(editId){const idx=testis.findIndex(t=>t.id==editId);if(idx>-1)testis[idx]={...testis[idx],...data};addActivity(`Updated review: ${name}`);}
  else{data.id=Date.now();testis.push(data);addActivity(`Added review: ${name}`);}
  save(KEYS.testimonials,testis);
  closeModal('testiModal');renderTestimonials_admin();renderPublicTestimonials();
  toast('Review saved!');
}
function deleteTesti(id){
  if(!confirm('Delete this review?'))return;
  save(KEYS.testimonials,getTestimonials().filter(t=>t.id!==id));
  renderTestimonials_admin();renderPublicTestimonials();toast('Review deleted.');
}
function renderPublicTestimonials(){
  const testis=getTestimonials();
  const grid=document.getElementById('testimonialGrid');
  if(!grid)return;
  grid.innerHTML=testis.map((t,i)=>`<div class="testi-card reveal d${i+1}">
    <div class="testi-mark">"</div>
    <div class="testi-top"><div class="testi-avatar">${t.name[0]}</div><div><div class="testi-name">${t.name}</div><div class="testi-loc">${t.loc||''}</div></div></div>
    <div class="testi-stars">${'★'.repeat(t.stars||5)}</div>
    <p class="testi-text">${t.text}</p>
  </div>`).join('');
  setTimeout(observeReveals,100);
}

// ═══════════════════════════════════════
// ANNOUNCEMENT
// ═══════════════════════════════════════
function loadAnnouncement(){
  const ann=getAnnouncement();
  document.getElementById('annToggle').checked=ann.active;
  document.getElementById('annText').value=ann.text||'';
  updateAnnBar(ann);
}
function saveAnnouncement(){
  const ann={active:document.getElementById('annToggle').checked,text:document.getElementById('annText').value,color:getAnnouncement().color||'#c9a84c'};
  save(KEYS.announcement,ann);
  updateAnnBar(ann);
  const msg=document.getElementById('annSaveMsg');msg.style.display='block';setTimeout(()=>msg.style.display='none',2000);
}
function setAnnColor(c){
  const ann=getAnnouncement();ann.color=c;save(KEYS.announcement,ann);
  document.querySelectorAll('#annColorPicker > div').forEach(d=>{d.style.borderColor=d.dataset.color===c?'var(--white)':'transparent';});
  updateAnnBar(ann);
}
function updateAnnBar(ann){
  const bar=document.getElementById('annBar');
  if(ann.active&&ann.text){
    bar.style.display='block';
    bar.textContent=ann.text;
    bar.style.background=ann.color||'#c9a84c';
    bar.style.color=ann.color==='#111'?'var(--white)':'var(--black)';
    document.body.classList.add('ann-visible');
  } else {
    bar.style.display='none';
    document.body.classList.remove('ann-visible');
  }
}

// ═══════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════
function loadSettings(){
  const s=getSettings();
  document.getElementById('tog-lookbook').checked=s.lookbook!==false;
  document.getElementById('tog-testi').checked=s.testi!==false;
  document.getElementById('tog-wa').checked=s.wa!==false;
  document.getElementById('tog-eid').checked=!!s.eid;
}
function saveSettings(){
  const s={lookbook:document.getElementById('tog-lookbook').checked,testi:document.getElementById('tog-testi').checked,wa:document.getElementById('tog-wa').checked,eid:document.getElementById('tog-eid').checked};
  save(KEYS.settings,s);
  const msg=document.getElementById('settingsSaveMsg');msg.style.display='block';setTimeout(()=>msg.style.display='none',2000);
  applySettings();
}
function applySettings(){
  const s=getSettings();
  const lb=document.getElementById('lookbook-section');
  const tg=document.getElementById('testimonialGrid')?.closest('section');
  const wa=document.querySelector('.wa-float');
  if(lb)lb.style.display=s.lookbook===false?'none':'';
  if(tg)tg.style.display=s.testi===false?'none':'';
  if(wa)wa.style.display=s.wa===false?'none':'';
  updateAnnBar(getAnnouncement());
  renderSiteContent();
}

function renderSiteContent(){
  const cfg=getSiteConfig();
  const badge=document.getElementById('heroBadge');
  if(badge)badge.innerHTML=cfg.heroBadge||'';
  const title=document.getElementById('heroTitle');
  if(title)title.innerHTML=cfg.heroTitle||'';
  const sub=document.getElementById('heroSub');
  if(sub)sub.textContent=cfg.heroSub||'';
  const btn1=document.getElementById('heroBtn1');
  if(btn1){btn1.textContent=cfg.heroBtn1Text||'';btn1.dataset.link=cfg.heroBtn1Link||'';}
  const btn2=document.getElementById('heroBtn2');
  if(btn2){btn2.textContent=cfg.heroBtn2Text||'';btn2.dataset.link=cfg.heroBtn2Link||'';}
  const btn3=document.getElementById('heroBtn3');
  if(btn3){btn3.textContent=cfg.heroBtn3Text||'';btn3.dataset.link=cfg.heroBtn3Link||'';}
  const track=document.getElementById('marqueeTrack');
  if(track){
    track.innerHTML=(cfg.marqueeItems||[]).map(item=>`<span class="marquee-item">${item} <span>✦</span></span>`).join('');
  }
  const quote=document.getElementById('aboutQuote');
  if(quote)quote.textContent=cfg.aboutQuote||'';
  const author=document.getElementById('aboutAuthor');
  if(author)author.textContent=cfg.aboutAuthor||'';
  const aboutTitle=document.getElementById('aboutTitle');
  if(aboutTitle)aboutTitle.innerHTML=cfg.aboutTitle||'';
  const aboutBody=document.getElementById('aboutBody');
  if(aboutBody)aboutBody.textContent=cfg.aboutBody||'';
  const pills=document.getElementById('aboutPills');
  if(pills){
    pills.innerHTML=(cfg.aboutPills||[]).map(p=>`<span class="pill">${p}</span>`).join('');
  }
}

function heroButtonClick(idx){
  const cfg=getSiteConfig();
  const link=idx===1?cfg.heroBtn1Link:idx===2?cfg.heroBtn2Link:cfg.heroBtn3Link;
  if(!link)return;
  if(link.startsWith('#')){
    const el=document.querySelector(link);
    if(el){el.scrollIntoView({behavior:'smooth'});return;}
  }
  if(['home','order-page','sizing','delivery','contact','admin','login'].includes(link)){
    nav(link);
    return;
  }
  if(link.startsWith('http'))window.open(link,'_blank');
  else window.open(link,'_blank');
}

function renderSiteEditor(){
  const cfg=getSiteConfig();
  const set=document.getElementById.bind(document);
  set('siteHeroBadge').value=cfg.heroBadge||'';
  set('siteHeroTitle').value=cfg.heroTitle||'';
  set('siteHeroSub').value=cfg.heroSub||'';
  set('siteHeroBtn1Text').value=cfg.heroBtn1Text||'';
  set('siteHeroBtn1Link').value=cfg.heroBtn1Link||'';
  set('siteHeroBtn2Text').value=cfg.heroBtn2Text||'';
  set('siteHeroBtn2Link').value=cfg.heroBtn2Link||'';
  set('siteHeroBtn3Text').value=cfg.heroBtn3Text||'';
  set('siteHeroBtn3Link').value=cfg.heroBtn3Link||'';
  set('siteMarqueeItems').value=(cfg.marqueeItems||[]).join(', ');
  set('siteAboutQuote').value=cfg.aboutQuote||'';
  set('siteAboutAuthor').value=cfg.aboutAuthor||'';
  set('siteAboutTitle').value=cfg.aboutTitle||'';
  set('siteAboutBody').value=cfg.aboutBody||'';
  set('siteAboutPills').value=(cfg.aboutPills||[]).join(', ');
}

function saveSiteConfig(){
  const cfg=getSiteConfig();
  const get=document.getElementById.bind(document);
  cfg.heroBadge=get('siteHeroBadge').value;
  cfg.heroTitle=get('siteHeroTitle').value;
  cfg.heroSub=get('siteHeroSub').value;
  cfg.heroBtn1Text=get('siteHeroBtn1Text').value;
  cfg.heroBtn1Link=get('siteHeroBtn1Link').value;
  cfg.heroBtn2Text=get('siteHeroBtn2Text').value;
  cfg.heroBtn2Link=get('siteHeroBtn2Link').value;
  cfg.heroBtn3Text=get('siteHeroBtn3Text').value;
  cfg.heroBtn3Link=get('siteHeroBtn3Link').value;
  cfg.marqueeItems=get('siteMarqueeItems').value.split(',').map(s=>s.trim()).filter(Boolean);
  cfg.aboutQuote=get('siteAboutQuote').value;
  cfg.aboutAuthor=get('siteAboutAuthor').value;
  cfg.aboutTitle=get('siteAboutTitle').value;
  cfg.aboutBody=get('siteAboutBody').value;
  cfg.aboutPills=get('siteAboutPills').value.split(',').map(s=>s.trim()).filter(Boolean);
  save(KEYS.site,cfg);
  renderSiteContent();
  addActivity('Updated site content');
  const msg=document.getElementById('siteSaveMsg');
  msg.style.display='block';
  setTimeout(()=>msg.style.display='none',2500);
}

function changePassword(){
  const cur=document.getElementById('pwCurrent').value;
  const nw=document.getElementById('pwNew').value;
  const cf=document.getElementById('pwConfirm').value;
  const msg=document.getElementById('pwSaveMsg');
  if(cur!==getPassword()){msg.style.display='block';msg.style.color='#e05050';msg.textContent='Current password incorrect.';return;}
  if(nw.length<6){msg.style.display='block';msg.style.color='#e05050';msg.textContent='New password must be 6+ characters.';return;}
  if(nw!==cf){msg.style.display='block';msg.style.color='#e05050';msg.textContent="Passwords don't match.";return;}
  save(KEYS.password,nw);
  msg.style.display='block';msg.style.color='#25d366';msg.textContent='✓ Password updated successfully';
  ['pwCurrent','pwNew','pwConfirm'].forEach(id=>document.getElementById(id).value='');
  addActivity('Password changed');
  setTimeout(()=>msg.style.display='none',3000);
}

// ═══════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});

// ═══════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════
function submitContactForm(){
  const name=document.getElementById('cf-name').value.trim();
  const subj=document.getElementById('cf-subject').value;
  const msg=document.getElementById('cf-msg').value.trim();
  if(!name||!msg){toast('Please fill in name and message');return;}
  const waText=`Hi, my name is ${name}. Subject: ${subj||'General enquiry'}. Message: ${msg}`;
  window.open(`https://wa.me/2348020965505?text=${encodeURIComponent(waText)}`,'_blank');
  document.getElementById('formSuccess').style.display='block';
  document.getElementById('cf-name').value='';document.getElementById('cf-subject').value='';document.getElementById('cf-msg').value='';
  setTimeout(()=>document.getElementById('formSuccess').style.display='none',4000);
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

  renderPublicProducts();
  renderPublicTestimonials();
  applySettings();
  renderLookbook();
  renderSiteContent();
  renderPublicTestimonials();
  applySettings();
  updateAnnBar(getAnnouncement());
  // Init announcement color picker
  const ann=getAnnouncement();
  document.querySelectorAll('#annColorPicker > div').forEach(d=>{
    d.dataset.color=d.style.background;
    d.style.borderColor=d.style.background===ann.color?'var(--white)':'transparent';
  });

// ═══════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════
function subscribeNewsletter(){
  const email = document.getElementById('newsletterEmail').value.trim();
  if(!email || !email.includes('@')){ toast('Please enter a valid email.'); return; }
  document.getElementById('newsletterSuccess').style.display = 'block';
  document.getElementById('newsletterEmail').value = '';
  setTimeout(() => document.getElementById('newsletterSuccess').style.display='none', 4000);
}

// ═══════════════════════════════════════
// CURRENCY LOGIC
// ═══════════════════════════════════════
const exchangeRates = { NGN: 1, USD: 0.00065, GBP: 0.00051, EUR: 0.00060 };
const currencySymbols = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
let currentCurrency = 'NGN';

function changeCurrency(cur) {
  currentCurrency = cur;
  renderPublicProducts();
}

function formatPrice(basePriceNGN) {
  if(isNaN(basePriceNGN)) return basePriceNGN;
  const converted = basePriceNGN * exchangeRates[currentCurrency];
  return currencySymbols[currentCurrency] + converted.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
}

// Intercept getProducts to assign base prices so currency converter actually does something
const oldGetProducts = getProducts;
getProducts = function() {
  let prods = oldGetProducts();
  return prods.map(p => {
    if(!p.basePrice) {
      if(p.price && p.price !== 'Contact for pricing' && /\d/.test(p.price)) {
        let num = parseInt(p.price.replace(/\D/g, ''));
        p.basePrice = num > 0 ? num : (80000 + (p.id * 5000));
      } else {
        p.basePrice = 80000 + (p.id * 5000); 
      }
    }
    p.price = formatPrice(p.basePrice);
    return p;
  });
};
// Trigger re-render to apply new prices
})();

document.addEventListener('DOMContentLoaded', function() {
  const p = window.CURRENT_PAGE || 'home';
  
  if(p==='home'){ if(typeof renderPublicProducts==='function') renderPublicProducts(); if(typeof renderLookbook==='function') renderLookbook(); if(typeof renderSiteContent==='function') renderSiteContent(); }
  if(p==='admin'){
    if(!sessionStorage.getItem('nn_auth')){ window.location.href='login.html'; return; }
    if(typeof renderDashStats==='function') renderDashStats();
    if(typeof renderAdminProducts==='function') renderAdminProducts();
    if(typeof renderOrders==='function') renderOrders();
    if(typeof renderTestimonials_admin==='function') renderTestimonials_admin();
    if(typeof loadSettings==='function') loadSettings();
    if(typeof renderActivity==='function') renderActivity();
    if(typeof loadAnnouncement==='function') loadAnnouncement();
  }
  
  if(p!=='admin' && p!=='login'){
      if(typeof applySettings==='function') applySettings();
  }
  
  // Setup active links
  document.querySelectorAll('.nav-links a').forEach(a=>{
      const href = a.getAttribute('href');
      if(href && window.location.pathname.endsWith(href.replace('#',''))) { a.classList.add('active-link'); }
  });
});
