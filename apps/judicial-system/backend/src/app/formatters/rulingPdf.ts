import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
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
  lowercase,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { core, ruling } from '../messages'
import { formatAppeal } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'
import { skjaldarmerki } from './skjaldarmerki'

function constructRestrictionRulingPdf(
  existingCase: Case,
  formatMessage: FormatMessage,
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
    .text(existingCase.court?.name ?? formatMessage(core.missing.court), {
      align: 'center',
    })
    .fontSize(14)
    .lineGap(2)
    .text(formatMessage(ruling.proceedingsHeading), { align: 'center' })
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .fontSize(11)
    .lineGap(1)
    .text(
      formatMessage(ruling.intro, {
        courtDate: formatDate(existingCase.courtStartDate, 'PPP'),
        judgeNameAndTitle: `${existingCase.judge?.name ?? '?'} ${
          existingCase.judge?.title ?? '?'
        }`,
        courtLocation: existingCase.courtLocation
          ? ` ${lowercase(
              existingCase.courtLocation?.slice(
                existingCase.courtLocation.length - 1,
              ) === '.'
                ? existingCase.courtLocation?.slice(0, -1)
                : existingCase.courtLocation,
            )}`
          : '',
        caseNumber: existingCase.courtCaseNumber,
        startTime: formatDate(existingCase.courtStartDate, 'p'),
      }),
      {
        paragraphGap: 1,
      },
    )

  if (!existingCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      paragraphGap: 1,
    })
  }

  if (existingCase.courtAttendees?.trim()) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.attendeesHeading))
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.courtAttendees, {
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.demandsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(
      existingCase.prosecutorDemands ?? formatMessage(core.missing.demands),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDocuments.heading))
    .text(' ')
    .font('Times-Roman')
    .text(
      formatMessage(ruling.courtDocuments.request, {
        caseTypes: caseTypes[existingCase.type],
      }),
      {
        paragraphGap: 1,
      },
    )
    .text(formatMessage(ruling.courtDocuments.announcement), {
      paragraphGap: 1,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(
      formatMessage(ruling.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
      {
        paragraphGap: 1,
      },
    ),
  )

  if (!existingCase.isAccusedRightsHidden) {
    doc.text(' ').text(formatMessage(ruling.accusedRights), {
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      formatMessage(ruling.accusedDemandsIntro, {
        accused: capitalize(
          formatAccusedByGender(existingCase.accusedGender, NounCases.DATIVE),
        ),
      }),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      `${
        existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
          ? formatMessage(ruling.accusedPlea.accept, {
              accused: capitalize(
                formatAccusedByGender(existingCase.accusedGender),
              ),
            })
          : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
          ? formatMessage(ruling.accusedPlea.reject, {
              accused: capitalize(
                formatAccusedByGender(existingCase.accusedGender),
              ),
            })
          : ''
      } ${existingCase.accusedPleaAnnouncement ?? ''}`,
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .text(
      existingCase.litigationPresentations ??
        formatMessage(core.missing.litigationPresentations),
      {
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text(formatMessage(ruling.rulingHeading), { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDemandsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.demands ?? formatMessage(core.missing.demands), {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtCaseFactsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(
      existingCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtLegalArgumentsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(
      existingCase.courtLegalArguments ??
        formatMessage(core.missing.legalArguments),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.conclusionHeading))
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.ruling ?? formatMessage(core.missing.conclusion), {
      paragraphGap: 1,
    })
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text(formatMessage(ruling.rulingTextHeading), { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .text(existingCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(
      `${existingCase.judge?.name ?? formatMessage(core.missing.judge)} ${
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
    .text(formatMessage(ruling.rulingTextIntro), {
      paragraphGap: 1,
    })
    .text(' ')
    .text(formatMessage(ruling.appealDirections), {
      paragraphGap: 1,
    })
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
    )

    if (custodyRestrictions) {
      doc.text(' ').text(custodyRestrictions, {
        paragraphGap: 1,
      })
    }

    doc.text(' ').text(formatMessage(ruling.accusedCustodyDirections), {
      paragraphGap: 1,
    })
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

    doc.text(' ').text(formatMessage(ruling.accusedTravelBanDirections), {
      paragraphGap: 1,
    })
  }

  doc.text(' ').text(
    formatMessage(ruling.registratWitness, {
      registrarNameAndTitle: `${existingCase.registrar?.name ?? '?'} ${
        existingCase.registrar?.title ?? ''
      }`,
    }),
    {
      paragraphGap: 1,
    },
  )

  doc.text(' ').text(
    existingCase.courtEndTime
      ? formatMessage(ruling.signOff, {
          endTime: formatDate(existingCase.courtEndTime, 'p'),
        })
      : formatMessage(ruling.inSession),
  )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationRulingPdf(
  existingCase: Case,
  formatMessage: FormatMessage,
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
    .text(existingCase.court?.name ?? formatMessage(core.missing.court), {
      align: 'center',
    })
    .fontSize(14)
    .lineGap(2)
    .text(formatMessage(ruling.proceedingsHeading), { align: 'center' })
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .fontSize(11)
    .lineGap(1)
    .text(
      formatMessage(ruling.intro, {
        courtDate: formatDate(existingCase.courtStartDate, 'PPP'),
        judgeNameAndTitle: `${existingCase.judge?.name ?? '?'} ${
          existingCase.judge?.title ?? '?'
        }`,
        courtLocation: existingCase.courtLocation
          ? ` ${lowercase(
              existingCase.courtLocation?.slice(
                existingCase.courtLocation.length - 1,
              ) === '.'
                ? existingCase.courtLocation?.slice(0, -1)
                : existingCase.courtLocation,
            )}`
          : '',
        caseNumber: existingCase.courtCaseNumber,
        startTime: formatDate(existingCase.courtStartDate, 'p'),
      }),
      {
        paragraphGap: 1,
      },
    )

  if (!existingCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      paragraphGap: 1,
    })
  }

  if (existingCase.courtAttendees?.trim()) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.attendeesHeading))
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.courtAttendees, {
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.demandsHeading))
    .text(' ')
    .font('Times-Roman')
    .fontSize(12)
    .text(
      existingCase.prosecutorDemands ?? formatMessage(core.missing.demands),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDocuments.heading))
    .text(' ')
    .font('Times-Roman')
    .text(
      formatMessage(ruling.courtDocuments.request, {
        caseTypes: caseTypes[existingCase.type],
      }),
      {
        paragraphGap: 1,
      },
    )
    .text(formatMessage(ruling.courtDocuments.announcement), {
      paragraphGap: 1,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(
      formatMessage(ruling.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
      {
        paragraphGap: 1,
      },
    ),
  )

  if (
    !areAccusedRightsHidden(
      existingCase.isAccusedRightsHidden,
      existingCase.sessionArrangements,
    )
  ) {
    doc.text(' ').text(formatMessage(ruling.accusedRights), {
      paragraphGap: 1,
    })
  }

  // Only show accused plea if applicable
  if (existingCase.accusedPleaDecision !== AccusedPleaDecision.NOT_APPLICABLE) {
    doc
      .text(' ')
      .text(
        formatMessage(ruling.accusedDemandsIntro, {
          accused: capitalize(
            formatAccusedByGender(existingCase.accusedGender, NounCases.DATIVE),
          ),
        }),
        {
          paragraphGap: 1,
        },
      )
      .text(' ')
      .text(
        `${
          existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
            ? formatMessage(ruling.accusedPlea.accept, {
                accused: 'Varnaraðili',
              })
            : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
            ? formatMessage(ruling.accusedPlea.reject, {
                accused: 'Varnaraðili',
              })
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
      existingCase.litigationPresentations ??
        formatMessage(core.missing.litigationPresentations),
      {
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text(formatMessage(ruling.rulingHeading), { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDemandsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.demands ?? formatMessage(core.missing.demands), {
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtCaseFactsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(
      existingCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtLegalArgumentsHeading))
    .text(' ')
    .font('Times-Roman')
    .text(
      existingCase.courtLegalArguments ??
        formatMessage(core.missing.legalArguments),
      {
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.conclusionHeading))
    .text(' ')
    .font('Times-Roman')
    .text(existingCase.ruling ?? formatMessage(core.missing.conclusion), {
      paragraphGap: 1,
    })
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(14)
    .lineGap(16)
    .text(formatMessage(ruling.rulingTextHeading), { align: 'center' })
    .fontSize(11)
    .lineGap(1)
    .text(existingCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(
      `${existingCase.judge?.name ?? formatMessage(core.missing.judge)} ${
        existingCase.judge?.title ?? ''
      }`,
      {
        align: 'center',
        paragraphGap: 1,
      },
    )
    .text(' ')
    .font('Times-Roman')

  if (existingCase.sessionArrangements !== SessionArrangements.REMOTE_SESSION) {
    doc.text(' ').text(formatMessage(ruling.rulingTextIntro), {
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(formatMessage(ruling.appealDirections), {
      paragraphGap: 1,
    })
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
    doc.text(' ').text(
      formatMessage(ruling.registratWitness, {
        registrarNameAndTitle: `${existingCase.registrar?.name ?? '?'} ${
          existingCase.registrar?.title ?? ''
        }`,
      }),
      {
        paragraphGap: 1,
      },
    )
  }

  doc.text(' ').text(
    existingCase.courtEndTime
      ? formatMessage(ruling.signOff, {
          endTime: formatDate(existingCase.courtEndTime, 'p'),
        })
      : formatMessage(ruling.inSession),
  )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructRulingPdf(
  existingCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return existingCase.type === CaseType.CUSTODY ||
    existingCase.type === CaseType.TRAVEL_BAN
    ? constructRestrictionRulingPdf(existingCase, formatMessage)
    : constructInvestigationRulingPdf(existingCase, formatMessage)
}

export async function getRulingPdfAsString(
  existingCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructRulingPdf(existingCase, formatMessage)

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
