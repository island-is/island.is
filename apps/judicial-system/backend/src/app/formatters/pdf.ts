import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import fs from 'fs'

import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  User,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatCustodyRestrictions,
  formatDate,
  formatGender,
  formatNationalId,
  formatRestrictions,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import {
  formatAppeal,
  formatConclusion,
  formatCourtCaseNumber,
  formatCustodyProvisions,
  formatProsecutorDemands,
} from './formatters'

export function writeFile(fileName: string, documentContent: string) {
  // In e2e tests, fs is null and we have not been able to mock fs
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}

export async function generateRequestPdf(
  existingCase: Case,
  user: User,
): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 40,
      left: 50,
      right: 50,
    },
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Krafa um gæsluvarðhald', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`, {
      align: 'center',
    })
    .fontSize(16)
    .text(`Embætti: ${user.institution}`, {
      align: 'center',
    })
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court}`, { align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text('Grunnupplýsingar')
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(`Kennitala: ${formatNationalId(existingCase.accusedNationalId)}`)
    .text(`Fullt nafn: ${existingCase.accusedName}`)
    .text(`Kyn: ${capitalize(formatGender(existingCase.accusedGender))}`)
    .text(`Lögheimili: ${existingCase.accusedAddress}`)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatProsecutorDemands(
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court,
        existingCase.alternativeTravelBan,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
      ),
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem brot varða við')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.lawsBroken, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem krafan er byggð á')
    .font('Helvetica')
    .fontSize(12)
    .text(formatCustodyProvisions(existingCase.custodyProvisions), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Takmarkanir á gæslu', {})
    .font('Helvetica')
    .fontSize(12)
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
    .fontSize(18)
    .lineGap(8)
    .text('Greinargerð um málsatvik og lagarök')
    .fontSize(14)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.caseFacts, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagarök')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalArguments, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `F.h.l. ${existingCase.prosecutor?.name || user?.name} ${
        existingCase.prosecutor?.title || user.title
      }`,
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

export async function generateRulingPdf(
  existingCase: Case,
  user: User,
): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 40,
      left: 50,
      right: 50,
    },
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Þingbók', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(
      formatCourtCaseNumber(existingCase.court, existingCase.courtCaseNumber),
      { align: 'center' },
    )
    .fontSize(12)
    .lineGap(30)
    .text(`LÖKE málsnr. ${existingCase.policeCaseNumber}`, { align: 'center' })
    .text(
      `Þinghald hófst þann ${formatDate(existingCase.courtStartTime, 'PPPp')}`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .lineGap(8)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Viðstaddir', {})
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtAttendees, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Krafa lögreglu')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.policeDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómskjöl')
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Rannsóknargögn málsins liggja frammi. Krafa lögreglu þingmerkt nr. 1.',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Réttindi kærða')
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Kærða er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Kærði er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Afstaða kærða')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.accusedPlea, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málflutningur')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.litigationPresentations, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(14)
    .lineGap(8)
    .text('Krafa lögreglu')
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatProsecutorDemands(
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court,
        existingCase.alternativeTravelBan,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.caseFacts, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagarök')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalArguments, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Niðurstaða')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.ruling, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Úrskurðarorð', { align: 'center' })
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatConclusion(
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.decision,
        existingCase.custodyEndDate,
        existingCase.custodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.judge?.name || user?.name} ${
        existingCase.judge?.title || user?.title
      }`,
      {
        align: 'center',
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica')
    .text('Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Ákvörðun um kæru')
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
      {
        lineGap: 6,
        paragraphGap: 4,
      },
    )
    .font('Helvetica-Bold')
    .lineGap(6)
    .text(formatAppeal(existingCase.accusedAppealDecision, 'Kærði'))
    .text(formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi'))

  if (existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru kærða')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.accusedAppealAnnouncement, {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru sækjanda')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.prosecutorAppealAnnouncement, {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (existingCase.decision === CaseDecision.ACCEPTING) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(12)
      .text(formatRestrictions(existingCase.custodyRestrictions), {
        lineGap: 6,
        paragraphGap: 0,
      })
      .text(' ')
      .text(
        'Dómari bendir kærða/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  doc
    .lineGap(20)
    .text(' ')
    .text(
      `Þinghaldi lauk þann ${formatDate(existingCase.courtEndTime, 'PPPp')}`,
    )
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
