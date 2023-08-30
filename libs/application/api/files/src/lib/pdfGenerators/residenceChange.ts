import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import {
  formatAddress,
  formatDate,
  getSelectedChildrenFromExternalData,
  childrenResidenceInfo,
  sortChildrenByAge,
} from '@island.is/application/templates/family-matters-core/utils'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { PdfConstants } from '../utils/constants'
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
import { addLegalEffect } from './familyMatters'

const TEMPORARY = 'temporary'

export async function generateResidenceChangePdf(application: CRCApplication) {
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
    application.externalData.childrenCustodyInformation.data,
    selectedChildren,
  )
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    application.externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )
  const currentParent = childResidenceInfo.current
  if (currentParent === null) {
    throw new Error('Cannot Render Pdf Current parent is null')
  }
  const futureParent = childResidenceInfo.future
  if (futureParent === null) {
    throw new Error('Cannot Render Pdf Future parent is null')
  }

  const doc = newDocument()
  const buffers: Buffer[] = []

  doc.on('data', (buffer: Buffer) => {
    buffers.push(buffer)
  })

  // Pipe to file first, before adding content.

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
  sortChildrenByAge(childrenAppliedFor).map((c, i) =>
    addValue(
      `${c.fullName}, ${formatSsn(c.nationalId)}`,
      doc,
      PdfConstants.NORMAL_FONT,
      i === childrenAppliedFor.length - 1
        ? PdfConstants.LARGE_LINE_GAP
        : PdfConstants.NO_LINE_GAP,
    ),
  )

  addSubheader('Núverandi lögheimilisforeldri skv. Þjóðskrá Íslands', doc)
  addValue(
    `${currentParent?.parentName}, ${formatSsn(currentParent.nationalId)}`,
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
      ? `Samningurinn gildir til ${formatDate({ date: durationDate })}`
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

  await new Promise((resolve) => {
    doc.on('end', resolve)
  })

  return Buffer.concat(buffers)
}
