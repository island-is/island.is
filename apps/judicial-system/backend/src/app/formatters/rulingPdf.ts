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
import { skjaldarmerki } from './skjaldarmerki'

function constructRestrictionRulingPdf(
  existingCase: Case,
): streamBuffers.WritableStreamBuffer {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 70,
      bottom: 70,
      left: 70,
      right: 70,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc.translate(270, 70).scale(0.5)

  skjaldarmerki(doc)

  doc
    .fillColor('black')
    .scale(2)
    .translate(-270, -70)
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')

  doc
    .font('Times-Roman')
    .fontSize(18)
    .lineGap(4)
    .text(existingCase.court?.name ?? 'Dómstóll ekki skráður', {
      align: 'center',
    })
    .fontSize(14)
    .lineGap(2)
    .text('Þingbók og úrskurður', { align: 'center' })
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .fontSize(11)
    .lineGap(1)
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge?.name ?? '?'
      } ${existingCase.judge?.title ?? '?'} dómþing. Fyrir er tekið mál nr. ${
        existingCase.courtCaseNumber
      }. Þinghald hefst kl. ${formatDate(existingCase.courtStartDate, 'p')}.`,
      {
        paragraphGap: 1,
      },
    )

  if (existingCase.courtAttendees) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text('Mættir eru:')
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.courtAttendees, {
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text('Krafa:')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.prosecutorDemands ?? 'Krafa ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Lagt er fram:')
    .text(' ')
    .font('Times-Roman')
    .text(`Krafa um ${caseTypes[existingCase.type]} þingmerkt nr. 1.`, {
      paragraphGap: 1,
    })
    .text('Rannsóknargögn málsins liggja frammi.', {
      paragraphGap: 1,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(`${courttDocument} þingmerkt nr. ${index + 2}.`, {
      paragraphGap: 1,
    }),
  )

  if (!existingCase.isAccusedAbsent) {
    doc
      .text(' ')
      .text(
        'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        {
          paragraphGap: 1,
        },
      )
  }

  doc
    .text(' ')
    .text(
      `${capitalize(
        formatAccusedByGender(existingCase.accusedGender, NounCases.DATIVE),
      )} er kynnt krafa á dómskjali nr. 1.`,
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
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
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      existingCase.litigationPresentations ?? 'Málflutningur ekki skráður.',
      {
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .font('Times-Bold')
    .text('Krafa')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.demands ?? 'Krafa ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Greinargerð um málsatvik')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.courtCaseFacts ?? 'Málsatvik ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Greinargerð um lagarök')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.courtLegalArguments ?? 'Lagarök ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Niðurstaða')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.ruling ?? 'Niðurstaða ekki skráð.', {
      paragraphGap: 1,
    })
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text('Úrskurðarorð', { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .text(existingCase.conclusion ?? 'Úrskurðarorð ekki skráð.', {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(
      `${existingCase.judge?.name ?? 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title ?? ''
      }`,
      {
        align: 'center',
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(' ')
    .font('Times-Roman')
    .text('Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.', {
      paragraphGap: 1,
    })
    .text(' ')
    .text(
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      `${formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi')} ${
        existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL
          ? existingCase.prosecutorAppealAnnouncement ?? ''
          : ''
      }`,
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      `${formatAppeal(existingCase.accusedAppealDecision, 'Varnaraðili')} ${
        existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
          ? existingCase.accusedAppealAnnouncement ?? ''
          : ''
      }`,
      {
        paragraphGap: 1,
      },
    )

  if (
    existingCase.type === CaseType.CUSTODY &&
    existingCase.decision === CaseDecision.ACCEPTING
  ) {
    const custodyRestrictions = formatCustodyRestrictions(
      existingCase.accusedGender,
      existingCase.custodyRestrictions,
      existingCase.validToDate,
      existingCase.isolationToDate,
    )

    if (custodyRestrictions) {
      doc.text(' ').text(custodyRestrictions, {
        paragraphGap: 1,
      })
    }

    doc
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
        {
          paragraphGap: 1,
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
    const alternativeTravelBanRestrictions = formatAlternativeTravelBanRestrictions(
      existingCase.accusedGender,
      existingCase.custodyRestrictions,
      existingCase.otherRestrictions,
    )

    if (alternativeTravelBanRestrictions) {
      doc.text(' ').text(alternativeTravelBanRestrictions, {
        paragraphGap: 1,
      })
    }

    doc
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd farbannsins undir dómara.',
        {
          paragraphGap: 1,
        },
      )
  }

  doc
    .text(' ')
    .text(
      `Vottur að þinghaldi er ${
        existingCase.registrar?.name ?? '(dómritari hefur ekki verið skráður)'
      } ${existingCase.registrar?.title ?? ''}.`,
      {
        paragraphGap: 1,
      },
    )

  doc
    .text(' ')
    .text(
      existingCase.courtEndTime
        ? `Þinghaldi lýkur kl. ${formatDate(existingCase.courtEndTime, 'p')}.`
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
      top: 70,
      bottom: 70,
      left: 70,
      right: 70,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc.translate(270, 70).scale(0.5)

  skjaldarmerki(doc)

  doc
    .fillColor('black')
    .scale(2)
    .translate(-270, -70)
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')
    .text(' ')

  doc
    .font('Times-Roman')
    .fontSize(18)
    .lineGap(4)
    .text(existingCase.court?.name ?? 'Dómstóll ekki skráður', {
      align: 'center',
    })
    .fontSize(14)
    .lineGap(2)
    .text('Þingbók og úrskurður', { align: 'center' })
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .fontSize(11)
    .lineGap(1)
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge?.name ?? '?'
      } ${existingCase.judge?.title ?? '?'} dómþing. Fyrir er tekið mál nr. ${
        existingCase.courtCaseNumber
      }. Þinghald hefst kl. ${formatDate(existingCase.courtStartDate, 'p')}.`,
      {
        paragraphGap: 1,
      },
    )

  if (existingCase.courtAttendees) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text('Mættir eru:')
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.courtAttendees, {
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text('Krafa:')
    .text(' ')
    .font('Times-Roman')
    .fontSize(12)
    .text(existingCase.prosecutorDemands ?? 'Krafa ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Lagt er fram:')
    .text(' ')
    .font('Times-Roman')
    .text(`Krafa um ${caseTypes[existingCase.type]} þingmerkt nr. 1.`, {
      paragraphGap: 1,
    })
    .text('Rannsóknargögn málsins liggja frammi.', {
      paragraphGap: 1,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(`${courttDocument} þingmerkt nr. ${index + 2}.`, {
      paragraphGap: 1,
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
      .text(
        'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        {
          paragraphGap: 1,
        },
      )
  }

  // Only show accused plea if applicable
  if (existingCase.accusedPleaDecision !== AccusedPleaDecision.NOT_APPLICABLE) {
    doc
      .text(' ')
      .text(
        `${capitalize(
          formatAccusedByGender(existingCase.accusedGender, NounCases.DATIVE),
        )} er kynnt krafa á dómskjali nr. 1.`,
        {
          paragraphGap: 1,
        },
      )
      .text(' ')
      .text(
        `${
          existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
            ? 'Varnaraðili samþykkir kröfuna. '
            : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
            ? 'Varnaraðili hafnar kröfunni. '
            : ''
        }${existingCase.accusedPleaAnnouncement ?? ''}`,
        {
          paragraphGap: 1,
        },
      )
  }

  doc
    .text(' ')
    .text(
      existingCase.litigationPresentations ?? 'Málflutningur ekki skráður.',
      {
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .font('Times-Bold')
    .text('Krafa')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.demands ?? 'Krafa ekki skráð', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Greinargerð um málsatvik')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.courtCaseFacts ?? 'Málsatvik ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Greinargerð um lagarök')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.courtLegalArguments ?? 'lagarök ekki skráð.', {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text('Niðurstaða')
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.ruling ?? 'Niðurstaða ekki skráð.', {
      paragraphGap: 1,
    })
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text('Úrskurðarorð', { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .text(existingCase.conclusion ?? 'Úrskurðarorð ekki skráð.', {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(
      `${existingCase.judge?.name ?? 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title ?? ''
      }`,
      {
        align: 'center',
        paragraphGap: 1,
      },
    )
    .text(' ')

  if (existingCase.sessionArrangements !== SessionArrangements.REMOTE_SESSION) {
    doc
      .text(' ')
      .font('Times-Roman')
      .text('Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.', {
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .text(
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      `${formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi')} ${
        existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL
          ? existingCase.prosecutorAppealAnnouncement ?? ''
          : ''
      }`,
      {
        paragraphGap: 1,
      },
    )

  // Only show accused appeal decision if applicable
  if (
    existingCase.accusedAppealDecision !== CaseAppealDecision.NOT_APPLICABLE
  ) {
    doc
      .text(' ')
      .text(
        `${formatAppeal(existingCase.accusedAppealDecision, 'Varnaraðili')} ${
          existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
            ? existingCase.accusedAppealAnnouncement ?? ''
            : ''
        }`,
        {
          paragraphGap: 1,
        },
      )
  }

  if (existingCase.sessionArrangements !== SessionArrangements.REMOTE_SESSION) {
    doc
      .text(' ')
      .text(
        `Vottur að þinghaldi er ${
          existingCase.registrar?.name ?? '(dómritari hefur ekki verið skráður)'
        } ${existingCase.registrar?.title ?? ''}.`,
        {
          paragraphGap: 1,
        },
      )
  }

  doc
    .text(' ')
    .text(
      existingCase.courtEndTime
        ? `Þinghaldi lýkur kl. ${formatDate(existingCase.courtEndTime, 'p')}.`
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
