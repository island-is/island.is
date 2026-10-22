export const m = {
  drivingLicenseSubject: {
    'B-temp': 'Umsókn um ökunám móttekin',
    'B-full': 'Umsókn um fullnaðarskírteini móttekin',
    'B-full-renewal-65': 'Umsókn um endurnýjun ökuskírteinis móttekin',
    BE: 'Umsókn um BE réttindi móttekin',
  },
  drivingLicenseHeading: {
    'B-temp': 'Umsókn þín um ökunám hefur verið móttekin',
    'B-full': 'Umsókn þín um fullnaðarskírteinið hefur verið móttekin',
    'B-full-renewal-65':
      'Umsókn þín um endurnýjun ökuskírteinis hefur verið móttekin',
    BE: 'Umsókn þín um BE réttindi hefur verið móttekin',
  },
  inPersonRequirements: {
    title: {
      'B-temp':
        'Til að klára umsóknina þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum',
      'B-full':
        'Áður en hægt er að panta fullnaðarskírteini, þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum',
      'B-full-renewal-65':
        'Áður en hægt er að endurnýja ökuskírteini, þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum',
      BE: 'Áður en hægt er að panta ökuskírteini, þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum',
    },
    healthDeclaration: {
      title:
        'Læknisvottorði frá heimilislækni miðað við útfyllta heilbrigðisyfirlýsingu.',
    },
    qualityPhoto: {
      title: 'Ljósmynd sem uppfyllir eftirfarandi kröfur:',
      list: [
        'Myndin skal vera andlitsmynd, tekin þannig að andlitið snúi beint að myndavél og bæði augu sjáist.',
        'Myndin skal vera jafnlýst, bakgrunnur ljósgrár, hlutlaus og án skugga.',
        'Umsækjandi má ekki bera dökk gleraugu eða gleraugu með speglun.',
        'Umsækjandi má ekki bera höfuðfat. Þó má heimila slíkt ef umsækjandi fer fram á það af trúarástæðum.',
        'Ljósmyndin þarf að vera prentuð á ljósmyndapappír og 35x45mm að stærð',
      ],
    },
    temporaryLicense: {
      title: 'Bráðabirgðaskírteini',
    },
  },
  completeFooter: [
    'Ökuskírteinið þitt verður tilbúið á völdum afhendingastað (%s) eftir 7 virka daga.',
    'Þú getur uppfært stafræna ökuskírteinið þitt í <a href="https://island.is/okuskirteini">Ísland.is appinu</a>.',
  ],
  completeFooterPost: [
    'Ökuskírteinið þitt verður sent á lögheimili þitt.',
    'Þú getur uppfært stafræna ökuskírteinið þitt í <a href="https://island.is/okuskirteini">Ísland.is appinu</a>.',
  ],
  congratulations: 'Góðan daginn',
  // Per-type greeting where product asked for different wording; every other
  // type keeps `congratulations`.
  greeting: {
    'B-full-renewal-65': 'Góðan dag',
  } as Record<string, string | undefined>,
  nextSteps: {
    BE: [
      {
        paragraphs: [
          'Ef læknisvottorð fylgdi umsókninni verður það nú yfirfarið. Þegar umsókn hefur verið samþykkt verður hún send áfram í ökunámsbók. Ef læknisvottorð uppfyllir ekki skilyrði getur umsókninni verið hafnað. Ef umsókn er hafnað þarf að senda beiðni um endurgreiðslu á endurgreidsla@island.is og sækja aftur um.',
          'Þegar verklegu prófi er lokið verður ökuskírteinið pantað og afhent samkvæmt því sem valið var í umsóknarferlinu, annað hvort sent eða sótt á valda afgreiðslu.',
        ],
      },
    ],
    'B-full-renewal-65': [
      {
        heading: 'Yfirferð læknisvottorðs',
        paragraphs: [
          'Fylgi læknisvottorð umsókninni verður það yfirfarið og uppfylli það ekki skilyrði gæti umsókninni verið hafnað.',
          'Sé umsókninni hafnað þarf að óska eftir endurgreiðslu með því að senda tölvupóst á endurgreidsla@island.is og gera svo aðra umsókn þar sem gild gögn fylgja með.',
        ],
      },
      {
        heading: 'Pöntun og afhending ökuskírteinis',
        paragraphs: [
          'Þegar umsóknin hefur verið samþykkt verður ökuskírteinið pantað. Afhending fer eftir því sem valið er í umsóknarferlinu.',
        ],
        list: [
          'Skírteinið verður sent til þín, eða',
          'þú sækir það á þann afgreiðslustað sem þú valdir.',
        ],
      },
    ],
  } as Record<string, NextStepsSection[] | undefined>,
}

export type NextStepsSection = {
  heading?: string
  paragraphs: string[]
  list?: string[]
}
