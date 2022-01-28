import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatDate,
  lowercase,
  formatAppeal,
  formatRequestCaseType,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { core, ruling } from '../messages'
import {
  baseFontSize,
  mediumFontSize,
  setPageNumbers,
  addCoatOfArms,
  addLargeHeading,
} from './pdfHelpers'
import { writeFile } from './writeFile'

function constructRestrictionRulingPdf(
  theCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
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
    doc.info['Title'] = shortVersion ? 'Þingbók' : 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addCoatOfArms(doc)
  doc.text(' ').text(' ').text(' ').text(' ').text(' ').lineGap(4)
  addLargeHeading(
    doc,
    'Times-Roman',
    theCase.court?.name ?? formatMessage(core.missing.court),
  )
  doc
    .fontSize(mediumFontSize)
    .lineGap(2)
    .text(
      formatMessage(
        shortVersion
          ? ruling.proceedingsHeadingShortVersion
          : ruling.proceedingsHeading,
      ),
      { align: 'center' },
    )
    .lineGap(30)
    .text(
      formatMessage(ruling.caseNumber, {
        caseNumber: theCase.courtCaseNumber,
      }),
      { align: 'center' },
    )
    .fontSize(baseFontSize)
    .lineGap(1)
    .text(
      formatMessage(ruling.intro, {
        courtDate: formatDate(theCase.courtStartDate, 'PPP'),
        judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${
          theCase.judge?.title ?? '?'
        }`,
        courtLocation: theCase.courtLocation
          ? ` ${lowercase(
              theCase.courtLocation?.slice(theCase.courtLocation.length - 1) ===
                '.'
                ? theCase.courtLocation?.slice(0, -1)
                : theCase.courtLocation,
            )}`
          : '',
        caseNumber: theCase.courtCaseNumber,
        startTime: formatDate(theCase.courtStartDate, 'p'),
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )

  if (!theCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      `${formatMessage(ruling.prosecutorIs)} ${
        theCase.prosecutor?.institution?.name ?? ruling.noDistrict
      }.`,
    )
    .text(
      `${formatMessage(ruling.defendantIs, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
        isSuffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'u' : '',
      })}${
        theCase.defendants?.reduce(
          (acc, defendant, index) =>
            `${acc}${
              index === 0
                ? ''
                : index + 1 === theCase.defendants?.length
                ? ', og'
                : ','
            } ${defendant.name ?? '-'}, kt. ${formatNationalId(
              defendant.nationalId ?? '-',
            )}`,
          '',
        ) ?? ` ${ruling.noDefendants}`
      }.`,
    )

  if (theCase.courtAttendees?.trim()) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.attendeesHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.courtAttendees, {
        align: 'justify',
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDocuments.heading))
    .text(' ')
    .font('Times-Roman')
    .text(
      formatMessage(ruling.courtDocuments.request, {
        caseTypes: formatRequestCaseType(theCase.type),
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
    .text(formatMessage(ruling.courtDocuments.announcement), {
      align: 'justify',
      paragraphGap: 1,
    })

  theCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(
      formatMessage(ruling.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    ),
  )

  if (theCase.accusedBookings) {
    doc.text(' ').text(theCase.accusedBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      theCase.litigationPresentations ??
        formatMessage(core.missing.litigationPresentations),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(mediumFontSize)
    .lineGap(16)
    .text(formatMessage(ruling.rulingHeading), { align: 'center' })

  if (shortVersion) {
    doc
      .fontSize(baseFontSize)
      .lineGap(1)
      .text(formatMessage(ruling.rulingShortVersionPlaceholder), {
        align: 'center',
      })
  } else {
    doc
      .fontSize(baseFontSize)
      .lineGap(1)
      .font('Times-Bold')
      .text(formatMessage(ruling.courtDemandsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.prosecutorDemands ?? formatMessage(core.missing.demands), {
        align: 'justify',
        paragraphGap: 1,
      })
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtCaseFactsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts), {
        align: 'justify',
        paragraphGap: 1,
      })
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtLegalArgumentsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(
        theCase.courtLegalArguments ??
          formatMessage(core.missing.legalArguments),
        {
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.conclusionHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.ruling ?? formatMessage(core.missing.conclusion), {
        align: 'justify',
        paragraphGap: 1,
      })
  }

  doc
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(mediumFontSize)
    .lineGap(16)
    .text(formatMessage(ruling.rulingTextHeading), { align: 'center' })
    .fontSize(baseFontSize)
    .lineGap(1)
    .text(theCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'justify',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(theCase.judge?.name ?? formatMessage(core.missing.judge), {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .text(' ')
    .font('Times-Roman')
    .text(formatMessage(ruling.rulingTextIntro), {
      align: 'justify',
      paragraphGap: 1,
    })
    .text(' ')
    .text(formatMessage(ruling.appealDirections), {
      align: 'justify',
      paragraphGap: 1,
    })

  let prosecutorAppeal = formatAppeal(
    theCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      theCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = theCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    doc.text(' ').text(prosecutorAppeal, { align: 'justify', paragraphGap: 1 })
  }

  let accusedAppeal = formatAppeal(
    theCase.accusedAppealDecision,
    capitalize(
      formatMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants?.length > 1 ? 'ar' : 'i',
      }),
    ),
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      theCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = theCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    doc.text(' ').text(accusedAppeal, { align: 'justify', paragraphGap: 1 })
  }

  if (theCase.endOfSessionBookings) {
    doc.text(' ').text(theCase.endOfSessionBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  if (theCase.registrar) {
    doc.text(' ').text(
      formatMessage(ruling.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${theCase.registrar.title}`,
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
  }

  doc.text(' ').text(
    theCase.courtEndTime
      ? formatMessage(ruling.signOff, {
          endTime: formatDate(theCase.courtEndTime, 'p'),
        })
      : formatMessage(ruling.inSession),
  )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationRulingPdf(
  theCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
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
    doc.info['Title'] = shortVersion ? 'Þingbók' : 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addCoatOfArms(doc)
  doc.text(' ').text(' ').text(' ').text(' ').text(' ').lineGap(4)
  addLargeHeading(
    doc,
    'Times-Roman',
    theCase.court?.name ?? formatMessage(core.missing.court),
  )
  doc
    .fontSize(mediumFontSize)
    .lineGap(2)
    .text(
      formatMessage(
        shortVersion
          ? ruling.proceedingsHeadingShortVersion
          : ruling.proceedingsHeading,
      ),
      { align: 'center' },
    )
    .lineGap(30)
    .text(
      formatMessage(ruling.caseNumber, {
        caseNumber: theCase.courtCaseNumber,
      }),
      { align: 'center' },
    )
    .fontSize(baseFontSize)
    .lineGap(1)
    .text(
      formatMessage(ruling.intro, {
        courtDate: formatDate(theCase.courtStartDate, 'PPP'),
        judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${
          theCase.judge?.title ?? '?'
        }`,
        courtLocation: theCase.courtLocation
          ? ` ${lowercase(
              theCase.courtLocation?.slice(theCase.courtLocation.length - 1) ===
                '.'
                ? theCase.courtLocation?.slice(0, -1)
                : theCase.courtLocation,
            )}`
          : '',
        caseNumber: theCase.courtCaseNumber,
        startTime: formatDate(theCase.courtStartDate, 'p'),
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )

  if (!theCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      `${formatMessage(ruling.prosecutorIs)} ${
        theCase.prosecutor?.institution?.name ?? ruling.noDistrict
      }.`,
    )
    .text(
      `${formatMessage(ruling.defendantIs, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
        isSuffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'u' : '',
      })}${
        theCase.defendants?.reduce(
          (acc, defendant, index) =>
            `${acc}${
              index === 0
                ? ''
                : index + 1 === theCase.defendants?.length
                ? ', og'
                : ','
            } ${defendant.name ?? '-'}, kt. ${formatNationalId(
              defendant.nationalId ?? '-',
            )}`,
          '',
        ) ?? ` ${ruling.noDefendants}`
      }.`,
    )

  if (theCase.courtAttendees?.trim()) {
    doc
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.attendeesHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.courtAttendees, {
        align: 'justify',
        paragraphGap: 1,
      })
  }

  doc
    .text(' ')
    .font('Times-Bold')
    .text(formatMessage(ruling.courtDocuments.heading))
    .text(' ')
    .font('Times-Roman')
    .text(
      formatMessage(ruling.courtDocuments.request, {
        caseTypes: formatRequestCaseType(theCase.type),
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
    .text(formatMessage(ruling.courtDocuments.announcement), {
      align: 'justify',
      paragraphGap: 1,
    })

  theCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(
      formatMessage(ruling.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    ),
  )

  if (theCase.accusedBookings) {
    doc.text(' ').text(theCase.accusedBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      theCase.litigationPresentations ??
        formatMessage(core.missing.litigationPresentations),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(mediumFontSize)
    .lineGap(16)
    .text(formatMessage(ruling.rulingHeading), { align: 'center' })

  if (shortVersion) {
    doc
      .fontSize(baseFontSize)
      .lineGap(1)
      .text(formatMessage(ruling.rulingShortVersionPlaceholder), {
        align: 'center',
      })
  } else {
    doc
      .fontSize(baseFontSize)
      .lineGap(1)
      .font('Times-Bold')
      .text(formatMessage(ruling.courtDemandsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.prosecutorDemands ?? formatMessage(core.missing.demands), {
        align: 'justify',
        paragraphGap: 1,
      })
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtCaseFactsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts), {
        align: 'justify',
        paragraphGap: 1,
      })
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtLegalArgumentsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(
        theCase.courtLegalArguments ??
          formatMessage(core.missing.legalArguments),
        {
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.conclusionHeading))
      .text(' ')
      .font('Times-Roman')
      .text(theCase.ruling ?? formatMessage(core.missing.conclusion), {
        align: 'justify',
        paragraphGap: 1,
      })
  }

  doc
    .lineGap(3)
    .text(' ')
    .text(' ')
    .fontSize(mediumFontSize)
    .lineGap(16)
    .text(formatMessage(ruling.rulingTextHeading), { align: 'center' })
    .fontSize(baseFontSize)
    .lineGap(1)
    .text(theCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'justify',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(theCase.judge?.name ?? formatMessage(core.missing.judge), {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Roman')
    .text(formatMessage(ruling.rulingTextIntro), {
      align: 'justify',
      paragraphGap: 1,
    })

  if (theCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
    doc.text(' ').text(formatMessage(ruling.appealDirections), {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  let prosecutorAppeal = formatAppeal(
    theCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      theCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = theCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    doc.text(' ').text(prosecutorAppeal, { align: 'justify', paragraphGap: 1 })
  }

  let accusedAppeal = formatAppeal(
    theCase.accusedAppealDecision,
    capitalize(
      formatMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants?.length > 1 ? 'ar' : 'i',
      }),
    ),
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      theCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = theCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    doc.text(' ').text(accusedAppeal, { align: 'justify', paragraphGap: 1 })
  }

  if (theCase.endOfSessionBookings) {
    doc.text(' ').text(theCase.endOfSessionBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  if (theCase.registrar) {
    doc.text(' ').text(
      formatMessage(ruling.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${theCase.registrar.title}`,
      }),
      {
        align: 'justify',
        paragraphGap: 1,
      },
    )
  }

  doc.text(' ').text(
    theCase.courtEndTime
      ? formatMessage(ruling.signOff, {
          endTime: formatDate(theCase.courtEndTime, 'p'),
        })
      : formatMessage(ruling.inSession),
  )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructRulingPdf(
  theCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
): streamBuffers.WritableStreamBuffer {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionRulingPdf(theCase, formatMessage, shortVersion)
    : constructInvestigationRulingPdf(theCase, formatMessage, shortVersion)
}

export async function getRulingPdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
): Promise<string> {
  const stream = constructRulingPdf(theCase, formatMessage, shortVersion)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}

export async function getRulingPdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
): Promise<Buffer> {
  const stream = constructRulingPdf(theCase, formatMessage, shortVersion)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
