import { addSubheader, addSubtitle } from '../utils/pdfUtils'

export const addLegalEffect = (doc: PDFKit.PDFDocument) => {
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
}
