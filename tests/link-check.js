/**
 * Verificacion de Seguridad de Enlaces Externos (HTTPS)
 * -------------------------------------------------------
 * Lee el HTML y verifica que:
 *   1. Todos los enlaces externos usan HTTPS.
 *   2. Todos los enlaces con target="_blank" incluyen
 *      rel="noopener noreferrer".
 */
const fs   = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'paginaCristianoRonaldo', 'index.html');
const html     = fs.readFileSync(htmlPath, 'utf-8');

console.log('========================================');
console.log('  VERIFICACION DE ENLACES EXTERNOS');
console.log('========================================\n');

// --- 1. Extraer y verificar protocolo de todos los enlaces ---
const hrefRegex   = /href="([^"]+)"/g;
const externalLinks = [];
let match;

while ((match = hrefRegex.exec(html)) !== null) {
  const href = match[1];
  if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
    continue;
  }
  externalLinks.push(href);
}

console.log(`Enlaces externos encontrados: ${externalLinks.length}\n`);

let hasInsecureLinks = false;

for (const link of externalLinks) {
  const isSecure = link.startsWith('https://');
  const tag = isSecure ? 'PASS' : 'FAIL';
  console.log(`  [${tag}] ${link}`);
  if (!isSecure) {
    hasInsecureLinks = true;
  }
}

// --- 2. Verificar rel="noopener noreferrer" en target="_blank" ---
const targetBlankRegex = /<a[^>]*target="_blank"[^>]*>/g;
const targetBlankLinks = [];
while ((match = targetBlankRegex.exec(html)) !== null) {
  targetBlankLinks.push(match[0]);
}

console.log(`\nEnlaces con target="_blank": ${targetBlankLinks.length}\n`);

let hasMissingRel = false;

for (const tag of targetBlankLinks) {
  const hasNoOpener   = tag.includes('rel="noopener') || tag.includes("rel='noopener");
  const hasNoReferrer = tag.includes('noreferrer');
  const ok            = hasNoOpener && hasNoReferrer;
  const tagLabel      = ok ? 'PASS' : 'WARN';
  console.log(`  [${tagLabel}] ${tag.substring(0, 100)}...`);
  if (!ok) {
    hasMissingRel = true;
    console.log(`    >> Falta rel="noopener noreferrer"`);
  }
}

// --- Resultado final ---
console.log('\n========================================');
if (hasInsecureLinks) {
  console.error('RESULTADO: FALLO - Enlaces inseguros (HTTP) detectados');
  process.exit(1);
}
if (hasMissingRel) {
  console.error('RESULTADO: FALLO - Enlaces target="_blank" sin rel="noopener noreferrer"');
  process.exit(1);
}
console.log('RESULTADO: TODOS LOS ENLACES EXTERNOS SON SEGUROS (HTTPS)');
process.exit(0);
