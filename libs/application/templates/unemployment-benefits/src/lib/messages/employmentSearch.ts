import { defineMessages } from 'react-intl'

export const employmentSearch = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.general.sectionTitle',
      defaultMessage: 'Atvinnuleit',
      description: 'employment search section page title',
    },
  }),
  labels: defineMessages({}),
  jobWishes: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.sectionTitle',
      defaultMessage: 'Óskir um störf',
      description: 'employment search jon wishes section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.pageTitle',
      defaultMessage: 'Óskir um störf',
      description: 'Job wishes page description',
    },
    employmentListQuestion: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.employmentListQuestion',
      defaultMessage:
        'Hvernig starfi ertu að leita eftir? Þú verður að velja minnst tvö störf.',
      description: 'Employment list question',
    },
    employmentListDescription: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.employmentListDescription',
      defaultMessage: `Leitaðu í listanum að því starfsheiti sem passar best við það starf sem þú 
      leitar að með því að setja fyrstu stafina inn í reitinn. Vinnumálastofnun notar evrópska 
      starfaflokkunarkerfið ESCO. Ef þú finnur ekki starfsheiti sem við á getur þú skoðað lista 
      yfir öll starfsheiti [hér](https://esco.ec.europa.eu/is/classification/occupation_main).`,
      description: 'Employment list description',
    },
    employmentListLabel: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.employmentListLabel',
      defaultMessage: 'Starfalisti',
      description: 'Employment list label',
    },
    employmentLocationInterest: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.employmentLocationInterest',
      defaultMessage: 'Hefurðu áhuga á starfi utan þíns svæðis?',
      description: 'Employment location interest',
    },
    location: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.location',
      defaultMessage: 'Svæði',
      description: 'Location label',
    },
    wantedJobDescription: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.wantedJobDescription',
      defaultMessage: 'Hve háu starfshlutfalli óskar þú eftir?',
      description: 'wanted job description',
    },
    wantedJobInfoBox: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.wantedJobInfoBox',
      defaultMessage:
        'Athugaðu að atvinnuleysisbætur miðast við það hlutastarf sem þú velur. Ef þú velur 50% hlutastarf áttu rétt á 50% atvinnuleysisbótum. geta aldrei verið hærri en það starfshlutfall sem þú ert tilbúinn að ráða þig í',
      description: 'wanted job info box description',
    },
    jobTimelineDescription: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.jobTimelineDescription',
      defaultMessage: 'Hvenær getur þú hafið störf?',
      description: 'job timeline description',
    },
    jobTimelineDateLabel: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.jobTimelineDateLabel',
      defaultMessage: 'Dagsetning',
      description: 'job timeline date label',
    },
    jobTimelineInfoBox: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.jobTimelineInfoBox',
      defaultMessage:
        'Athugaðu að atvinnuleysisbætur eru greiddar frá þeim degi sem þú getur hafið störf en þó aldrei fyrr en í fyrsta lagi að loknum uppsagnarfresti. Þú getur ekki skráð lengra tímabil en einn mánuð fram í tímann.',
      description: 'job timeline info box description',
    },
    jobPercentage: {
      id: 'vmst.ub.application:employmentSearch.jobWishes.jobPercentage',
      defaultMessage: 'Starfshlutfall',
      description: 'job percentage label',
    },
  }),
  interviewAndMeetingAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.interviewAndMeetingAgreement.sectionTitle',
      defaultMessage: 'Boðun í viðtöl',
      description: 'Interview and meeting agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.interviewAndMeetingAgreement.pageTitle',
      defaultMessage: 'Boðun í viðtal, á fund og í önnur úrræði',
      description: 'Interview and meeting agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.interviewAndMeetingAgreement.pageDescription#markdown',
      defaultMessage: `Vinnumálastofnun boðar í viðtöl, fundi og önnur úrræði með tölvupósti, sms sendingum 
        eða tilkynningum á „Mínum síðum“
        \n* Það er skyldumæting í viðtöl og á fundi.
        \n* Það er skyldumæting á námskeið og önnur úrræði sem þú ert boðaður/boðuð í.
        \n* Það er skyldumæting í atvinnuviðtöl.`,
      description: 'Interview and meeting agreement page description',
    },
  }),
  educationHistory: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.educationHistory.sectionTitle',
      defaultMessage: 'Námsferill',
      description: 'employment search education history section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.educationHistory.pageTitle',
      defaultMessage: 'Námsferill',
      description: 'Education history page title',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.educationHistory.pageDescription',
      defaultMessage:
        'Vinsamlegast skráðu inn eftirfarandi upplýsingar um nám í tímaröð',
      description: 'Education history page description',
    },
  }),
  licenses: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.licenses.sectionTitle',
      defaultMessage: 'Ökuréttindi',
      description: 'employment search driving licence section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.licenses.pageTitle',
      defaultMessage: 'Ökuréttindi',
      description: 'Driving licence page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.licenses.pageDescription#markdown',
      defaultMessage: 'Vinsamlegast skráðu réttindi ef einhver eru.',
      description: 'Driving licence page description',
    },
    hasDrivingLicenseLabel: {
      id: 'vmst.ub.application:employmentSearch.licenses.hasDrivingLicenseLabel',
      defaultMessage: 'Ég er með ökuréttindi',
      description: 'Has driving license label',
    },
    drivingLicenseLabel: {
      id: 'vmst.ub.application:employmentSearch.licenses.drivingLicenseLabel',
      defaultMessage: 'Ökuréttindi {value}',
      description: 'Driving license label',
    },
    hasHeavyMachineryLicenseLabel: {
      id: 'vmst.ub.application:employmentSearch.licenses.hasHeavyMachineryLicenseLabel',
      defaultMessage: 'Ég er með vinnuvélaréttindi',
      description: 'Has heavy machinery license label',
    },
    drivingLicenseTypeLabel: {
      id: 'vmst.ub.application:employmentSearch.licenses.drivingLicenseTypeLabel',
      defaultMessage: 'Merktu við þau réttindi sem þú ert með',
      description: 'Driving licence type label',
    },
    heavyMachineryLicenses: {
      id: 'vmst.ub.application:employmentSearch.licenses.heavyMachineryLicenses',
      defaultMessage: 'Vinnuvélaréttindi',
      description: 'Heavy machinery licenses rights label',
    },
  }),
  languageSkills: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.languageSkills.sectionTitle',
      defaultMessage: 'Tungumálafærni',
      description: 'employment search language skills section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.languageSkills.pageTitle',
      defaultMessage: 'Tungumálafærni',
      description: 'Language skills page description',
    },
    language: {
      id: 'vmst.ub.application:employmentSearch.languageSkills.language',
      defaultMessage: 'Tungumál',
      description: 'Language label',
    },
    skill: {
      id: 'vmst.ub.application:employmentSearch.languageSkills.skill',
      defaultMessage: 'Tungumálafærni',
      description: 'Skill label',
    },
    addItemButtonText: {
      id: 'vmst.ub.application:employmentSearch.languageSkills.addItemButtonText',
      defaultMessage: 'Bæta við tungumáli',
      description: 'Add item button text',
    },
  }),
  euresJobSearch: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.euresJobSearch.sectionTitle',
      defaultMessage: 'EURES',
      description: 'employment search Eures job search section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.euresJobSearch.pageTitle',
      defaultMessage: 'EURES - Atvinnuleit í Evrópu',
      description: 'Eures job search page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.euresJobSearch.pageDescription#markdown',
      defaultMessage: `EURES er samstarfsvettvangur milli landa á Evrópska efnahagssvæðinu 
      sem styður við frjálsa för vinnuafls á svæðinu. [EURES vefgáttin](https://eures.europa.eu/index_is) birtir upplýsingar 
      um laus störf og atvinnuleitendur geta tengst vefgáttinni um leið og sótt er um 
      atvinnuleysisbætur. Nánari upplýsingar um EURES og starfsemi hjá Vinnumálastofnun 
      má finna á vefnum okkar [hér](https://island.is/s/vinnumalastofnun/storf-i-evropu). \n
Vilt þú að upplýsingar sem skráðar eru hjá Vinnumálastofnun um starfsreynslu þína, 
hæfni (nám, ökuréttindi og tungumálakunnáttu) verði sendar á EURES vefgáttina og 
gerðar aðgengilegar atvinnurekendum innan EES sem leita að starfsfólki með aðstoð EURES?`,
      description: 'Eures job search page description',
    },
    agreementAlert: {
      id: 'vmst.ub.application:employmentSearch.euresJobSearch.agreementAlert',
      defaultMessage:
        'Með samþykki gefur þú leyfi fyrir miðlun þessarra upplýsinga frá Vinnumálastofnun yfir í EURES vefgáttina.',
      description: 'Eures job search agreement alert',
    },
  }),
  resume: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.resume.sectionTitle',
      defaultMessage: 'Ferilskrá',
      description: 'employment search resume section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.resume.pageTitle',
      defaultMessage: 'Ferilskrá',
      description: 'Resume page description',
    },
    ownResumeLabel: {
      id: 'vmst.ub.application:employmentSearch.resume.ownResumeLabel',
      defaultMessage: 'Áttu ferilskrá?',
      description: 'Own resume label',
    },
    ownResumeAlert: {
      id: 'vmst.ub.application:employmentSearch.resume.ownResumeAlert',
      defaultMessage:
        'Ef þú vilt gefa þér tíma í uppfæra ferilskrána og senda hana okkur seinna, þá ekkert mál. Þú getur alltaf hlaðið henni inn eftir að umsókn þín hefur verið samþykkt.',
      description: 'Own resume alert',
    },
    doesNotOwnResumeAlert: {
      id: 'vmst.ub.application:employmentSearch.resume.doesNotOwnResumeAlert',
      defaultMessage:
        'Við getum aðstoðað þig við að gera ferilskrá. Ef þú vilt getur ráðgjafi verið í sambandi við þig eftir að umsókn þín hefur verið samþykkt og aðstoðað við ferilskrárgerðina.',
      description: 'Does not own resume alert',
    },
    uploadHeader: {
      id: 'vmst.ub.application:employmentSearch.resume.uploadHeader',
      defaultMessage: 'Ferilskrá',
      description: 'Ferilskrá upload header',
    },
  }),
  employmentSearchConfirmationAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.employmentSearchConfirmationAgreement.sectionTitle',
      defaultMessage: 'Staðfesting á atvinnuleit',
      description: 'Employment search confirmation agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.employmentSearchConfirmationAgreement.pageTitle',
      defaultMessage: 'Staðfesting á atvinnuleit þinni í hverjum mánuði',
      description: 'Employment search confirmation agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.employmentSearchConfirmationAgreement.pageDescription#markdown',
      defaultMessage: `Til að fá atvinnuleysistryggingar þarftu að vera að virk/ur í að 
      leita þér að vinnu. Þú verður alltaf að staðfesta atvinnuleit milli 20. og 25. dags 
      hvers mánaðar. 
      \n Það gerir þú með því að fara inn á mínar síður Vinnumálastofnunar. 
      \n **Þú þarft að staðfesta atvinnuleit, þrátt fyrir að:** 
      \n *Ekki sé búið að afgreiða eða staðfesta umsókn þína
      \n *Þú sért á biðtíma
      \n *Þú sért með námssamning
      \n *Þú sért í úrræðum á vegum Vinnumálastofnunar að undanskildum ráðningartengdum vinnumarkaðsúrræðum `,
      description: 'Employment search confirmation agreement page description',
    },
  }),
  introductoryMeeting: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.sectionTitle',
      defaultMessage: 'Kynningarfundur',
      description: 'Intoductory meeting agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.pageTitle',
      defaultMessage: 'Kynningarfundur',
      description: 'Intoductory meeting agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.pageDescription#markdown',
      defaultMessage: `Þegar umsókn hefur verið samþykkt þá færðu boð á kynningarfund. Á fundinum er farið yfir réttindi og skyldur atvinnuleitenda. Það er skyldumæting og Vinnumálastofnun sendir þér boðun í gegnum Mínar síður.`,
      description: 'Intoductory meeting agreement page description',
    },
    languageQuestion: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.languageQuestion',
      defaultMessage:
        'Á hvaða tungumáli hentar þér best að hlusta á kynninguna?',
      description: 'Language question label',
    },
    languageLabel: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.languageLabel',
      defaultMessage: 'Tungumál',
      description: 'Language label',
    },
    languagePlaceholder: {
      id: 'vmst.ub.application:employmentSearch.introductoryMeeting.languagePlaceholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Language placeholder',
    },
  }),
}
