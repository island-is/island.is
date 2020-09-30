import pug from 'pug'
import puppeteer from 'puppeteer'

export async function getPdf(): Promise<string> {
  const compiledFunction = pug.compileFile(
    './apps/judicial-system/api/templates/request.pug',
    {
      basedir: './templates',
    },
  )

  const html = compiledFunction()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdf = await page.pdf({ format: 'A4' })

  return pdf.toString('binary')
}
