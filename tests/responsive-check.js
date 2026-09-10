/**
 * Prueba de Adaptabilidad y Responsividad
 * -------------------------------------------------------
 * Verifica que la pagina se renderiza correctamente en
 * multiples tamanos de viewport sin desbordamiento horizontal.
 *
 * Viewports evaluados:
 *   - Mobile-Small:    320x568  (iPhone SE)
 *   - Mobile-Standard: 375x812  (iPhone 12/13)
 *   - Tablet:          768x1024 (iPad portrait)
 *   - Desktop:        1024x768  (Laptop)
 *   - Desktop-Large:  1280x800  (Escritorio amplio)
 */
const { chromium } = require('playwright');

const VIEWPORTS = [
  { name: 'Mobile-Small',    width: 320,  height: 568  },
  { name: 'Mobile-Standard', width: 375,  height: 812  },
  { name: 'Tablet',          width: 768,  height: 1024 },
  { name: 'Desktop',         width: 1024, height: 768  },
  { name: 'Desktop-Large',   width: 1280, height: 800  },
];

async function runResponsiveTests() {
  const browser = await chromium.launch({ headless: true });
  const url = process.env.TEST_URL || 'http://localhost:3001';
  let hasErrors = false;

  console.log('========================================');
  console.log('  PRUEBAS DE ADAPTABILIDAD / RESPONSIVIDAD');
  console.log('========================================\n');
  console.log(`URL de prueba: ${url}\n`);

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

      const result = await page.evaluate(() => {
        const docWidth  = document.documentElement.scrollWidth;
        const viewWidth = window.innerWidth;

        return {
          documentWidth:       docWidth,
          viewportWidth:       viewWidth,
          hasHorizontalOverflow: docWidth > viewWidth,
          bodyHeight:          document.body.scrollHeight,
          sectionsCount:       document.querySelectorAll('section').length,
          hasHeader:           !!document.querySelector('header'),
          hasNav:              !!document.querySelector('nav'),
          hasMain:             !!document.querySelector('main'),
          hasFooter:           !!document.querySelector('footer'),
          hasSkipLink:         !!document.querySelector('a[href="#contenido-principal"]'),
          hasViewportMeta:     !!document.querySelector('meta[name="viewport"]'),
          hasLangAttr:         document.documentElement.lang !== '',
        };
      });

      const overflow = result.hasHorizontalOverflow;
      const status   = overflow ? 'FAIL' : 'PASS';

      console.log(`[${vp.name} ${vp.width}x${vp.height}] ... ${status}`);

      if (overflow) {
        hasErrors = true;
        console.log(`  >> DESBORDAMIENTO HORIZONTAL detectado!`);
        console.log(`     Documento: ${result.documentWidth}px | Viewport: ${result.viewportWidth}px`);
      } else {
        console.log(`  OK Sin desbordamiento (${result.documentWidth}px <= ${result.viewportWidth}px)`);
      }

      // Validar estructura semantica en cada viewport
      console.log(`  Estructura: header=${result.hasHeader} nav=${result.hasNav} main=${result.hasMain} footer=${result.hasFooter}`);
      console.log(`  Secciones: ${result.sectionsCount} | Skip Link: ${result.hasSkipLink} | lang="${document.documentElement.lang || ''}"`);

    } catch (err) {
      console.log(`[${vp.name}] ERROR: ${err.message}`);
      hasErrors = true;
    }

    await context.close();
    console.log('');
  }

  await browser.close();

  console.log('========================================');
  if (hasErrors) {
    console.error('RESULTADO: PRUEBAS DE RESPONSIVIDAD FALLIDAS');
    process.exit(1);
  } else {
    console.log('RESULTADO: TODAS LAS PRUEBAS DE RESPONSIVIDAD PASARON');
    process.exit(0);
  }
}

runResponsiveTests().catch(err => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
