import { CaseCustodyProvisions } from '@island.is/judicial-system/types'

export const custodyProvisions = [
  {
    title: 'a-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_A,
    info:
      'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
  },
  {
    title: 'b-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_B,
    info:
      'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
  },
  {
    title: 'c-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_C,
    info:
      'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
  },
  {
    title: 'd-lið 1. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_1_D,
    info:
      'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
  },
  {
    title: '2. mgr. 95. gr.',
    id: CaseCustodyProvisions._95_2,
    info:
      'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
  },
  {
    title: '2. mgr. 98. gr',
    id: CaseCustodyProvisions._98_2,
    info:
      'Nú er þess krafist að sakborningur skuli sæta einangrun í gæsluvarðhaldi skv. b-lið 1. mgr. 99. gr. og á dómari þá að taka afstöðu til þeirrar kröfu í úrskurði. Ekki má úrskurða sakborning til að sæta einangrun nema hún sé nauðsynleg af þeim ástæðum sem greindar eru í a- eða d-lið 1. mgr. 95. gr. Hún má ekki standa samfleytt lengur en í fjórar vikur nema sá sem henni sætir sé sakaður um brot sem varðað getur að lögum 10 ára fangelsi. Enn fremur tekur dómari í úrskurði afstöðu til kröfu um hver tilhögun gæsluvarðhaldsvistar skuli vera að öðru leyti, sbr. 3. mgr. 99. gr.',
  },
  {
    title: 'b-lið 1. mgr. 99. gr.',
    id: CaseCustodyProvisions._99_1_B,
    info:
      'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
  },
  {
    title: '1. mgr. 100. gr.',
    id: CaseCustodyProvisions._100_1,
    info:
      'Nú eru skilyrði gæsluvarðhalds skv. 1. eða 2. mgr. 95. gr. fyrir hendi og getur dómari þá, í stað þess að úrskurða sakborning í gæsluvarðhald, mælt fyrir um vistun hans á sjúkrahúsi eða viðeigandi stofnun, bannað honum brottför af landinu ellegar lagt fyrir hann að halda sig á ákveðnum stað eða innan ákveðins svæðis.',
  },
]

export const travelBanProvisions = custodyProvisions.filter(
  (provision) =>
    provision.id === CaseCustodyProvisions._95_1_A ||
    provision.id === CaseCustodyProvisions._95_1_B ||
    provision.id === CaseCustodyProvisions._100_1,
)
