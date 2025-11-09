
// ==== products data =====
const products = [
  {id:1,title:'Blue Denim Jacket',category:'clothing',price:999,brand:'Deniz',rating:4.5,tag:'New',img:'images/Denim Jacket.png'},
  {id:2,title:'Running Shoes',category:'footwear',price:1999,brand:'Shoz',rating:4.2,tag:'Hot',img:'images/Running Shoes.png'},
  {id:3,title:'Shined Bracelet',category:'accessories',price:299,brand:'Shinz',rating:4.0,tag:'Trending',img:'images/Shining Bracelet.png'},
  {id:4,title:'Wireless Headphones',category:'electronics',price:3999,brand:'Audioz',rating:4.7,tag:'Deal',img:'images/Wireless Headphones.png'},
  {id:5,title:'Lipstick Set',category:'beauty',price:599,brand:'Glamz',rating:4.1,tag:'New',img:'images/Lipstick Set.png'},
  {id:6,title:'Casual Sneakers',category:'footwear',price:1999,brand:'Shoz',rating:4.3,tag:'Hot',img:'images/Casual Sneakers.png'},
  {id:7,title:'Formal Shirt',category:'clothing',price:899,brand:'Shirz',rating:4.0,tag:'Classic',img:'images/Formal Shirt.png'},
  {id:8,title:'Smart Watch',category:'electronics',price:3999,brand:'Waz',rating:4.4,tag:'Deal',img:'images/Smart Watch.png'},
  {id:9,title:'Sunglasses',category:'accessories',price:299,brand:'Glaz',rating:4.2,tag:'Trending',img:'images/Sunglasses.png'},
  {id:10,title:'Face Serum',category:'beauty',price:399,brand:'Facz',rating:4.6,tag:'New',img:'images/Face Serum.png'},
  {id:11,title:'Formal Trouser',category:'clothing',price:999,brand:'Troz',rating:4.0,tag:'Classic',img:'images/Formal Trouser.png'},
  {id:12,title:'SmartPhone',category:'electronics',price:29999,brand:'Phonez',rating:4.4,tag:'Deal',img:'images/SmartPhone.png'},
  {id:13,title:'Shampoo',category:'beauty',price:299,brand:'smaz',rating:4.6,tag:'New',img:'images/Shampoo.png'},
  {id:14,title:'Tshirt',category:'clothing',price:499,brand:'tsrz',rating:4.6,tag:'Hot',img:'images/Tshirt.png'},
  {id:15,title:'Laptop',category:'electronics',price:59999,brand:'laptz',rating:4.9,tag:'Deal',img:'images/Laptop.png'},
  {id:16,title:'Black Cap',category:'accessories',price:349,brand:'capz',rating:4.6,tag:'Classic',img:'images/Black Cap.png'},
  {id:17,title:'Men Short',category:'clothing',price:499,brand:'shorz',rating:4.5,tag:'New',img:'images/Men Short.png'},
  {id:18,title:'Men Flipflops',category:'footwear',price:399,brand:'Shoz',rating:4.0,tag:'Hot',img:'images/Men Flipflops.png'}
];

// ===== state and persistence =====
let state = {
  query:'',
  category:'all',
  sort:'relevance',
  wishlist: JSON.parse(localStorage.getItem('ms_wishlist')||'[]'),
  cart: JSON.parse(localStorage.getItem('ms_cart')||'[]'),
  orders: JSON.parse(localStorage.getItem('ms_orders')||'[]'),
};

// ===== helpers =====
const formatR = v => '₹' + v.toLocaleString('en-IN');
function save(){ localStorage.setItem('ms_wishlist', JSON.stringify(state.wishlist)); localStorage.setItem('ms_cart', JSON.stringify(state.cart)); localStorage.setItem('ms_orders', JSON.stringify(state.orders)); }

// ===== UI references =====
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('search');
const categoryBar = document.getElementById('categoryBar');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sort');
const cartCount = document.getElementById('cartCount');
const floatingCount = document.getElementById('floatingCount');

// ===== build category list =====n
const categories = ['all',...Array.from(new Set(products.map(p=>p.category)))];
function renderCategories(){
  categoryBar.innerHTML=''; categorySelect.innerHTML='';
  categories.forEach(c=>{
    const btn = document.createElement('button'); btn.textContent = c=== 'all'? 'All' : c[0].toUpperCase()+c.slice(1);
    btn.classList.toggle('active', c===state.category);
    btn.onclick = ()=>{state.category=c; render();}
    categoryBar.appendChild(btn);
    const opt = document.createElement('option'); opt.value=c; opt.textContent = c=== 'all'? 'All categories' : c[0].toUpperCase()+c.slice(1); categorySelect.appendChild(opt);
  })
}

