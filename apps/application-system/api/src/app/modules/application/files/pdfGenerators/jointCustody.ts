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
import { JCAApplication } from '@island.is/application/templates/joint-custody-agreement'
import { addLegalEffect } from './familyMatters'

const TEMPORARY = 'temporary'

export async function generateJointCustodyPdf(application: JCAApplication) {
  const {
    answers,
    externalData: { nationalRegistry },
  } = application
  const applicant = nationalRegistry.data
  const { selectDuration, selectedChildren } = answers
  const durationType = selectDuration?.type
  const durationDate = selectDuration?.date
  const childrenAppliedFor = getSelectedChildrenFromExternalData(
    applicant.children,
    selectedChildren,
  )
  const otherParent = childrenAppliedFor[0].otherParent
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    answers.selectedChildren,
  )
  const currentParent = childResidenceInfo.current
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

  const doc = newDocument()

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addLogo(doc, DistrictCommissionerLogo)

  addHeader(
    'Samningur foreldra um sameiginlega forsjá, lögheimili og meðlag',
    doc,
  )

  addSubheader(
    'skv. 32.gr. barnalaga nr. 76/2003 og meðlag skv. 55 gr barnalaga',
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

  addSubheader('Foreldrar sem gera samninginn', doc)
  addValue(`${applicant.fullName}, ${formatSsn(applicant.nationalId)}`, doc)
  addValue(`${formatAddress(applicant.address)}`, doc)
  doc.moveDown()
  addValue(`${otherParent.fullName}, ${formatSsn(otherParent.nationalId)}`, doc)
  addValue(`${formatAddress(otherParent.address)}`, doc)
  doc.moveDown()

  addSubheader('Breyting á forsjá', doc)
  addValue(`Núverandi lögheimilisforeldri er ${currentParent.parentName}`, doc)
  addValue('Forsjá verður sameiginleg', doc)
  addValue(`Lögheimilisforeldri verður ${currentParent.parentName}`, doc)
  doc.moveDown()

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
    `Fyrirspurn og uppfletting í gögnum Þjóðskrár fór fram ${nationalRegistryLookupDate} ${nationalRegistryLookupTime} með heimild undirritaðrar.`,
    doc,
  )

  doc.end()

  return await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })
}
