import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  Gender,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatDate,
  lowercase,
  formatAppeal,
  formatRequestCaseType,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { core, ruling } from '../messages'
import {
  baseFontSize,
  mediumFontSize,
  largeFontSize,
  setPageNumbers,
} from './pdfHelpers'
import { writeFile } from './writeFile'
import { skjaldarmerki } from './skjaldarmerki'

function constructRestrictionRulingPdf(
  existingCase: Case,
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
    .fontSize(largeFontSize)
    .lineGap(4)
    .text(existingCase.court?.name ?? formatMessage(core.missing.court), {
      align: 'center',
    })
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
        caseNumber: existingCase.courtCaseNumber,
      }),
      { align: 'center' },
    )
    .fontSize(baseFontSize)
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
        align: 'justify',
        paragraphGap: 1,
      },
    )

  if (!existingCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      align: 'justify',
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
        caseTypes: formatRequestCaseType(existingCase.type),
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

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
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

  if (existingCase.accusedBookings) {
    doc.text(' ').text(existingCase.accusedBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      existingCase.litigationPresentations ??
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
      .text(
        existingCase.prosecutorDemands ?? formatMessage(core.missing.demands),
        {
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtCaseFactsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(
        existingCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts),
        {
          align: 'justify',
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
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.conclusionHeading))
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.ruling ?? formatMessage(core.missing.conclusion), {
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
    .text(existingCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'justify',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(existingCase.judge?.name ?? formatMessage(core.missing.judge), {
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
    existingCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      existingCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = existingCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    doc.text(' ').text(prosecutorAppeal, { align: 'justify', paragraphGap: 1 })
  }

  // TODO defendants: handle multiple defendants
  const accusedGender =
    existingCase.defendants && existingCase.defendants[0].gender

  let accusedAppeal = formatAppeal(
    existingCase.accusedAppealDecision,
    capitalize(
      formatMessage(core.accused, {
        suffix: accusedGender === Gender.MALE ? 'i' : 'a ',
      }),
    ),
    accusedGender,
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      existingCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = existingCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    doc.text(' ').text(accusedAppeal, { align: 'justify', paragraphGap: 1 })
  }

  if (existingCase.endOfSessionBookings) {
    doc.text(' ').text(existingCase.endOfSessionBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  if (existingCase.registrar) {
    doc.text(' ').text(
      formatMessage(ruling.registrarWitness, {
        registrarNameAndTitle: `${existingCase.registrar.name} ${existingCase.registrar.title}`,
      }),
      {
        align: 'justify',
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

function constructInvestigationRulingPdf(
  existingCase: Case,
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
    .fontSize(largeFontSize)
    .lineGap(4)
    .text(existingCase.court?.name ?? formatMessage(core.missing.court), {
      align: 'center',
    })
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
        caseNumber: existingCase.courtCaseNumber,
      }),
      { align: 'center' },
    )
    .fontSize(baseFontSize)
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
        align: 'justify',
        paragraphGap: 1,
      },
    )

  if (!existingCase.isClosedCourtHidden) {
    doc.text(' ').text(formatMessage(ruling.closedCourtAnnouncement), {
      align: 'justify',
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
        caseTypes: formatRequestCaseType(existingCase.type),
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

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
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

  if (existingCase.accusedBookings) {
    doc.text(' ').text(existingCase.accusedBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  doc
    .text(' ')
    .text(
      existingCase.litigationPresentations ??
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
      .text(
        existingCase.prosecutorDemands ?? formatMessage(core.missing.demands),
        {
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.courtCaseFactsHeading))
      .text(' ')
      .font('Times-Roman')
      .text(
        existingCase.courtCaseFacts ?? formatMessage(core.missing.caseFacts),
        {
          align: 'justify',
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
          align: 'justify',
          paragraphGap: 1,
        },
      )
      .text(' ')
      .font('Times-Bold')
      .text(formatMessage(ruling.conclusionHeading))
      .text(' ')
      .font('Times-Roman')
      .text(existingCase.ruling ?? formatMessage(core.missing.conclusion), {
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
    .text(existingCase.conclusion ?? formatMessage(core.missing.rulingText), {
      align: 'justify',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Bold')
    .text(existingCase.judge?.name ?? formatMessage(core.missing.judge), {
      align: 'center',
      paragraphGap: 1,
    })
    .text(' ')
    .font('Times-Roman')
    .text(formatMessage(ruling.rulingTextIntro), {
      align: 'justify',
      paragraphGap: 1,
    })

  if (existingCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
    doc.text(' ').text(formatMessage(ruling.appealDirections), {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  let prosecutorAppeal = formatAppeal(
    existingCase.prosecutorAppealDecision,
    'Sækjandi',
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      existingCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = existingCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    doc.text(' ').text(prosecutorAppeal, { align: 'justify', paragraphGap: 1 })
  }

  let accusedAppeal = formatAppeal(
    existingCase.accusedAppealDecision,
    'Varnaraðili',
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      existingCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = existingCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    doc.text(' ').text(accusedAppeal, { align: 'justify', paragraphGap: 1 })
  }

  if (existingCase.endOfSessionBookings) {
    doc.text(' ').text(existingCase.endOfSessionBookings, {
      align: 'justify',
      paragraphGap: 1,
    })
  }

  if (existingCase.registrar) {
    doc.text(' ').text(
      formatMessage(ruling.registrarWitness, {
        registrarNameAndTitle: `${existingCase.registrar.name} ${existingCase.registrar.title}`,
      }),
      {
        align: 'justify',
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
  shortVersion: boolean,
): streamBuffers.WritableStreamBuffer {
  return isRestrictionCase(existingCase.type)
    ? constructRestrictionRulingPdf(existingCase, formatMessage, shortVersion)
    : constructInvestigationRulingPdf(existingCase, formatMessage, shortVersion)
}

export async function getRulingPdfAsString(
  existingCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
): Promise<string> {
  const stream = constructRulingPdf(existingCase, formatMessage, shortVersion)

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

export async function getRulingPdfAsBuffer(
  existingCase: Case,
  formatMessage: FormatMessage,
  shortVersion: boolean,
): Promise<Buffer> {
  const stream = constructRulingPdf(existingCase, formatMessage, shortVersion)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