// ===== render products =====
function getFiltered(){
  const q = state.query.trim().toLowerCase();
  let list = products.filter(p=> (state.category==='all' || p.category===state.category) && (p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) );
  if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(state.sort==='newest') list = list.slice().reverse();
  return list;
}

function render(){
  renderCategories();
  categorySelect.value = state.category;
  sortSelect.value = state.sort;
  searchInput.value = state.query;

  const list = getFiltered();
  productsGrid.innerHTML = '';
  list.forEach(p=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `
      <div class="img-wrap"><img src="${p.img}" alt="${p.title}"></div>
      <div class="badge">${p.tag}</div>
      <button class="fav" data-id="${p.id}">${state.wishlist.includes(p.id)?'❤️':'💙'}</button>
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="muted small">${p.brand} · ${p.category}</div>
        <div class="price-row"><div class="price">${formatR(p.price)}</div><div class="muted small">· ${p.rating} ★</div></div>
        <div class="actions">
          <button class="btn ghost" data-id="${p.id}">View</button>
          <button class="btn primary" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(div);
  });
  // attach handlers
  document.querySelectorAll('.card .fav').forEach(b=>b.onclick = (e)=>{ const id=+b.dataset.id; toggleWishlist(id); b.textContent = state.wishlist.includes(id)?'❤️':'💙'; updateCounts(); });
  document.querySelectorAll('.card .btn.ghost').forEach(b=>b.onclick = ()=>{ const id=+b.dataset.id; openProduct(id); });
  document.querySelectorAll('.card .btn.primary').forEach(b=>b.onclick = ()=>{ const id=+b.dataset.id; addToCart(id); });
  updateCounts();
}

// ===== interactions =====
function toggleWishlist(id){ if(state.wishlist.includes(id)) state.wishlist = state.wishlist.filter(x=>x!==id); else state.wishlist.push(id); save(); }
function addToCart(id){ const item = products.find(p=>p.id===id); const existing = state.cart.find(c=>c.id===id); if(existing) existing.qty++; else state.cart.push({id,qty:1,price:item.price,title:item.title}); save(); render(); openCart(); }

function updateCounts(){ cartCount.textContent = state.cart.reduce((s,i)=>s+i.qty,0); floatingCount.textContent = cartCount.textContent || '0'; }

function openProduct(id){ const p = products.find(x=>x.id===id); showModal(`<h3>${p.title}</h3><div style="display:flex;gap:12px"><img src="${p.img}" style="width:180px;border-radius:8px"/><div><p class="muted">${p.brand} · ${p.category}</p><p class="price">${formatR(p.price)}</p><p class="small">Rating: ${p.rating} ★</p><p style="margin-top:12px"><button class="btn primary" id="modalAdd">Add to cart</button> <button class="btn ghost" id="modalWish">${state.wishlist.includes(p.id)?'Remove wishlist':'Add to wishlist'}</button></p></div></div>`);
  document.getElementById('modalAdd').onclick = ()=>{ addToCart(id); closeModal(); };
  document.getElementById('modalWish').onclick = ()=>{ toggleWishlist(id); closeModal(); render(); };
}

function openCart(){ const rows = state.cart.map(c=>{const p = products.find(x=>x.id===c.id); return `<tr><td>${p.title}</td><td>${c.qty}</td><td>${formatR(c.price)}</td><td>${formatR(c.price*c.qty)}</td><td><button class="btn ghost" data-id="${c.id}">-</button></td></tr>`}).join('');
  const total = state.cart.reduce((s,c)=>s + c.qty * c.price,0);
  const html = `
    <h3>Your Cart</h3>
    <table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Product</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="muted">Cart is empty</td></tr>'}</tbody></table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><strong>Total: ${formatR(total)}</strong><div><button class="btn ghost" id="clearCart">Clear</button><button class="btn primary" id="checkout">Proceed to pay</button></div></div>
  `;
  showModal(html);
  document.querySelectorAll('.modal button.ghost[data-id]').forEach(b=>b.onclick=()=>{ const id=+b.dataset.id; const idx = state.cart.findIndex(x=>x.id===id); if(idx>=0){ state.cart[idx].qty--; if(state.cart[idx].qty<=0) state.cart.splice(idx,1); save(); render(); openCart(); } });
  document.getElementById('clearCart')?.addEventListener('click',()=>{ state.cart=[]; save(); render(); openCart(); });
  document.getElementById('checkout')?.addEventListener('click',()=>{ openCheckout(); });
}

function openCheckout(){ const total = state.cart.reduce((s,c)=>s + c.qty * c.price,0);
  const html = `<h3>Checkout</h3>
    <p class="muted">Total payable: <strong>${formatR(total)}</strong></p>
    <form id="payForm">
      <label class="small">Name</label><input required name="name" style="width:100%;padding:8px;margin-bottom:8px" />
      <label class="small">Card Number</label><input required name="card" placeholder="1234 5678 9012 3456" style="width:100%;padding:8px;margin-bottom:8px" />
      <div style="display:flex;gap:8px"><input required name="exp" placeholder="MM/YY" style="flex:1;padding:8px" /><input required name="cvv" placeholder="CVV" style="flex:1;padding:8px"/></div>
      <div style="margin-top:12px;display:flex;gap:8px"><button type="button" id="backToCart" class="btn ghost">Back</button><button class="btn primary" type="submit">Pay ${formatR(total)}</button></div>
    </form>`;
  showModal(html);
  document.getElementById('backToCart').onclick = openCart;
  document.getElementById('payForm').onsubmit = (e)=>{ e.preventDefault(); // simulate payment
    const order = {id:Date.now(),items:state.cart,amount:total,date:new Date().toISOString()}; state.orders.push(order); state.cart=[]; save(); render(); closeModal(); showToast('Payment successful — order placed'); }
}

// ===== wishlist & orders view =====
function openWishlist(){ const rows = state.wishlist.map(id=>{const p=products.find(x=>x.id===id); return `<li style="margin-bottom:10px"><strong>${p.title}</strong> · ${formatR(p.price)} <button class="btn primary" data-id="${id}">Add to cart</button></li>`}).join(''); showModal(`<h3>Wishlist</h3><ul>${rows||'<li class="muted">No items yet</li>'}</ul>`); document.querySelectorAll('.modal button.primary').forEach(b=>b.onclick=()=>{ const id=+b.dataset.id; addToCart(id); closeModal(); }); }

function openAccount(){ const html = `<h3>Account</h3><p class="muted">Demo user — local data only</p><p><strong>Orders</strong></p>${state.orders.length? state.orders.map(o=>`<div style="padding:8px;border-radius:8px;background:var(--glass);margin-bottom:8px"><div>Order #${o.id}</div><div class="small muted">${new Date(o.date).toLocaleString()}</div><div>Total: ${formatR(o.amount)}</div></div>`).join('') : '<p class="muted">No orders yet</p>'}
    <p style="margin-top:12px"><button class="btn ghost" id="logout">Sign out</button></p>`; showModal(html); document.getElementById('logout').onclick = ()=>{ localStorage.clear(); state.wishlist=[]; state.cart=[]; state.orders=[]; save(); render(); closeModal(); showToast('Local data cleared'); }
}

// ===== modal util =====
const modalBg = document.getElementById('modalBg'); const modalContent = document.getElementById('modalContent');
function showModal(html){ modalContent.innerHTML = html + '<p style="text-align:right;margin-top:12px"><button class="btn ghost" id="closeModal">Close</button></p>'; modalBg.style.display='flex'; document.getElementById('closeModal').onclick = closeModal; }
function closeModal(){ modalBg.style.display='none'; modalContent.innerHTML=''; }

// ===== toasts =====
function showToast(msg){ const t = document.createElement('div'); t.textContent = msg; t.style.position='fixed'; t.style.right='20px'; t.style.bottom='100px'; t.style.background='linear-gradient(90deg,var(--accent),var(--accent-2))'; t.style.color='white'; t.style.padding='10px 14px'; t.style.borderRadius='10px'; document.body.appendChild(t); setTimeout(()=>t.style.opacity=0,1800); setTimeout(()=>t.remove(),2400); }

// ===== events =====
searchInput.addEventListener('input', e=>{ state.query = e.target.value; render(); });
categorySelect.addEventListener('change', e=>{ state.category = e.target.value; render(); });
sortSelect.addEventListener('change', e=>{ state.sort = e.target.value; render(); });

document.getElementById('openWishlist').onclick = openWishlist;
document.getElementById('openCart').onclick = openCart;
document.getElementById('floatingOpen').onclick = openCart;
document.getElementById('openAccount').onclick = openAccount;

document.getElementById('showOffers').onclick = ()=>{ showToast('Limited time: 25% off on electronics!'); };

// theme toggle
const themeToggle = document.getElementById('themeToggle'); themeToggle.onclick = ()=>{ const root = document.body; root.setAttribute('data-theme', root.getAttribute('data-theme')==='dark'?'light':'dark'); }

// initial render
render(); updateCounts();

// close modal on bg click
modalBg.addEventListener('click', (e)=>{ if(e.target===modalBg) closeModal(); })

// expose some for console debugging
window._ms = {state,products,render};