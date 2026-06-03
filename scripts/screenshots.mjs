/**
 * Automatische screenshots van de online tool voor in de scriptie.
 *
 * Doorloopt elke stap, vult demo-data in en maakt een screenshot.
 * Output: /Users/stormlodewijk/Desktop/Scriptie/scriptie/figuren/online_tool/
 *
 * Run met: node scripts/screenshots.mjs
 */
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = '/Users/stormlodewijk/Desktop/Scriptie/scriptie/figuren/online_tool';
const URL = 'https://storm399.github.io/afwegingstool-bouwtransport-water/';

const WAIT_AFTER_NAV = 1500;
const WAIT_AFTER_CLICK = 700;

await mkdir(OUT_DIR, { recursive: true });

console.log('🚀 Start screenshot run...');
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--font-render-hinting=medium'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, WAIT_AFTER_NAV));

// ===================================================================
// STAP 1 — WELKOM
// ===================================================================
console.log('📸 Stap 1: Welkom');
await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_1_welkom.png'),
  fullPage: false,
});

// Click "Start de afweging"
await page.$$eval('button', (btns) => {
  const start = btns.find(b => b.textContent.includes('Start de afweging'));
  if (start) start.click();
});
await new Promise(r => setTimeout(r, WAIT_AFTER_CLICK));

// ===================================================================
// STAP 2 — PROJECTINFO (leeg eerst, dan ingevuld)
// ===================================================================
console.log('📸 Stap 2: Projectinfo invullen');

// Vul Projectnaam
await page.evaluate(() => {
  const setNative = (el, val) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const naamInput = document.querySelector('#naam');
  const gemeenteInput = document.querySelector('#gemeente');
  if (naamInput) setNative(naamInput, 'VrijHaven');
  if (gemeenteInput) setNative(gemeenteInput, 'Amsterdam-Zuid');
});

// Click "Uitvoering" radio
await page.$$eval('label', (labels) => {
  const lbl = labels.find(l => l.textContent.includes('Uitvoering') && l.textContent.includes('gegund'));
  if (lbl) lbl.click();
});

// Check "Eigen kade aanwezig?"
await page.$$eval('label', (labels) => {
  const lbl = labels.find(l => l.textContent.includes('Eigen kade aanwezig'));
  if (lbl) lbl.click();
});
// Check "Zero-emissiezone actief?"
await page.$$eval('label', (labels) => {
  const lbl = labels.find(l => l.textContent.includes('Zero-emissiezone actief'));
  if (lbl) lbl.click();
});
await new Promise(r => setTimeout(r, 400));

await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_2_projectinfo.png'),
  fullPage: false,
});

// Click Volgende
await page.$$eval('button', (btns) => {
  const next = btns.find(b => b.textContent.includes('Volgende: locatie'));
  if (next) next.click();
});
await new Promise(r => setTimeout(r, WAIT_AFTER_CLICK));

// ===================================================================
// STAP 3 — LOCATIE
// ===================================================================
console.log('📸 Stap 3: Locatie');

// Vul adres
await page.evaluate(() => {
  const setNative = (el, val) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const inputs = document.querySelectorAll('input');
  const adresInput = Array.from(inputs).find(i => i.placeholder?.includes('Havenstraat'));
  if (adresInput) setNative(adresInput, 'Havenstraat 27, Amsterdam');
});

// Click Zoek
await page.$$eval('button', (btns) => {
  const zoek = btns.find(b => b.textContent.includes('Zoek op kaart'));
  if (zoek) zoek.click();
});
// Wacht op Nominatim + map update
await new Promise(r => setTimeout(r, 3500));

await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_3_locatie.png'),
  fullPage: false,
});

// Click Volgende
await page.$$eval('button', (btns) => {
  const next = btns.find(b => b.textContent.includes('Volgende: materiaal'));
  if (next) next.click();
});
await new Promise(r => setTimeout(r, WAIT_AFTER_CLICK));

// ===================================================================
// STAP 4 — MATERIAALSTROMEN
// ===================================================================
console.log('📸 Stap 4: Materiaalstromen');

// Click "+ Stroom toevoegen"
await page.$$eval('button', (btns) => {
  const add = btns.find(b => b.textContent.includes('Stroom toevoegen'));
  if (add) add.click();
});
await new Promise(r => setTimeout(r, 500));

// Click CLT-elementen
await page.$$eval('button', (btns) => {
  const clt = btns.find(b => b.textContent.includes('CLT-elementen'));
  if (clt) clt.click();
});
await new Promise(r => setTimeout(r, 500));

// Voeg tweede stroom toe — Grond afvoer
await page.$$eval('button', (btns) => {
  const add = btns.find(b => b.textContent.includes('Stroom toevoegen'));
  if (add) add.click();
});
await new Promise(r => setTimeout(r, 400));
await page.$$eval('button', (btns) => {
  const grond = btns.find(b => b.textContent.includes('Grond (afvoer)'));
  if (grond) grond.click();
});
await new Promise(r => setTimeout(r, 500));

// Voeg derde stroom toe — Aluminium gevels
await page.$$eval('button', (btns) => {
  const add = btns.find(b => b.textContent.includes('Stroom toevoegen'));
  if (add) add.click();
});
await new Promise(r => setTimeout(r, 400));
await page.$$eval('button', (btns) => {
  const alu = btns.find(b => b.textContent.includes('Aluminium gevelelementen'));
  if (alu) alu.click();
});
await new Promise(r => setTimeout(r, 600));

await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_4_stromen.png'),
  fullPage: true,
});

// Click Volgende
await page.$$eval('button', (btns) => {
  const next = btns.find(b => b.textContent.includes('Volgende: keten'));
  if (next) next.click();
});
await new Promise(r => setTimeout(r, WAIT_AFTER_CLICK));

// ===================================================================
// STAP 5 — KETENINRICHTING
// ===================================================================
console.log('📸 Stap 5: Keteninrichting');

// Vink regie-elementen aan
await page.$$eval('label', (labels) => {
  const targets = ['Regiekamer', 'BLVC-bestek', 'Digitaal ticketsysteem'];
  targets.forEach(t => {
    const lbl = labels.find(l => l.textContent.includes(t));
    if (lbl) lbl.click();
  });
});
await new Promise(r => setTimeout(r, 400));

await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_5_keten.png'),
  fullPage: false,
});

// Click Bekijk advies
await page.$$eval('button', (btns) => {
  const next = btns.find(b => b.textContent.includes('Bekijk advies'));
  if (next) next.click();
});
await new Promise(r => setTimeout(r, 1200));

// ===================================================================
// STAP 6 — ADVIES (full page voor compleet rapport)
// ===================================================================
console.log('📸 Stap 6: Advies (volledig)');
await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_6_advies.png'),
  fullPage: true,
});

// Aparte zoomshot van alleen de score-balk + hoofdadvies voor compacte versie
console.log('📸 Stap 6b: Advies (top, compact)');
await page.screenshot({
  path: path.join(OUT_DIR, 'fig_tool_6b_advies_top.png'),
  fullPage: false,
});

await browser.close();
console.log(`\n✅ Klaar — ${7} screenshots opgeslagen in:`);
console.log(`   ${OUT_DIR}\n`);
