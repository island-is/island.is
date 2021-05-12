import streamBuffers from 'stream-buffers'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import {
  formatAddress,
  formatDate,
  getSelectedChildrenFromExternalData,
  childrenResidenceInfo,
} from '@island.is/application/templates/family-matters-core/utils'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { BucketTypePrefix, PdfConstants } from '../utils/constants'
import { DistrictCommissionerLogo } from '../utils/districtCommissionerLogo'
import {
  addHeader,
  addSubtitle,
  addValue,
  addSubheader,
  formatSsn,
  newDocument,
  addLogo,
} from '../utils/pdfUtils'
import { PdfFile } from '../utils/types'
import { PdfTypes } from '@island.is/application/core'
import { addLegalEffect } from './familyMatters'

const TEMPORARY = 'temporary'

export async function generateResidenceChangePdf(
  application: CRCApplication,
): Promise<PdfFile> {
  const {
    answers,
    externalData: { nationalRegistry },
  } = application
  const applicant = nationalRegistry.data
  const nationalRegistryLookupDate = format(
    parseISO(nationalRegistry.date),
    'd. MMMM y',
    { locale: is },
  )
  const nationalRegistryLookupTime = format(
    parseISO(nationalRegistry.date),
    'p',
    { locale: is },
  )
  const { selectDuration, residenceChangeReason, selectedChildren } = answers
  const durationType = selectDuration?.type
  const durationDate = selectDuration?.date
  const reason = residenceChangeReason
  const childrenAppliedFor = getSelectedChildrenFromExternalData(
    applicant.children,
    selectedChildren,
  )
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    answers.selectedChildren,
  )
  const currentParent = childResidenceInfo.current
  const futureParent = childResidenceInfo.future

  const doc = newDocument()
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addLogo(doc, DistrictCommissionerLogo)

  addHeader(
    'Samningur foreldra með sameiginlega forsjá um breytt lögheimili barns og meðlag',
    doc,
  )

  addSubheader(
    'skv. 32.gr. barnalaga nr. 76/2003',
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  addSubheader('Barn/börn undir 18 ára aldri sem erindið varðar', doc)
  childrenAppliedFor.map((c, i) =>
    addValue(
      `${c.fullName}, ${formatSsn(c.nationalId)}`,
      doc,
      PdfConstants.NORMAL_FONT,
      i === childrenAppliedFor.length - 1
        ? PdfConstants.LARGE_LINE_GAP
        : PdfConstants.NO_LINE_GAP,
    ),
  )

  addSubheader('Núverandi lögheimilisforeldri', doc)
  addValue(
    `${currentParent.parentName}, ${formatSsn(currentParent.nationalId)}`,
    doc,
  )
  addValue(
    `${formatAddress(currentParent.address)}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  addSubheader('Nýtt lögheimilisforeldri', doc)
  addValue(
    `${futureParent.parentName}, ${formatSsn(futureParent.nationalId)}`,
    doc,
  )
  addValue(
    `${formatAddress(futureParent.address)}`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  if (reason) {
    addSubheader('Tilefni breytingar', doc)

    addValue(reason, doc, PdfConstants.NORMAL_FONT, PdfConstants.LARGE_LINE_GAP)
  }

  addSubheader('Gildistími samnings', doc)
  addValue(
    durationType === TEMPORARY && durationDate
      ? `Samningurinn gildir til ${formatDate(durationDate)}`
      : 'Samningurinn er varanlegur þar til barnið hefur náð 18 ára aldri.',
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.LARGE_LINE_GAP,
  )

  addSubheader('Samkomulag um meðlag', doc)
  addValue(
    `${currentParent.parentName} greiðir einfalt meðlag með hverju barni til nýs lögheimilisforeldris. Ef foreldrar greiða aukið meðlag þarf að semja að nýju og leita staðfestingar sýslumanns.`,
    doc,
    PdfConstants.NORMAL_FONT,
    PdfConstants.NORMAL_LINE_GAP,
  )

  doc.moveDown()

  addLegalEffect(doc)

  addSubtitle(
    `Undirritaður málshefjandi, ${applicant.fullName}, heimilaði fyrirspurn og uppflettingu í forsjárgögnum hjá Þjóðskrá Íslands þann ${nationalRegistryLookupDate} kl. ${nationalRegistryLookupTime}.`,
    doc,
  )
  doc.moveDown()

  addSubtitle(
    `Niðurstaða uppflettingar var að ${
      currentParent.parentName
    } (kt. ${formatSsn(currentParent.nationalId)}) og ${
      futureParent.parentName
    } (kt. ${formatSsn(
      futureParent.nationalId,
    )}) eru með sameiginlega forsjá með þeim börnum sem erindið varðar. Lögheimilisforeldri á tíma uppflettingar er ${
      currentParent.parentName
    }.`,
    doc,
  )
  doc.moveDown()

  addSubtitle(
    'Báðir foreldrar staðfesta með undirritun sinni að ofangreindar upplýsingar eru réttar.',
    doc,
  )
  doc.end()

  const content = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  const name = `${BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]}/${
    application.id
  }.pdf`

  return { content, name }
}
