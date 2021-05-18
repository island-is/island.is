import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import fs from 'fs'

import {
  AccusedPleaDecision,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatRequestedCustodyRestrictions,
  formatDate,
  formatGender,
  formatNationalId,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
  NounCases,
  formatAccusedByGender,
  formatProsecutorDemands,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import {
  formatAppeal,
  formatConclusion,
  formatCustodyProvisions,
} from './formatters'

function setPageNumbers(doc: PDFKit.PDFDocument) {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    // Set aside the margins and reset to ensure proper alignment
    const oldMargins = doc.page.margins
    doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 }
    doc.text(`${i + 1}`, 0, doc.page.height - (oldMargins.bottom * 2) / 3, {
      align: 'center',
    })

    // Reset margins
    doc.page.margins = oldMargins
  }
}

function constructRequestPdf(existingCase: Case) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = `Krafa um ${
      existingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
    }`
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text(
      `Krafa um ${
        existingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      }`,
      { align: 'center' },
    )
    .font('Helvetica')
    .fontSize(18)
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`, {
      align: 'center',
    })
    .fontSize(16)
    .text(
      `Embætti: ${existingCase.prosecutor?.institution?.name || 'Ekki skráð'}`,
      {
        align: 'center',
      },
    )
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
    .text(`Kyn: ${formatGender(existingCase.accusedGender)}`)
    .text(`Lögheimili: ${existingCase.accusedAddress}`)
    .text(
      `Verjandi sakbornings: ${
        existingCase.defenderName
          ? existingCase.defenderName
          : 'Hefur ekki verið skráður'
      }`,
    )
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
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )

  if (existingCase.otherDemands) {
    doc.text(' ').text(existingCase.otherDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
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
    .text(
      `Takmarkanir og tilhögun ${
        existingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
      }`,
      {},
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      `${formatRequestedCustodyRestrictions(
        existingCase.type,
        existingCase.requestedCustodyRestrictions,
        existingCase.requestedOtherRestrictions,
      )}`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
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
      `${existingCase.prosecutor?.name || ''} ${
        existingCase.prosecutor?.title || ''
      }`,
    )

  setPageNumbers(doc)

  doc.end()
  return stream
}

export function writeFile(fileName: string, documentContent: string) {
  // In e2e tests, fs is null and we have not been able to mock fs
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}

export async function getRequestPdfAsString(
  existingCase: Case,
): Promise<string> {
  const stream = constructRequestPdf(existingCase)

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.pdf`, pdf)
  }

  return pdf
}

export async function getRequestPdfAsBuffer(
  existingCase: Case,
): Promise<Buffer> {
  const stream = constructRequestPdf(existingCase)

  // wait for the writing to finish

  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdf
}

export async function getRulingPdfAsString(
  existingCase: Case,
): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Þingbók', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(existingCase.court, { align: 'center' })
    .fontSize(12)
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge.name
      } ${existingCase.judge.title} dómþing. Fyrir er tekið mál nr. ${
        existingCase.courtCaseNumber
      }. Þinghald hefst kl. ${formatDate(existingCase.courtStartDate, 'p')}.`,
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
    .text('Krafa lögreglu þingmerkt nr. 1.', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text('Rannsóknargögn málsins liggja frammi.', {
      lineGap: 6,
      paragraphGap: 4,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(`${courttDocument} þingmerkt nr. ${index + 2}.`, {
      lineGap: 6,
      paragraphGap: 4,
    }),
  )

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(
      `Réttindi ${formatAccusedByGender(
        existingCase.accusedGender,
        NounCases.GENITIVE,
      )}`,
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(
      `Afstaða ${formatAccusedByGender(
        existingCase.accusedGender,
        NounCases.GENITIVE,
      )}`,
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      `${
        existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
          ? `Kærði samþykkir kröfuna. `
          : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
          ? `Kærði hafnar kröfunni. `
          : ''
      }${existingCase.accusedPleaAnnouncement || ''}`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
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
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )

  if (existingCase.otherDemands?.length > 0) {
    doc.text(' ').text(existingCase.otherDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
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
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.accusedGender,
        existingCase.decision,
        existingCase.custodyEndDate,
        existingCase.type === CaseType.CUSTODY &&
          existingCase.custodyRestrictions?.includes(
            CaseCustodyRestrictions.ISOLATION,
          ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
        existingCase.isolationTo,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
  if (existingCase.additionToConclusion) {
    doc.text(' ').text(existingCase.additionToConclusion, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.judge?.name || 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title || ''
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
    .text(
      formatAppeal(
        existingCase.accusedAppealDecision,
        capitalize(formatAccusedByGender(existingCase.accusedGender)),
      ),
    )
    .text(formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi'))

  if (existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text(
        `Yfirlýsing um kæru ${formatAccusedByGender(
          existingCase.accusedGender,
          NounCases.GENITIVE,
        )}`,
      )
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

  if (
    existingCase.type === CaseType.CUSTODY &&
    existingCase.decision === CaseDecision.ACCEPTING
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(12)
      .text(
        formatCustodyRestrictions(
          existingCase.accusedGender,
          existingCase.custodyRestrictions,
        ),
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  if (
    (existingCase.type === CaseType.CUSTODY &&
      existingCase.decision ===
        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) ||
    (existingCase.type === CaseType.TRAVEL_BAN &&
      existingCase.decision === CaseDecision.ACCEPTING)
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Tilhögun farbanns')
      .font('Helvetica')
      .fontSize(12)
      .text(
        formatAlternativeTravelBanRestrictions(
          existingCase.accusedGender,
          existingCase.custodyRestrictions,
          existingCase.otherRestrictions,
        ),
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd farbannsins undir dómara.',
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
      existingCase.courtEndTime
        ? `Þinghaldi lauk þann ${formatDate(
            existingCase.courtEndTime,
            'PPPp',
          )}.`
        : 'Þinghaldi er ekki lokið.',
    )

  setPageNumbers(doc)

  doc.end()

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
