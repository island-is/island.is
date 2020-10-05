import pug from 'pug'
import puppeteer from 'puppeteer'
import fs from 'fs'

import { environment } from '../../../environments'
import { Case, CaseCustodyRestrictions } from './models'

const months = {
  0: 'janúar',
  1: 'febrúar',
  2: 'mars',
  3: 'apríl',
  4: 'maí',
  5: 'júní',
  6: 'júlí',
  7: 'ágúst',
  8: 'september',
  9: 'október',
  10: 'nóvember',
  11: 'desember',
}

function formatTimePart(part: number) {
  return part.toString().padStart(2, '0')
}

function formatTime(date: Date): string {
  return `${formatTimePart(date.getHours())}:${formatTimePart(
    date.getMinutes(),
  )}`
}

function formatDate(date: Date): string {
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
}

function formatDayOfWeek(date: Date): string {
  switch (date.getDay()) {
    case 0:
      return 'sunnudagsins'
    case 1:
      return 'mánudagsins'
    case 2:
      return 'þriðjudagsins'
    case 3:
      return 'miðvikudagsins'
    case 4:
      return 'fimmtudagsins'
    case 5:
      return 'föstudagsins'
    case 6:
      return 'laugardagsins'
  }
}

function formatNationalId(nationalId: string): string {
  return `${nationalId.slice(0, 5)}-${nationalId.slice(6)}`
}

export function writeFile(fileName: string, documentContent: string) {
  fs.writeFileSync(`./${fileName}`, documentContent, { encoding: 'binary' })
}

export async function generateRulingPdf(existingCase: Case): Promise<string> {
  const compiledFunction = pug.compileFile(
    './apps/judicial-system/api/templates/ruling.pug',
    {
      basedir: './templates',
    },
  )

  const html = compiledFunction({
    courtCaseNumber: existingCase.courtCaseNumber,
    policeCaseNumber: existingCase.policeCaseNumber,
    courtStartTime: formatTime(existingCase.courtStartTime),
    courtEndTime: formatTime(existingCase.courtEndTime),
    courtDate: formatDate(existingCase.courtStartTime),
    policeDemands: existingCase.policeDemands,
    courtAttendees: existingCase.courtAttendees,
    accusedPlea: existingCase.accusedPlea,
    litigationPresentations: existingCase.litigationPresentations,
    ruling: existingCase.ruling,
    accusedName: existingCase.accusedName,
    nationalId: formatNationalId(existingCase.accusedNationalId),
    custodyEndDay: formatDayOfWeek(existingCase.custodyEndDate),
    custodyEndDate: formatDate(existingCase.custodyEndDate),
    custodyEndTime: formatTime(existingCase.custodyEndDate),
    isolation: existingCase.custodyRestrictions.includes(
      CaseCustodyRestrictions.ISOLATION,
    ),
    accusedAppealDecision: existingCase.accusedAppealDecision,
    prosecutorAppealDecision: existingCase.prosecutorAppealDecision,
    judgeName: existingCase.judge.name,
    judgeTitle: existingCase.judge.title,
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.html`, html)
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdf = await page.pdf({ format: 'A4' })
  await browser.close()

  return pdf.toString('binary')
}
