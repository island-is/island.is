import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  AccusedPleaDecision,
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatDate,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
  NounCases,
  formatAccusedByGender,
  caseTypes,
  areAccusedRightsHidden,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatAppeal } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'

function constructRestrictionRulingPdf(
  existingCase: Case,
): streamBuffers.WritableStreamBuffer {
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
    .text(existingCase.court?.name ?? 'Dómstóll ekki skráður', {
      align: 'center',
    })
    .fontSize(12)
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge?.name ?? '?'
      } ${existingCase.judge?.title ?? '?'} dómþing. Fyrir er tekið mál nr. ${
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
    .text('Viðstaddir')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtAttendees ?? 'Vistaddir ekki skráðir', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Krafa')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.prosecutorDemands ?? 'Krafa ekki skráð', {
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
    .text(`Krafa um ${caseTypes[existingCase.type]} þingmerkt nr. 1.`, {
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

  if (!existingCase.isAccusedAbsent) {
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
  }

  doc
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
          ? `${capitalize(
              formatAccusedByGender(existingCase.accusedGender),
            )} samþykkir kröfuna. `
          : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
          ? `${capitalize(
              formatAccusedByGender(existingCase.accusedGender),
            )} hafnar kröfunni. `
          : ''
      }${existingCase.accusedPleaAnnouncement ?? ''}`,
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
    .text(
      existingCase.litigationPresentations ?? 'Málflutningur ekki skráður',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(14)
    .lineGap(8)
    .text('Krafa')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.demands ?? 'Krafa ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtCaseFacts ?? 'Málsatvik ekki skráð', {
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
    .text(existingCase.courtLegalArguments ?? 'Lagarök ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Niðurstaða')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.ruling ?? 'Niðurstaða ekki skráð', {
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
    .text(existingCase.conclusion ?? 'Úrskurðarorð ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.judge?.name ?? 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title ?? ''
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

  if (
    existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL &&
    existingCase.accusedAppealAnnouncement
  ) {
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
      .text(existingCase.accusedAppealAnnouncement ?? '', {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (
    existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL &&
    existingCase.prosecutorAppealAnnouncement
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru sækjanda')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.prosecutorAppealAnnouncement ?? '', {
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
          existingCase.validToDate,
          existingCase.isolationToDate,
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
        ? `Þinghaldi lauk kl. ${formatDate(existingCase.courtEndTime, 'p')}.`
        : 'Þinghaldi er ekki lokið.',
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationRulingPdf(
  existingCase: Case,
): streamBuffers.WritableStreamBuffer {
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
    .text(existingCase.court?.name ?? 'Dómstóll ekki skráður', {
      align: 'center',
    })
    .fontSize(12)
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge?.name ?? '?'
      } ${existingCase.judge?.title ?? '?'} dómþing. Fyrir er tekið mál nr. ${
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
    .text('Viðstaddir')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtAttendees ?? 'Viðstaddir ekki skráðir', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Krafa')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.prosecutorDemands ?? 'Krafa ekki skráð', {
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
    .text(`Krafa um ${caseTypes[existingCase.type]} þingmerkt nr. 1.`, {
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
  if (
    !areAccusedRightsHidden(
      existingCase.isAccusedAbsent,
      existingCase.sessionArrangements,
    )
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Réttindi varnaraðila')
      .font('Helvetica')
      .fontSize(12)
      .text(
        'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  // Only show accused plea if applicable
  if (existingCase.accusedPleaDecision !== AccusedPleaDecision.NOT_APPLICABLE) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Afstaða varnaraðila')
      .font('Helvetica')
      .fontSize(12)
      .text(
        `${
          existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
            ? 'Varnaraðili samþykkir kröfuna. '
            : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
            ? 'Varnaraðili hafnar kröfunni. '
            : ''
        }${existingCase.accusedPleaAnnouncement ?? ''}`,
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málflutningur')
    .font('Helvetica')
    .fontSize(12)
    .text(
      existingCase.litigationPresentations ?? 'Málflutningur ekki skráður',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(14)
    .lineGap(8)
    .text('Krafa')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.demands ?? 'krafa ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtCaseFacts ?? 'Málsatvik ekki skráð', {
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
    .text(existingCase.courtLegalArguments ?? 'lagarök ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')

  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Niðurstaða')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.ruling ?? 'Niðurstaða ekki skráð', {
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
    .text(existingCase.conclusion ?? 'Úrskurðarorð ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.judge?.name ?? 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title ?? ''
      }`,
      {
        align: 'center',
        paragraphGap: 0,
      },
    )
    .text(' ')
  if (existingCase.sessionArrangements !== SessionArrangements.REMOTE_SESSION) {
    doc
      .font('Helvetica')
      .text('Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.', {
        lineGap: 6,
        paragraphGap: 0,
      })
  }
  doc
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

  // Only show accused appeal decision if applicable
  if (
    existingCase.accusedAppealDecision !== CaseAppealDecision.NOT_APPLICABLE
  ) {
    doc.text(formatAppeal(existingCase.accusedAppealDecision, 'Varnaraðili'))
  }

  doc.text(formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi'))

  if (
    existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL &&
    existingCase.accusedAppealAnnouncement
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru varnaraðila')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.accusedAppealAnnouncement ?? '', {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (
    existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL &&
    existingCase.prosecutorAppealAnnouncement
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru sækjanda')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.prosecutorAppealAnnouncement ?? '', {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  doc
    .lineGap(20)
    .text(' ')
    .text(
      existingCase.courtEndTime
        ? `Þinghaldi lauk kl. ${formatDate(existingCase.courtEndTime, 'p')}.`
        : 'Þinghaldi er ekki lokið.',
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructRulingPdf(
  existingCase: Case,
): streamBuffers.WritableStreamBuffer {
  return existingCase.type === CaseType.CUSTODY ||
    existingCase.type === CaseType.TRAVEL_BAN
    ? constructRestrictionRulingPdf(existingCase)
    : constructInvestigationRulingPdf(existingCase)
}

export async function getRulingPdfAsString(
  existingCase: Case,
): Promise<string> {
  const stream = constructRulingPdf(existingCase)

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
