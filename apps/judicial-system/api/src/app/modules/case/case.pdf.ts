import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import fs from 'fs'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
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

function size(size: number): number {
  return 0.75 * size
}

function formatConclusion(existingCase: Case): string {
  return existingCase.rejecting
    ? 'Beiðni um gæsluvarðhald hafnað.'
    : `Kærði, ${existingCase.accusedName} kt.${
        existingCase.accusedNationalId
      } skal sæta gæsluvarðhaldi, þó ekki lengur en til ${formatDate(
        existingCase.custodyEndDate,
        'PPPp',
      )}. ${
        existingCase.custodyRestrictions &&
        existingCase.custodyRestrictions.length > 0
          ? `Kærði skal sæta ${existingCase.custodyRestrictions.map(
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
          : 'Engar takmarkanir skulu vera á gæslunni.'
      }`
}

function formatAppeal(appealDecision: CaseAppealDecision, stakeholder: string) {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `  \u2022  ${stakeholder} kærir úrskurðinn.`
    case CaseAppealDecision.ACCEPT:
      return `  \u2022  ${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `  \u2022  ${stakeholder} tekur sér lögboðinn frest.`
  }
}

export function writeFile(fileName: string, documentContent: string) {
  // In e2e tests, fs is null and we have not been able to mock fs
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}

export async function generateRequestPdf(existingCase: Case): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(size(26))
    .lineGap(8)
    .text('Krafa um gæsluvarðhald')
    .font('Helvetica')
    .fontSize(size(16))
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`)
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court}`)
    .font('Helvetica-Bold')
    .fontSize(size(18))
    .lineGap(8)
    .text('Grunnupplýsingar')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(4)
    .text(`Kennitala: ${formatNationalId(existingCase.accusedNationalId)}`)
    .text(`Fullt nafn: ${existingCase.accusedName}`)
    .lineGap(16)
    .text(`Lögheimili: ${existingCase.accusedAddress}`)
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Tími handtöku')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(16)
    .text(`${capitalize(formatDate(existingCase.arrestDate, 'PPPPp'))}.`)
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Ósk um fyrirtökudag og tíma')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(16)
    .text(
      `${capitalize(formatDate(existingCase.requestedCourtDate, 'PPPPp'))}.`,
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(16)
    .text(
      `Gæsluvarðhald til ${capitalize(
        formatDate(existingCase.requestedCustodyEndDate, 'PPPp'),
      )}.`,
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Lagaákvæði')
    .font('Helvetica')
    .fontSize(size(12))
    .text(
      formatLawsBroken(existingCase.lawsBroken, existingCase.custodyProvisions),
      {
        lineGap: 6,
        paragraphGap: 10,
      },
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Takmarkanir á gæslu', {})
    .font('Helvetica')
    .fontSize(size(12))
    .text(
      `${formatCustodyRestrictions(
        existingCase.requestedCustodyRestrictions,
      )}.`,
      {
        lineGap: 6,
        paragraphGap: 26,
      },
    )
    .font('Helvetica-Bold')
    .fontSize(size(18))
    .lineGap(8)
    .text('Greinargerð um málsatvik og lagarök')
    .fontSize(size(14))
    .text('Málsatvik rakin')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.caseFacts, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Framburðir')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.witnessAccounts, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Staða rannsóknar og næstu skref')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.investigationProgress, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Lagarök')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.legalArguments, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .text(
      `Fhl. ${existingCase.prosecutor?.name}, ${existingCase.prosecutor?.title}`,
    )
    .end()

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.pdf`, pdf as string)
  }

  return pdf
}

export async function generateRulingPdf(existingCase: Case): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(size(26))
    .lineGap(8)
    .text('Krafa um gæsluvarðhald')
    .font('Helvetica')
    .fontSize(size(16))
    .text(`Málsnúmer: ${existingCase.courtCaseNumber}`)
    .lineGap(40)
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`)
    .font('Helvetica-Bold')
    .fontSize(size(18))
    .lineGap(8)
    .text('Þingbók')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(16)
    .text(
      `Þinghald frá kl. ${formatDate(
        existingCase.courtStartTime,
        TIME_FORMAT,
      )} til kl. ${formatDate(
        existingCase.courtEndTime,
        TIME_FORMAT,
      )} ${formatDate(existingCase.courtStartTime, 'PPP')}.`,
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Krafa lögreglu')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.policeDemands, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Viðstaddir', {})
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.courtAttendees, {
      lineGap: 6,
    })
    .lineGap(0)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Dómskjöl')
    .font('Helvetica')
    .fontSize(size(12))
    .lineGap(16)
    .text(
      'Rannsóknargögn málsins liggja frammi. Krafa lögreglu þingmerkt nr. 1.',
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Réttindi kærða')
    .font('Helvetica')
    .fontSize(size(12))
    .text(
      'Kærða er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Kærði er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      {
        lineGap: 6,
        paragraphGap: 10,
      },
    )
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Afstaða kærða')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.accusedPlea, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Málflutningur')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.litigationPresentations, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Úrskurður')
    .font('Helvetica')
    .fontSize(size(12))
    .text(existingCase.ruling, {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Úrskurðarorð')
    .font('Helvetica')
    .fontSize(size(12))
    .text(formatConclusion(existingCase), {
      lineGap: 6,
      paragraphGap: 10,
    })
    .font('Helvetica-Bold')
    .fontSize(size(14))
    .lineGap(8)
    .text('Ákvörðun um kæru')
    .font('Helvetica')
    .fontSize(size(12))
    .text(
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa. Dómari bendir kærða á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
      {
        lineGap: 6,
        paragraphGap: 4,
      },
    )
    .font('Helvetica-Bold')
    .lineGap(6)
    .text(formatAppeal(existingCase.accusedAppealDecision, 'Kærði'))
    .lineGap(16)
    .text(formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi'))
    .text(`${existingCase.judge?.name}, ${existingCase.judge?.title}`)
    .end()

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.pdf`, pdf as string)
  }

  return pdf
}
