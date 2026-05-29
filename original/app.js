// ── TELEGRAM SETTINGS ──────────────────────────────────────────────
const TG_TOKEN = 'ВСТАВЬТЕ_БОТ_ТОКЕН';   // например: 7123456789:AAH...
const TG_CHAT  = 'ВСТАВЬТЕ_CHAT_ID';     // например: -1001234567890
// ───────────────────────────────────────────────────────────────────

// ── SPA NAV ──
function navTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.textContent.trim() === ({ home: 'Главная', products: 'Продукция', price: 'Прайс и заказ', about: 'О компании', contacts: 'Контакты' }[id])) {
      l.classList.add('active');
    }
  });
  window.scrollTo(0, 0);
  if (id === 'price') renderPrice();
}
function showPage(id) { navTo(id); }
function toggleMob() { document.getElementById('mobMenu').classList.toggle('open'); }

// ── PRODUCT DATA ──
const PRODUCTS = [
  { id: 'tile', name: 'Металлочерепица', desc: 'Монтеррей, Усадьба, Шато, Гранд, Kvinta, Супер Kvinta. Покрытие PE, Matte, Deep Matte, Printech. Рабочая ширина 1100–1160 мм.', price: 'от 398 ₽/кв.м', badge: 'Хит продаж', tags: ['PE', 'Matte', 'Printech', 'НЛМК', 'Северсталь'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', cat: 'tile' },
  { id: 'prof', name: 'Профнастил', desc: 'С-8, С-20, С-20R, МП-20, С-21, НС-35, НС-44, Н-60, Н-75, Н-114. Толщина 0.25–1.0 мм. Кровельный и заборный.', price: 'от 310 ₽/пог.м', badge: '', tags: ['Кровельный', 'Заборный', '0.25–1.0 мм'], img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80', cat: 'prof' },
  { id: 'flat', name: 'Фальцевая кровля', desc: 'Замковая и клик-замок. Прямая, пуклёвка, трапеция. Гладкий лист 1250 мм в защитной полиэстерной плёнке.', price: 'от 229 ₽/пог.м', badge: '', tags: ['Замковая', 'Клик-замок', 'Гладкий лист'], img: 'https://images.unsplash.com/photo-1595514535116-8be1e2f24e0e?w=600&q=80', cat: 'flat' },
  { id: 'fence', name: 'Евроштакетник', desc: 'Профили М, П, ПК — прямые и фигурные. Ширина 109–120 мм. Полная, центральная и двойная перфорация.', price: 'от 43 ₽/пог.м', badge: 'Для заборов', tags: ['М', 'П', 'ПК', '109–120 мм'], img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', cat: 'fence' },
  { id: 'soffit', name: 'Металлосайдинг / Софит', desc: 'Софит 365/332 мм с полной, центральной, двойной перфорацией и без. Для подшивки карнизных свесов.', price: 'от 233 ₽/пог.м', badge: '', tags: ['Перфорированный', 'Без перфорации'], img: 'https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=600&q=80', cat: 'soffit' },
  { id: 'roof-acc', name: 'Доборные элементы', desc: 'Коньки, ендовы, ветровые планки, карнизные капельники, планки примыкания, снеговые барьеры. Полный комплект для монтажа.', price: 'от 212 ₽/шт', badge: 'Комплект', tags: ['Коньки', 'Ендовы', 'Отливы', 'Уголки'], img: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&q=80', cat: 'roof-acc' },
];

function renderProductGrid(containerId, count = 6) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const items = PRODUCTS.slice(0, count);
  c.innerHTML = items.map(p => `
    <div class="prod-card" onclick="navTo('price');setTimeout(()=>{document.getElementById('pcatF').value='${p.cat}';renderPrice()},100)">
      <div class="prod-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<div class="prod-badge">${p.badge}</div>` : ''}
      </div>
      <div class="prod-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="prod-tags">${p.tags.map(t => `<span class="prod-tag">${t}</span>`).join('')}</div>
        <div class="prod-footer">
          <div class="prod-price"><span class="prod-price">Цена</span><strong>${p.price}</strong></div>
          <button class="prod-cta">Смотреть цены →</button>
        </div>
      </div>
    </div>`).join('');
}
renderProductGrid('homeProducts');
renderProductGrid('allProducts');

// ── PRICE DATA ──
const CATS = { tile: 'Металлочерепица', prof: 'Профнастил', flat: 'Гладкий лист / Фальцевая кровля', strips: 'Штрипс', fence: 'Евроштакетник', soffit: 'Металлосайдинг / Софит', modular: 'Модульные заборы / Жалюзи', 'roof-acc': 'Комплектующие для кровли', 'fence-acc': 'Комплектующие для забора', windows: 'Отливы оконные' };
const CAT_ORDER = ['tile', 'prof', 'flat', 'strips', 'fence', 'soffit', 'modular', 'roof-acc', 'fence-acc', 'windows'];
const PCOLS = ['ZN (оцинк.)', 'PE одностор.', 'PE двустор.', 'Deep Matte', 'Deep Matte двустор.', 'Printech одностор.'];
const PDATA = [
  { cat: 'tile', name: 'Монтеррей 1190/1100', unit: 'кв.м', th: '0.35', p: ['-', '398', '488', '-', '-', '-'] },
  { cat: 'tile', name: 'Монтеррей 1190/1100', unit: 'кв.м', th: '0.40', p: ['-', '428', '528', '548', '658', '821'] },
  { cat: 'tile', name: 'Монтеррей 1190/1100', unit: 'кв.м', th: '0.45', p: ['-', '458', '568', '578', '688', '843'] },
  { cat: 'tile', name: 'Монтеррей 1190/1100', unit: 'кв.м', th: '0.50', p: ['-', '498', '618', '618', '728', '-'] },
  { cat: 'tile', name: 'Усадьба 1190/1100', unit: 'кв.м', th: '0.35', p: ['-', '517', '634', '-', '-', '-'] },
  { cat: 'tile', name: 'Усадьба 1190/1100', unit: 'кв.м', th: '0.40', p: ['-', '556', '686', '712', '855', '1067'] },
  { cat: 'tile', name: 'Усадьба 1190/1100', unit: 'кв.м', th: '0.45', p: ['-', '595', '738', '751', '894', '1096'] },
  { cat: 'tile', name: 'Усадьба 1190/1100', unit: 'кв.м', th: '0.50', p: ['-', '647', '803', '803', '946', '-'] },
  { cat: 'tile', name: 'Шато 1190/1100', unit: 'кв.м', th: '0.35', p: ['-', '517', '634', '-', '-', '-'] },
  { cat: 'tile', name: 'Шато 1190/1100', unit: 'кв.м', th: '0.40', p: ['-', '556', '686', '712', '855', '1067'] },
  { cat: 'tile', name: 'Шато 1190/1100', unit: 'кв.м', th: '0.45', p: ['-', '595', '738', '751', '894', '1096'] },
  { cat: 'tile', name: 'Шато 1190/1100', unit: 'кв.м', th: '0.50', p: ['-', '647', '803', '803', '946', '-'] },
  { cat: 'tile', name: 'Гранд 50 1190/1100', unit: 'кв.м', th: '0.35', p: ['-', '517', '634', '-', '-', '-'] },
  { cat: 'tile', name: 'Гранд 50 1190/1100', unit: 'кв.м', th: '0.40', p: ['-', '556', '686', '712', '855', '1067'] },
  { cat: 'tile', name: 'Гранд 50 1190/1100', unit: 'кв.м', th: '0.45', p: ['-', '595', '738', '751', '894', '1096'] },
  { cat: 'tile', name: 'Гранд 50 1190/1100', unit: 'кв.м', th: '0.50', p: ['-', '647', '803', '803', '946', '-'] },
  { cat: 'tile', name: 'Kvinta 1200/1160', unit: 'кв.м', th: '0.35', p: ['-', '476', '488', '-', '-', '-'] },
  { cat: 'tile', name: 'Kvinta 1200/1160', unit: 'кв.м', th: '0.40', p: ['-', '506', '528', '759', '760', '969'] },
  { cat: 'tile', name: 'Kvinta 1200/1160', unit: 'кв.м', th: '0.45', p: ['-', '536', '658', '789', '790', '995'] },
  { cat: 'tile', name: 'Kvinta 1200/1160', unit: 'кв.м', th: '0.50', p: ['-', '597', '708', '829', '830', '-'] },
  { cat: 'tile', name: 'Супер Kvinta 1200/1160', unit: 'кв.м', th: '0.35', p: ['-', '495', '508', '-', '-', '-'] },
  { cat: 'tile', name: 'Супер Kvinta 1200/1160', unit: 'кв.м', th: '0.40', p: ['-', '526', '549', '789', '790', '1008'] },
  { cat: 'tile', name: 'Супер Kvinta 1200/1160', unit: 'кв.м', th: '0.45', p: ['-', '557', '684', '821', '822', '1035'] },
  { cat: 'tile', name: 'Супер Kvinta 1200/1160', unit: 'кв.м', th: '0.50', p: ['-', '621', '736', '862', '863', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.25', p: ['310', '327', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.30', p: ['318', '336', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.35', p: ['407', '450', '516', '-', '-', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.40', p: ['413', '478', '563', '614', '705', '956'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.45', p: ['438', '518', '597', '648', '739', '976'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.50', p: ['468', '568', '653', '704', '795', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.55', p: ['495', '-', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'С-8/С-20/С-20R/МП-20/С-21', unit: 'пог.м', th: '0.70', p: ['607', '830', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'НС-35 1060/1000 / НС-44 1080/1000', unit: 'пог.м', th: '0.40', p: ['413', '478', '563', '614', '705', '956'] },
  { cat: 'prof', name: 'НС-35 1060/1000 / НС-44 1080/1000', unit: 'пог.м', th: '0.45', p: ['438', '518', '597', '648', '739', '976'] },
  { cat: 'prof', name: 'НС-35 1060/1000 / НС-44 1080/1000', unit: 'пог.м', th: '0.50', p: ['468', '568', '653', '704', '795', '-'] },
  { cat: 'prof', name: 'НС-35 1060/1000 / НС-44 1080/1000', unit: 'пог.м', th: '0.70', p: ['607', '830', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'НС-35 1060/1000 / НС-44 1080/1000', unit: 'пог.м', th: '1.00', p: ['832', '-', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'Н-60/Н-75/Н-114 646/600', unit: 'пог.м', th: '0.45', p: ['438', '518', '597', '648', '739', '976'] },
  { cat: 'prof', name: 'Н-60/Н-75/Н-114 646/600', unit: 'пог.м', th: '0.50', p: ['468', '568', '653', '704', '795', '-'] },
  { cat: 'prof', name: 'Н-60/Н-75/Н-114 646/600', unit: 'пог.м', th: '0.70', p: ['607', '830', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'Н-114 807/750', unit: 'пог.м', th: '0.70', p: ['722', '-', '-', '-', '-', '-'] },
  { cat: 'prof', name: 'Н-114 807/750', unit: 'пог.м', th: '1.00', p: ['1004', '-', '-', '-', '-', '-'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.25', p: ['310', '347', '-', '-', '-', '-'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.35', p: ['407', '470', '536', '-', '-', '-'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.40', p: ['413', '498', '583', '634', '725', '976'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.45', p: ['438', '538', '617', '668', '759', '996'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.50', p: ['468', '588', '673', '724', '815', '-'] },
  { cat: 'flat', name: 'Гладкий лист 1250 (в плёнке)', unit: 'пог.м', th: '0.70', p: ['607', '850', '-', '-', '-', '-'] },
  { cat: 'flat', name: 'Фальц. замковая 570/560', unit: 'пог.м', th: '0.40', p: ['229', '306', '314', '345', '405', '-'] },
  { cat: 'flat', name: 'Фальц. замковая 570/560', unit: 'пог.м', th: '0.45', p: ['262', '331', '354', '370', '430', '-'] },
  { cat: 'flat', name: 'Фальц. замковая 570/560', unit: 'пог.м', th: '0.50', p: ['270', '356', '394', '395', '455', '-'] },
  { cat: 'flat', name: 'Фальц. замковая 570/560', unit: 'пог.м', th: '0.70', p: ['367', '484', '-', '-', '-', '-'] },
  { cat: 'flat', name: 'Фальц. клик-замок 515/470', unit: 'пог.м', th: '0.40', p: ['229', '306', '314', '345', '405', '-'] },
  { cat: 'flat', name: 'Фальц. клик-замок 515/470', unit: 'пог.м', th: '0.45', p: ['262', '331', '354', '370', '430', '-'] },
  { cat: 'flat', name: 'Фальц. клик-замок 515/470', unit: 'пог.м', th: '0.50', p: ['270', '356', '394', '395', '455', '-'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.30', p: ['333', '401', '-', '-', '-', '-'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.35', p: ['379', '447', '508', '-', '-', '-'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.40', p: ['391', '475', '540', '579', '700', '794'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.45', p: ['401', '522', '589', '628', '740', '841'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.50', p: ['435', '569', '632', '668', '780', '-'] },
  { cat: 'strips', name: 'Штрипс (любые размеры)', unit: 'кв.м', th: '0.70', p: ['590', '775', '-', '-', '-', '-'] },
  { cat: 'fence', name: 'Евроштакетник М/П/ПК 109–120 мм', unit: 'пог.м', th: '0.35', p: ['43', '51', '60', '-', '-', '-'] },
  { cat: 'fence', name: 'Евроштакетник М/П/ПК 109–120 мм', unit: 'пог.м', th: '0.40', p: ['47', '56', '65', '81', '90', '127'] },
  { cat: 'fence', name: 'Евроштакетник М/П/ПК 109–120 мм', unit: 'пог.м', th: '0.45', p: ['51', '60', '74', '90', '96', '139'] },
  { cat: 'fence', name: 'Евроштакетник М/П/ПК 109–120 мм', unit: 'пог.м', th: '0.50', p: ['61', '67', '81', '99', '100', '-'] },
  { cat: 'soffit', name: 'Софит 365/332 — полная перфорация', unit: 'пог.м', th: '0.40', p: ['-', '233', '247', '386', '-', '-'] },
  { cat: 'soffit', name: 'Софит 365/332 — центр./двойная перф.', unit: 'пог.м', th: '0.45', p: ['-', '249', '292', '406', '-', '-'] },
  { cat: 'soffit', name: 'Софит 365/332 — без перфорации', unit: 'пог.м', th: '0.50', p: ['-', '265', '337', '-', '-', '-'] },
  { cat: 'modular', name: 'Ламель стандарт 109', unit: 'пог.м', th: '0.45', p: ['-', '-', '-', '103', '122', '-'] },
  { cat: 'modular', name: 'Ламель стандарт 109', unit: 'пог.м', th: '0.50', p: ['-', '93', '107', '-', '-', '136'] },
  { cat: 'modular', name: 'Ламель Double 116', unit: 'пог.м', th: '0.45', p: ['-', '-', '-', '128', '152', '-'] },
  { cat: 'modular', name: 'Ламель Double 116', unit: 'пог.м', th: '0.50', p: ['-', '116', '134', '-', '-', '169'] },
  { cat: 'roof-acc', name: 'Конёк 2000×150мм', unit: 'шт', th: '-', p: ['298', '398', '846', '465', '550', '-'] },
  { cat: 'roof-acc', name: 'Конёк 2000×200мм', unit: 'шт', th: '-', p: ['448', '548', '647', '731', '731', '-'] },
  { cat: 'roof-acc', name: 'Конёк полукруглый 2000×310мм', unit: 'шт', th: '-', p: ['-', '620', '710', '710', '844', '-'] },
  { cat: 'roof-acc', name: 'Конёк фигурный 2000×140мм', unit: 'шт', th: '-', p: ['401', '481', '568', '539', '656', '-'] },
  { cat: 'roof-acc', name: 'Ендова нар./внутр. 2000×150мм', unit: 'шт', th: '-', p: ['298', '398', '846', '465', '550', '-'] },
  { cat: 'roof-acc', name: 'Ендова нар./внутр. 2000×200мм', unit: 'шт', th: '-', p: ['448', '548', '647', '731', '731', '-'] },
  { cat: 'roof-acc', name: 'Ветровая планка 2000×105×105мм', unit: 'шт', th: '-', p: ['379', '417', '585', '576', '744', '-'] },
  { cat: 'roof-acc', name: 'Карнизная планка 2000×100×55мм', unit: 'шт', th: '-', p: ['212', '240', '277', '265', '313', '-'] },
  { cat: 'roof-acc', name: 'Планка примыкания 2000×140×100мм', unit: 'шт', th: '-', p: ['298', '398', '846', '465', '550', '-'] },
  { cat: 'roof-acc', name: 'Снеговой барьер 2000×95×65мм', unit: 'шт', th: '-', p: ['389', '418', '502', '587', '671', '-'] },
  { cat: 'roof-acc', name: 'Планка стыковочная 2000×45×60×45мм', unit: 'шт', th: '-', p: ['235', '264', '317', '441', '494', '-'] },
  { cat: 'fence-acc', name: 'Планка на забор 2000×10мм', unit: 'шт', th: '-', p: ['124', '175', '210', '356', '391', '-'] },
  { cat: 'fence-acc', name: 'Уголок внутренний 2000×50×50мм', unit: 'шт', th: '-', p: ['143', '189', '218', '208', '246', '-'] },
  { cat: 'fence-acc', name: 'Уголок наружный 2000×50×50мм', unit: 'шт', th: '-', p: ['143', '189', '218', '208', '246', '-'] },
  { cat: 'fence-acc', name: 'Уголок наружный 2000×100×100мм', unit: 'шт', th: '-', p: ['286', '378', '436', '416', '492', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×50мм', unit: 'шт', th: '-', p: ['118', '138', '162', '186', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×70мм', unit: 'шт', th: '-', p: ['138', '168', '210', '227', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×100мм', unit: 'шт', th: '-', p: ['167', '228', '270', '291', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×150мм', unit: 'шт', th: '-', p: ['238', '287', '357', '374', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×200мм', unit: 'шт', th: '-', p: ['327', '427', '479', '556', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×300мм', unit: 'шт', th: '-', p: ['498', '598', '644', '898', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×400мм', unit: 'шт', th: '-', p: ['698', '938', '1008', '1398', '-', '-'] },
  { cat: 'windows', name: 'Отлив оконный 2000×500мм', unit: 'шт', th: '-', p: ['898', '998', '1108', '1568', '-', '-'] },
];

// ── CALC ──
function calcArea() {
  const L = parseFloat(document.getElementById('cL').value) || 0;
  const W = parseFloat(document.getElementById('cW').value) || 0;
  const S = parseInt(document.getElementById('cS').value) || 1;
  const R = parseFloat(document.getElementById('cR').value) || 0;
  if (!L || !W) { document.getElementById('calcOut').textContent = '— м²'; return; }
  document.getElementById('calcOut').textContent = (L * W * S * (1 + R / 100)).toFixed(1) + ' м²';
}

// ── PRICE RENDER ──
function fmt(v) {
  if (!v || v === '-') return '<span class="pna">—</span>';
  return '<span class="pv">' + parseInt(v).toLocaleString('ru-RU') + '\u00a0₽</span>';
}

function renderPrice() {
  const q = (document.getElementById('psearch').value || '').toLowerCase().trim();
  const cat = document.getElementById('pcatF').value;
  const th = document.getElementById('pthF').value;

  const filtered = PDATA.filter(r => {
    if (cat && r.cat !== cat) return false;
    if (th && r.th !== th) return false;
    if (q && !r.name.toLowerCase().includes(q)) return false;
    return true;
  });

  document.getElementById('pcount').textContent = filtered.length + ' позиций';
  const grouped = {};
  filtered.forEach(r => { if (!grouped[r.cat]) grouped[r.cat] = []; grouped[r.cat].push(r); });

  const out = document.getElementById('priceOutput');
  if (!filtered.length) { out.innerHTML = '<div class="no-res">Ничего не найдено</div>'; return; }

  let html = '';
  CAT_ORDER.forEach(ckey => {
    if (!grouped[ckey]) return;
    html += `<div class="p-section"><div class="p-sec-head">${CATS[ckey]}</div><div class="p-tbl-wrap"><table class="ptbl"><thead><tr><th>Наименование</th><th>Ед.</th><th>Толщ.</th>`;
    PCOLS.forEach(c => { html += `<th class="pr">${c}</th>`; });
    html += '</tr></thead><tbody>';

    grouped[ckey].forEach(r => {
      html += `<tr><td class="nm">${r.name}</td><td class="ut">${r.unit}</td><td class="th">${r.th !== '-' ? r.th + '\u00a0мм' : '—'}</td>`;
      r.p.forEach((v, ci) => {
        html += `<td class="pr">${fmt(v)}`;
        if (v !== '-' && v) {
          const di = PDATA.indexOf(r);
          html += `<br><button class="add-btn" onclick="addCart(PDATA[${di}],${ci},'${v}')">+ В корзину</button>`;
        }
        html += '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';
  });
  out.innerHTML = html;
}
renderPrice();

// ── CART ──
let cart = [];
function addCart(row, ci, price) {
  const key = row.cat + '|' + row.name + '|' + row.th + '|' + ci;
  const ex = cart.find(i => i.key === key);
  if (ex) { ex.qty++; }
  else { cart.push({ key, name: row.name, th: row.th, unit: row.unit, cover: PCOLS[ci], price: parseInt(price), qty: 1 }); }
  updateCartN();
  const btn = document.querySelector('.nav-cart');
  btn.style.transform = 'scale(1.1)'; setTimeout(() => btn.style.transform = '', 200);
}

function updateCartN() { document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0); }
function openCart() { document.getElementById('overlay').classList.add('open'); document.getElementById('drawer').classList.add('open'); document.body.style.overflow = 'hidden'; renderDrawer(); }
function closeCart() { document.getElementById('overlay').classList.remove('open'); document.getElementById('drawer').classList.remove('open'); document.body.style.overflow = ''; }

function renderDrawer() {
  const body = document.getElementById('drwBody');
  const sum = document.getElementById('drwSum');
  if (!cart.length) { body.innerHTML = '<div class="empty-cart">Корзина пуста</div>'; sum.style.display = 'none'; return; }

  const L = parseFloat((document.getElementById('cL') || {}).value) || 0;
  const W = parseFloat((document.getElementById('cW') || {}).value) || 0;
  let hint = '';
  if (L && W) {
    const S = parseInt((document.getElementById('cS') || { value: '2' }).value) || 2;
    const R = parseFloat((document.getElementById('cR') || { value: '10' }).value) || 0;
    hint = `<div style="background:rgba(139,26,26,.1);border:1px solid rgba(139,26,26,.2);border-radius:var(--r);padding:10px 12px;margin-bottom:12px;font-size:12px;color:var(--text3)">По калькулятору: <b style="color:var(--gold)">${(L * W * S * (1 + R / 100)).toFixed(1)} м²</b></div>`;
  }

  body.innerHTML = hint + cart.map((item, idx) => `
    <div class="ci">
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-meta">${item.cover}${item.th !== '-' ? ' · ' + item.th + ' мм' : ''}</div>
        <div class="ci-ctrl">
          <button class="qty-btn" onclick="chQty(${idx},-1)">−</button>
          <span class="qty-v">${item.qty}</span>
          <button class="qty-btn" onclick="chQty(${idx},1)">+</button>
          <span style="font-size:11px;color:var(--text3)">${item.unit}</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <button class="del-btn" onclick="rmItem(${idx})">✕</button>
        <div class="ci-price">${(item.price * item.qty).toLocaleString('ru-RU')}\u00a0₽</div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cnt = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('sItems').textContent = cnt;
  document.getElementById('sTotal').textContent = total.toLocaleString('ru-RU') + '\u00a0₽';
  sum.style.display = 'block';
}

function chQty(idx, d) { cart[idx].qty = Math.max(1, cart[idx].qty + d); updateCartN(); renderDrawer(); }
function rmItem(idx) { cart.splice(idx, 1); updateCartN(); renderDrawer(); }

// ── SEND ORDER ──
async function sendOrder() {
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const addr = document.getElementById('fAddr').value.trim();
  const comment = document.getElementById('fComment').value.trim();
  let ok = true;

  ['fName', 'fPhone', 'fAddr'].forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('err'); ok = false; } else el.classList.remove('err');
  });
  if (!ok || !cart.length) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Отправляем...';
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = '🏗 *Новый заказ — Профметалл 24*\n\n';
  msg += '👤 *Клиент:* ' + name + '\n📞 *Телефон:* ' + phone + '\n📦 *Адрес:* ' + addr + '\n';
  if (comment) msg += '💬 *Комментарий:* ' + comment + '\n';
  msg += '\n*Состав заказа:*\n';

  cart.forEach((item, i) => {
    msg += (i + 1) + '. ' + item.name + '\n   ' + item.cover + (item.th !== '-' ? ' · ' + item.th + ' мм' : '') + ' · ' + item.qty + ' ' + item.unit + ' × ' + item.price.toLocaleString('ru-RU') + ' ₽ = ' + (item.price * item.qty).toLocaleString('ru-RU') + ' ₽\n';
  });
  msg += '\n💰 *Итого: ' + total.toLocaleString('ru-RU') + ' ₽*';

  const L = parseFloat((document.getElementById('cL') || {}).value) || 0;
  const W = parseFloat((document.getElementById('cW') || {}).value) || 0;
  if (L && W) { const S = 2; const R = 10; msg += '\n📐 Площадь: ' + (L * W * S * (1 + R / 100)).toFixed(1) + ' м²'; }

  try {
    const res = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('drwBody').innerHTML = '<div class="success-screen"><h3 style="color:var(--text);font-family:Unbounded,sans-serif;margin-bottom:8px">Заказ отправлен!</h3><p style="color:var(--text3);font-size:13px">Менеджер свяжется с вами по номеру ' + phone + '</p><button onclick="resetOrder()" style="margin-top:16px;background:rgba(139,26,26,.15);color:var(--red3);border:1px solid rgba(139,26,26,.3);border-radius:var(--r);padding:9px 20px;font-family:Manrope,sans-serif;font-size:13px;font-weight:600;cursor:pointer">Вернуться в прайс</button></div>';
      document.getElementById('drwSum').style.display = 'none';
      cart = []; updateCartN();
    } else throw new Error(data.description || 'Ошибка');
  } catch (e) { btn.disabled = false; btn.textContent = 'Отправить заказ в Telegram'; alert('Ошибка: ' + e.message); }
}

