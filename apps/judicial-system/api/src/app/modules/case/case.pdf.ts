import pug from 'pug'
import puppeteer from 'puppeteer'
import fs from 'fs'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import {
  TIME_FORMAT,
  capitalize,
  formatDate,
  formatLawsBroken,
  formatNationalId,
  formatCustodyRestrictions,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'
import { Case } from './models'

export const formatConclusion = (existingCase: Case) => {
  return existingCase.rejecting
    ? 'Beiðni um gæsluvarðhald hafnað'
    : `Kærði, ${existingCase.accusedName} kt.${
        existingCase.accusedNationalId
      } skal sæta gæsluvarðhaldi, þó ekki lengur en til ${formatDate(
        existingCase.custodyEndDate,
        'PPPp',
      )}. ${
        existingCase.custodyRestrictions?.length === 0
          ? 'Engar takmarkanir skulu vera á gæslunni.'
          : `Kærði skal sæta ${existingCase.custodyRestrictions?.map(
              (custodyRestriction, index) => {
                const isNextLast =
                  index === existingCase.custodyRestrictions.length - 2
                const isLast =
                  index === existingCase.custodyRestrictions.length - 1
                const isOnly = existingCase.custodyRestrictions.length === 1

                return custodyRestriction === CaseCustodyRestrictions.ISOLATION
                  ? `einangrun${
                      isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                    }`
                  : custodyRestriction === CaseCustodyRestrictions.COMMUNICATION
                  ? `bréfa, og símabanni${
                      isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                    }`
                  : custodyRestriction === CaseCustodyRestrictions.MEDIA
                  ? `fjölmiðlabanni${
                      isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                    }`
                  : custodyRestriction === CaseCustodyRestrictions.VISITAION
                  ? `fjölmiðlabanni${
                      isLast ? '' : isNextLast && !isOnly ? ' og' : ', '
                    }`
                  : ''
              },
            )}á meðan á gæsluvarðhaldinu stendur.`
      }`
}

export function writeFile(fileName: string, documentContent: string) {
  // In e2e tests, fs is null and we have not been able to mock fs
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}

export async function generateRequestPdf(existingCase: Case): Promise<string> {
  const compiledFunction = pug.compileFile(
    './apps/judicial-system/api/templates/request.pug',
    {
      basedir: './templates',
    },
  )

  const html = compiledFunction({
    policeCaseNumber: existingCase.policeCaseNumber,
    court: existingCase.court,
    accusedNationalId: formatNationalId(existingCase.accusedNationalId),
    accusedName: existingCase.accusedName,
    accusedAddress: existingCase.accusedAddress,
    arrestDate: capitalize(formatDate(existingCase.arrestDate, 'PPPP')),
    arrestTime: formatDate(existingCase.arrestDate, TIME_FORMAT),
    requestedCourtDate: capitalize(
      formatDate(existingCase.requestedCourtDate, 'PPPP'),
    ),
    requestedCourtTime: formatDate(
      existingCase.requestedCourtDate,
      TIME_FORMAT,
    ),
    requestedCustodyEndDate: formatDate(
      existingCase.requestedCustodyEndDate,
      'PPP',
    ),
    requestedCustodyEndTime: formatDate(
      existingCase.requestedCustodyEndDate,
      TIME_FORMAT,
    ),
    lawsBroken: formatLawsBroken(
      existingCase.lawsBroken,
      existingCase.custodyProvisions,
    ),
    custodyRestrictions: formatCustodyRestrictions(
      existingCase.requestedCustodyRestrictions,
    ),
    caseFacts: existingCase.caseFacts,
    witnessAccounts: existingCase.witnessAccounts,
    investigationProgress: existingCase.investigationProgress,
    legalArguments: existingCase.legalArguments,
    prosecutorName: existingCase.prosecutor.name,
    prosecutorTitle: existingCase.prosecutor.title,
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.html`, html)
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdfBuffer = await page.pdf({ format: 'A4' })
  await browser.close()
  const pdf = pdfBuffer.toString('binary')

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.pdf`, pdf)
  }

  return pdf
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
    courtStartTime: formatDate(existingCase.courtStartTime, TIME_FORMAT),
    courtEndTime: formatDate(existingCase.courtEndTime, TIME_FORMAT),
    courtDate: formatDate(existingCase.courtStartTime, 'PPP'),
    policeDemands: existingCase.policeDemands,
    courtAttendees: existingCase.courtAttendees,
    accusedPlea: existingCase.accusedPlea,
    litigationPresentations: existingCase.litigationPresentations,
    ruling: existingCase.ruling,
    conclusion: formatConclusion(existingCase),
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
  const pdfBuffer = await page.pdf({ format: 'A4' })
  await browser.close()
  const pdf = pdfBuffer.toString('binary')

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
