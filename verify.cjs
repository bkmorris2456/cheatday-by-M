const { chromium } = require('playwright')
const path = require('path')
const SHOTS = path.join(__dirname, 'verify-screenshots')
require('fs').mkdirSync(SHOTS, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(SHOTS, 'home.png') })
  console.log('HOME url:', page.url())

  const navText = await page.textContent('header')
  console.log('Navbar has brand:', navText && navText.includes('cheatday by M'))

  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(SHOTS, 'login.png') })
  console.log('LOGIN url:', page.url())

  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(SHOTS, 'admin-unauth.png') })
  console.log('ADMIN (unauth) redirected to:', page.url())

  console.log('Console errors:', errors.length ? errors.join('\n') : 'none')
  await browser.close()
})()
