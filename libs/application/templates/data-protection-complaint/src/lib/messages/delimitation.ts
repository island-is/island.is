import { defineMessages } from 'react-intl'

export const delimitation = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.delimitation.pageTitle',
      defaultMessage:
        'Til að Persónuvernd geti fjallað um kvörtunina þína þarf fyrst að kanna hvort hún fellur undir verksvið stofnunarinnar',
      description: 'Delimitation page title',
    },
  }),
  labels: defineMessages({
    inCourtProceedings: {
      id: 'dpac.application:section.delimitation.labels.inCourtProceedings',
      defaultMessage:
        'Er málið sem um ræðir til meðferðar hjá dómstólum eða öðrum stjórnvöldum?',
      description: 'Label for inCourtProceedings field',
    },
    concernsMediaCoverage: {
      id: 'dpac.application:section.delimitation.labels.concernsMediaCoverage',
      defaultMessage:
        'Ertu að kvarta yfir umfjöllun um þig eða aðra í fjölmiðlum?',
      description: 'Label for concernsMediaCoverage field',
    },
    concernsBanMarking: {
      id: 'dpac.application:section.delimitation.labels.concernsBanMarking',
      defaultMessage:
        'Ertu að kvarta yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt?',
      description: 'Label for concernsBanMarking field',
    },
    concernsLibel: {
      id: 'dpac.application:section.delimitation.labels.concernsLibel',
      defaultMessage:
        'Ertu að kvarta yfir einhverju sem var sagt eða skrifað um þig í fjölmiðlum, á netinu eða á öðrum opinberum vettvangi?',
      description: 'Label for concernsLibel field',
    },
    concernsPersonalDataConflict: {
      id:
        'dpac.application:section.delimitation.labels.concernsPersonalDataConflict',
      defaultMessage:
        'Ertu að kvarta yfir því að hafa ekki fengið aðgang að persónuupplýsingum um þig, eða að þær hafi ekki verið leiðréttar eða þeim eytt?',
      description: 'Label for concernsPersonalDataConflict field',
    },
    concernsPersonalLettersOrSocialMedia: {
      id:
        'dpac.application:section.delimitation.labels.concernsPersonalLettersOrSocialMedia',
      defaultMessage:
        'Ertu að kvarta yfir opnun persónulegra bréfa eða þegar farið er inn á aðgang einstaklings á samfélagsmiðli eða einkatölvupóst í leyfisleysi?',
      description: 'Label for concernsPersonalLettersOrSocialMedia field',
    },
    agreementDescriptionBulletOne: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletOne',
      defaultMessage: `
        Vinsamlegast athugið að þegar kvörtun er
        tekin til meðferðar er gagnaðila tilkynnt
        um að borist hafi kvörtun frá tilteknum
        nafngreindum aðila og honum gefinn kostur
        á að koma áframfæri andmælum sínum.
        Kvartanda er einnig gefið færi á að koma
        að athugasemdum við andmæli þess sem kvartað er yfir.
        Svarfrestur málsaðila er að jafnaði þrjár vikur.
        `,
      description: 'Agreement description bullet one',
    },
    agreementDescriptionBulletTwo: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletTwo',
      defaultMessage: `
        Telji Persónuvernd að upplýsa þurfi málið betur getur stofnunin
        óskað eftir frekari upplýsingumeða gögnum frá öllum aðilum.
        Aðilum máls er sent afrit allra bréfa. Hafi allir þættir
        málsins verið upplýstir og málið ekki til lykta leitt með
        öðrum hætti úrskurðar Persónuvernd um lögmæti þeirrar
        vinnslu sem kvartað er yfir.
        `,
      description: 'Agreement description bullet Two',
    },
    agreementDescriptionBulletThree: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletThree',
      defaultMessage: `
       Vakin er athygli á því að erindi sem berast stofnuninni og öll
       gögn sem viðkomandi málvarða eru geymd í skjalageymslu
       stofnunarinnar undir málsnúmeri uns þau verða afhent Þjóðskjalasafni
       Íslands til varðveislu í samræmi við ákvæði laga nr. 77/2014, um opinberskjalasöfn.
        `,
      description: 'Agreement description bullet Three',
    },
    agreementDescriptionBulletFour: {
      id:
        'dpac.application:section.delimitation.labels.agreementDescriptionBulletFour',
      defaultMessage: `
        Öll mál sem berast Persónuvernd eru sett í viðeigandi farveg
        og er málsaðilum tilkynnt um það, þó svo að á því geti orðið
        tafir í ljósi mikilla anna hjá Persónuvernd. Almennt má
        áætlaað afgreiðsla kvartana geti tekið um 9-15  mánuði, en
        afgreiðslutími getur þó lengst ennfrekar ef mál eru flókin
        eða mikil að umfangi. Úrlausnir Persónuverndar eru  birtar
        á vefsíðu stofnunarinnar, nöfn einstaklinga eru þó ávallt afmáð.
        `,
      description: 'Agreement description bullet Four',
    },
  }),
}
