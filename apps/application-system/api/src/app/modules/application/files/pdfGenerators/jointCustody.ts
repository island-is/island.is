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
import { JCAApplication } from '@island.is/application/templates/joint-custody-agreement'

const TEMPORARY = 'temporary'

export async function generateJointCustodyPdf(
  application: JCAApplication,
): Promise<PdfFile> {
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

  addSubheader(
    'Um réttaráhrif þess að barn hafi lögheimili hjá foreldri með sameiginlega forsjá:',
    doc,
  )
  addSubtitle(
    'Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Skráning lögheimilis hefur margvísleg áhrif á ýmsum réttarsviðum. Sem dæmi má nefna að skyldur sveitarfélaga til að veita þjónustu innan velferðarkerfisins, t.d. samkvæmt lögum um félagsþjónustu sveitarfélaga, lögum um leikskóla og lögum um grunnskóla. Önnur þjónusta miðast einnig við búsetu í tilteknu umdæmi svo samkvæmt lögum um málefni fatlaðra. Þá miða lagareglur stundum gagngert við lögheimili, t.d. lagaákvæði um birtingar í lögum um meðferð einkamála og sakamála og reglur barnaverndarlaga um samstarf og samþykki foreldra vegna tiltekinna ráðstafana.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Foreldrið sem barn er með lögheimili hjá, á rétt á að fá meðlag með barninu frá hinu foreldrinu.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Foreldrið sem barn á lögheimili hjá hefur stöðu einstæðs foreldris samvkæmt skattalögum. Barnabætur vegna barns greiðast framfæranda barns og er við mat á því hver telst framfærandi fyrst og fremst litið til þess hjá hverjum barn er skráð til lögheimilis í árslok hjá Þjóðskrá. Sjá nánar á www.rsk.is',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Um ákvarðanatöku foreldra með sameiginlega forsjá er fjallað í 28. gr. a barnalaga en þar segir:',
    doc,
  )
  addSubtitle(
    '„Þegar foreldrar fara sameiginlega með forsjá barns skulu þeir taka sameiginlega allar meiri háttar ákvarðanir sem varða barn. Ef foreldrar búa ekki saman hefur það foreldri sem barn á lögheimili hjá heimild til þess að taka afgerandi ákvarðanir um daglegt líf barnsins, svo sem um hvar barnið skuli eiga lögheimili innan lands, um val á leikskóla, grunnskóla og daggæslu, venjulega eða nauðsynlega heilbrigðisþjónustu og reglubundið tómstundastarf. Foreldrar sem fara saman með forsjá barns skulu þó ávallt leitast við að hafa samráð áður en þessum málefnum barns er ráðið til lykta. Ef annað forsjáforeldra barns er hindrað í að sinna forsjárskyldum sínum eru nauðsynlegar ákvarðanir hins um persónulega hagi barns gildar.“',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Samþykki beggja foreldra með sameiginlega forsjá þarf til þess að barn fari til útlanda. Hægt er að krefjast úrskurðar sýslumanns vegna ágreinins foreldra um utanlandsferð barns.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Þegar annað foreldra á umgengisrétt við barn samkvæmt samningi, úrskurði, dómi eða dómsátt, ber hvoru foreldri að tilkynna hinu með minnst sex vikna fyrirvara, ef foreldri hyggst flytja lögheimili sitt og/eða barnsins hvort sem er innan lands eða utan',
    doc,
  )
  addSubtitle(
    '* “Foreldrar“ eru hér einnig þeir stjúpforeldrar sem hafa fengið forsjá samvkæmt sérstökum samningi a grundvelli 29. gr. a. barnalaga',
    doc,
  )
  doc.moveDown()

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

  const content = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  const name = `${BucketTypePrefix[PdfTypes.JOINT_CUSTODY_AGREEMENT]}/${
    application.id
  }.pdf`

  return { content, name }
}