function resetOrder() { closeCart(); ['fName', 'fPhone', 'fAddr', 'fComment'].forEach(id => document.getElementById(id).value = ''); }

// ── SEND CONTACT ──
async function sendContact() {
  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const msg2 = document.getElementById('cMsg').value.trim();
  if (!name || !phone || !msg2) { document.getElementById('contactResult').textContent = 'Заполните обязательные поля'; return; }

  const btn = document.getElementById('contactSendBtn');
  btn.disabled = true; btn.textContent = 'Отправляем...';
  const subj = document.getElementById('cSubj').value.trim();

  let msg = '📬 *Обратная связь — Профметалл 24*\n\n👤 ' + name + '\n📞 ' + phone;
  if (subj) msg += '\n📌 Тема: ' + subj;
  msg += '\n\n' + msg2;

  try {
    const res = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: msg, parse_mode: 'Markdown' })
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('contactResult').textContent = '✓ Сообщение отправлено!';
      document.getElementById('contactResult').style.color = '#4ade80';
      ['cName', 'cPhone', 'cSubj', 'cMsg'].forEach(id => document.getElementById(id).value = '');
    } else throw new Error(data.description);
  } catch (e) { document.getElementById('contactResult').textContent = 'Ошибка: ' + e.message; btn.disabled = false; btn.textContent = 'Отправить сообщение'; }
}