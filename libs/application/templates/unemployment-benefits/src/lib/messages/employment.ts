import { defineMessages } from 'react-intl'

export const employment = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.general.sectionTitle',
      defaultMessage: 'Atvinnuupplýsingar',
      description: 'employment information section title',
    },
  }),
  reasonForJobSearch: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.general.sectionTitle',
        defaultMessage: 'Ástæða atvinnuleitar',
        description: 'applicant reason for job search section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.general.pageTitle',
        defaultMessage: 'Ástæða atvinnuleitar',
        description: 'Reason for job search page description',
      },
    }),
    labels: defineMessages({
      reasonForJobSearchDescription: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.reasonForJobSearchDescription',
        defaultMessage:
          'Hver er ástæða þess að þú ert í atvinnuleit/ert ekki í starfi?',
        description: 'Reason for job search dropdown description',
      },
      reasonForJobSearchLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.reasonForJobSearchLabel',
        defaultMessage: 'Ástæða atvinnuleitar',
        description: 'Reason for job search dropdown label',
      },
      reasonForJobSearchPlaceholder: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.reasonForJobSearchPlaceholder',
        defaultMessage: 'Veldu möguleika',
        description: 'Reason for job search dropdown placeholder',
      },
      furtherExplanationLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.furtherExplanationLabel',
        defaultMessage: 'Nánari skýringar',
        description: 'Further explanation label',
      },
      additionalReasonForJobSearchDescription: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.additionalReasonForJobSearchDescription',
        defaultMessage:
          'Hér getur þú sett inn frekari skýringar um ástæður atvinnuleysis:',
        description: 'Additional reason for job search dropdown description',
      },
      additionalReasonForJobSearchLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.additionalReasonForJobSearchLabel',
        defaultMessage: 'Skýringar á atvinnuleysi',
        description: 'Additional reason for job search textarea description',
      },
      informationBox: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.informationBox',
        defaultMessage:
          '  Samkvæmt lögum um atvinnuleysisbætur getur atvinnuleitandi þurft að sæta biðtíma eftir greiðslum atvinnuleysisbóta eða verið neitað um greiðslur atvinnuleysisbóta hafi hann sagt starfi sínu lausu án gildra ástæðna eða misst starfið vegna ástæðna sem hann sjálfur á sök á. Berist Vinnumálastofnun ekki umbeðin gögn eða skýringar til staðfestingar á ástæðum starfsloka mun ákvörðun verða tekin á grundvelli þeirra upplýsinga sem liggja fyrir.',
        description: 'Information box about reasons for unemployment',
      },
      bankruptsyReasonLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.bankruptsyReasonLabel',
        defaultMessage:
          'Með því að haka hér framselur þú Atvinnuleysistryggingasjóði skv. 40 gr. laga nr. 54/2006 um atvinnuleysisbætur, þann hluta kröfunnar, sem þú kannt að fá greiddan úr þrotabúinu eða úr ríkissjóði vegna ógreiddra launa og launa í uppsagnarfresti, að því marki sem sjóðurinn kann að greiða mér í atvinnuleysisbætur.',
        description: 'Bankruptsy reason checkbox label',
      },
      agreementConfirmationLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.labels.agreementConfirmationLabel',
        defaultMessage:
          'Ég staðfesti að hafa fengið upplýsingar um hugsanleg viðurlög sem ég kann að þurfa að sæta vegna starfsloka og að í ofangreindum skýringum megi finna fullnægjandi skýringar.',
        description: 'Agreement label checkbox label',
      },
      healthReasonFileLabel: {
        id: 'vmst.ub.application:employment.reasonForJobSearch.abels.healthReasonFileLabel',
        defaultMessage: 'Læknisvottorð',
        description: 'Health reason file upload label',
      },
    }),
  },
  yourRightsAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.sectionTitle',
      defaultMessage: 'Réttindi og skyldur',
      description: 'Your rights agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.pageTitle',
      defaultMessage: 'Réttindi og skyldur á meðan þú ert í atvinnuleit',
      description: 'Your rights agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.pageDescription#markdown',
      defaultMessage: `Áður en þú staðfestir umsókn um atvinnuleysisbætur er nauðsynlegt að 
        þú kynnir þér eftirfarandi reglur um réttindi og skyldur umsækjenda um atvinnuleysisbætur. 
        \n Launafólk og þau sem hafa verið sjálfstætt starfandi á aldrinum 18-70 ára eiga 
        rétt á atvinnuleysisbótum að því tilskildu að þeir hafi áunnið sér bótarétt og 
        uppfylli skilyrði laga um atvinnuleysisbætur og vinnumarkaðsaðgerðir svo sem þau:
        \n *Að vera atvinnulaus
        \n *Að vera búsett/ur og staddur á Íslandi
        \n *Að vera virk/ur í atvinnuleit
        \n *Að vera vinnufær
        \n *Að vera reiðubúin/n/ð að ráða sig til almennra starfa`,
      description: 'Your rights agreement page description',
    },
  }),
  currentSituation: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.currentSituation.general.sectionTitle',
        defaultMessage: 'Núverandi staða',
        description:
          'applicant current situation reason for job search section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.currentSituation.general.pageTitle',
        defaultMessage: 'Núverandi staða',
        description: 'Current situation page description',
      },
    }),
    labels: defineMessages({
      currentSituationDropdownDescription: {
        id: 'vmst.ub.application:employment.currentSituation.labels.currentSituationDropdownDescription',
        defaultMessage: 'Hver er núverandi staða hjá þér?',
        description: 'current situation dropdown description',
      },
      currentSituationDropdownLabel: {
        id: 'vmst.ub.application:employment.currentSituation.labels.currentSituationDropdownLabel',
        defaultMessage: 'Staða',
        description: 'current situation dropdown label',
      },
      statusOptionNoJob: {
        id: 'vmst.ub.application:employment.currentSituation.labels.statusOptionNoJob',
        defaultMessage: 'Ég er ekki í starfi',
        description: 'status option unemployed label',
      },
      statusPartJob: {
        id: 'vmst.ub.application:employment.currentSituation.labels.statusPartJob',
        defaultMessage: 'Ég er í hlutastarfi',
        description: 'status option part time job label',
      },
      statusOccasionalJob: {
        id: 'vmst.ub.application:employment.currentSituation.labels.statusOccasionalJob',
        defaultMessage: 'Ég er í tilfallandi vinnu',
        description: 'status option occasional job label',
      },
      statusCurrentlyEmployed: {
        id: 'vmst.ub.application:employment.currentSituation.labels.statusCurrentlyEmployed',
        defaultMessage: 'Ég er í starfi á uppsagnarfresti',
        description: 'status option employed label',
      },
      jobRepeaterEmployment: {
        id: 'vmst.ub.application:employment.currentSituation.labels.jobRepeaterEmployment#markdown',
        defaultMessage: 'Starf {index}',
        description: 'job repeater label',
      },
      partTimeJobPercentage: {
        id: 'vmst.ub.application:employment.currentSituation.labels.partTimeJobPercentage',
        defaultMessage: 'Starfshlutfall',
        description: 'part time job percentage label',
      },
      partTimeJobStartDate: {
        id: 'vmst.ub.application:employment.currentSituation.labels.partTimeJobStartDate',
        defaultMessage: 'Upphaf hlutastarfs',
        description: 'part time job start date label',
      },
      jobEndDate: {
        id: 'vmst.ub.application:employment.currentSituation.labels.jobEndDate',
        defaultMessage: 'Hvenær lýkur uppsagnarfresti þínum',
        description: 'Job end date label',
      },
      partTimeJobWorkHours: {
        id: 'vmst.ub.application:employment.currentSituation.labels.partTimeJobWorkHours',
        defaultMessage: 'Vinnutími (t.d 08:00 - 16:00)',
        description: 'part time job work hours label',
      },
      partTimeJobSalary: {
        id: 'vmst.ub.application:employment.currentSituation.labels.partTimeJobSalary',
        defaultMessage: 'Laun á mánuði fyrir skatt',
        description: 'part time job salary label',
      },
      occasionalJobInfoBox: {
        id: 'vmst.ub.application:employment.currentSituation.labels.occasionalJobInfoBox',
        defaultMessage:
          'Ef að þú ert í tilfallandi vinnu þarftu að tilkynna um vinnu fyrirfram í hvert skipti og skila upplýsingum um tekjur af tilfallandi vinnu á Mínum síðum. Þú gerir það með aðgerðinni „Tilkynna vinnu eða tekjur“.',
        description: 'occasional job info box description',
      },
      stillEmployedEndDateAlert: {
        id: 'vmst.ub.application:employment.currentSituation.labels.stillEmployedEndDateAlert',
        defaultMessage:
          'Athugaðu að atvinnuleysisbætur eru greiddar frá þeim degi sem þú getur hafið störf en þó aldrei fyrr en í fyrsta lagi að loknum uppsagnarfresti. Þú getur ekki skráð lengra tímabil en tvær vikur fram í tímann.',
        description: 'Still employed end date alert',
      },
      jobEstimatedSalary: {
        id: 'vmst.ub.application:employment.currentSituation.labels.jobEstimatedSalary',
        defaultMessage: 'Áætlað laun á mánuði fyrir skatt',
        description: 'Last job estimated salary label',
      },
      unregisteredEmployer: {
        id: 'vmst.ub.application:employment.currentSituation.labels.unregisteredEmployer',
        defaultMessage: 'Óskráð',
        description: 'Unregistered employer in dropdown label',
      },
    }),
  },
  concurrentWorkAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.concurrentWorkAgreement.sectionTitle',
      defaultMessage: 'Vinna samhliða greiðslum',
      description: 'Concurrent work agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.concurrentWorkAgreement.pageTitle',
      defaultMessage: 'Vinna samhliða greiðslum',
      description: 'Concurrent work agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.concurrentWorkAgreement.pageDescription#markdown',
      defaultMessage: `Það er vel hægt að taka að sér vinnu samhliða greiðslu úr atvinnuleysistryggingasjóði.
      \n Ef þú færð vinnu þarftu að láta vita áður en þú byrjar í vinnunni. Það gerir þú á „Mínum síðum“ með 
      aðgerðinni „Tilkynning um vinnu eða tekjur.“ 
      \n Atvinnuleysistryggingar eru ekki greiddar þá daga sem þú 
      sinnir verktakavinnu. Ef þú tekur að þér vinnu sem verktaki á eigin kennitölu verður þú að tilkynna 
      á „Mínum síðum“ um þá daga sem vinna/verkefni stendur yfir. Það gerir þú á „Mínum síðum“ með aðgerðinni 
      „Tilkynna vinnu eða tekjur.“
      \n [Nánari upplýsingar](https://island.is/atvinnuleysisbaetur/hvad-hefur-ahrif-a-greidslur)`,
      description: 'Concurrent work agreement page description',
    },
  }),
  workingAbility: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.workingAbility.general.sectionTitle',
        defaultMessage: 'Vinnufærni',
        description: 'applicant working ability page section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.workingAbility.general.pageTitle',
        defaultMessage: 'Vinnufærni',
        description: 'Working ability page description',
      },
    }),
    labels: defineMessages({
      workingAbilityDescription: {
        id: 'vmst.ub.application:employment.workingAbility.labels.workingAbilityDescription',
        defaultMessage: 'Hvernig metur þú þína vinnufærni?',
        description: 'Working ability dropdown description',
      },
      workingAbilityLabel: {
        id: 'vmst.ub.application:employment.workingAbility.labels.workingAbilityLabel',
        defaultMessage: 'Staða',
        description: 'Working ability dropdown label',
      },
      optionFullTime: {
        id: 'vmst.ub.application:employment.workingAbility.labels.optionFullTime',
        defaultMessage: 'Ég er almennt vinnufær',
        description: 'Working ability option full time label',
      },
      optionPartTime: {
        id: 'vmst.ub.application:employment.workingAbility.labels.optionPartTime',
        defaultMessage: 'Ég er með skerta vinnufærni',
        description: 'Working ability option part time label',
      },
      optionDisability: {
        id: 'vmst.ub.application:employment.workingAbility.labels.optionDisability',
        defaultMessage: 'Ég er með örorkumat',
        description: 'Working ability option disability label',
      },
      partTimeInfoBox: {
        id: 'vmst.ub.application:employment.workingAbility.labels.partTimeInfoBox',
        defaultMessage:
          'Þú þarft að skila inn starfhæfnisvottorð því til staðfestingar. Engar áhyggjur þó þú sért ekki með læknisvottorðið klárt. Þú getur vel klárað umsóknina og skilað vottorði á mínum síðum Vinnumálastofnunar síðar.',
        description: 'Working ability part time info box description',
      },
      partTimeFileUploadLabel: {
        id: 'vmst.ub.application:employment.workingAbility.labels.partTimeFileUploadLabel',
        defaultMessage: 'Starfshæfnisvottorð',
        description: 'Working ability part time file upload label',
      },
    }),
  },
  employmentHistory: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.employmentHistory.general.sectionTitle',
        defaultMessage: 'Atvinnusaga',
        description: 'applicant employment history section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.employmentHistory.general.pageTitle',
        defaultMessage: 'Atvinnusaga',
        description: 'Employment history page description',
      },
      pageDescription: {
        id: 'vmst.ub.application:employment.employmentHistory.general.pageDescription',
        defaultMessage:
          'Greiðsla atvinnuleysisbóta miðast við áunninn rétt þinn. Bótaréttur miðast við fyrri vinnusögu. Til þess að eiga rétt á 100% bótum þarftu að hafa verið í 100% starfi í samtals 12 mánuði á síðustu þremur árum.',
        description: 'Employment history page description',
      },
    }),
    labels: defineMessages({
      independentCheckbox: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.independentCheckbox',
        defaultMessage: 'Ertu eða varstu sjálfstætt starfandi?',
        description: 'Independent checkbox label',
      },
      independentOwnSSNCheckbox: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.independentOwnSSNCheckbox',
        defaultMessage: 'Varstu starfandi á eigin kennitölu ?',
        description: 'Independent own ssn checkbox label',
      },
      lastJobLabel: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobLabel',
        defaultMessage:
          'Vinsamlegast settu inn fyrri störf sem þú hefur unnið. Við mælum með því að setja inn eins ítarlega atvinnusögu og hægt er.',
        description: 'Last job label',
      },
      lastJobTitle: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobTitle',
        defaultMessage: 'Starfsheiti',
        description: 'Last job title label',
      },
      lastJobPercentage: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobPercentage',
        defaultMessage: 'Starfshlutfall',
        description: 'Last job percentage label',
      },
      lastJobStartDate: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobStartDate',
        defaultMessage: 'Hóf störf',
        description: 'Last job start date label',
      },
      lastJobEndDate: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobEndDate',
        defaultMessage: 'Hvenær lýkur uppsagnafresti þínum',
        description: 'Last job end date label',
      },
      lastOldJobEndDate: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastOldJobEndDate',
        defaultMessage: 'Lauk störfum',
        description: 'Last old job end date label',
      },
      addJob: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.addJob',
        defaultMessage: 'Bæta við starfi',
        description: 'Add job button label',
      },
      lastJobs: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobs',
        defaultMessage: 'Fyrra starf',
        description: 'Last jobs label',
      },
      lastJobRepeater: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.lastJobRepeater',
        defaultMessage: 'Starf {value}',
        description: 'Last jobs repeater label',
      },
      radioEesLabel: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.radioEesLabel',
        defaultMessage:
          'Hefurðu unnið á EES svæðinu, utan Íslands, síðastliðin 5 ár?',
        description: 'EES country radio button label',
      },
      eesAlertInformation: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.eesAlertInformation',
        defaultMessage:
          'Þjónustufulltrúi Vinnumálastofnunar mun hafa samband við þig varðandi störf erlendis ef þörf er á.',
        description: 'EES country alert information label',
      },
      workOnOwnSSNAlert: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.workOnOwnSSNAlert',
        defaultMessage:
          'Þú þarft að tilkynna um stöðvun rekstrar til Skattsins með eyðublaði RSK 5.04. Þú þarft ekki að senda afrit af tilkynningunni til Vinnumálastofnunar.',
        description: 'Work on own ssn alert information label',
      },
      customEmployerNameLabel: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.customEmployerNameLabel',
        defaultMessage: 'Nafn fyrirtækis',
        description: 'employer name label',
      },
      customEmployerNationalIdLabel: {
        id: 'vmst.ub.application:employment.employmentHistory.labels.customEmployerNationalIdLabel',
        defaultMessage: 'Kennitala fyrirtækis',
        description: 'employer national id label',
      },
    }),
  },
  lossOfRightsAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.lossOfRightsAgreement.sectionTitle',
      defaultMessage: 'Missir bótaréttar',
      description: 'Loss of rights agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.lossOfRightsAgreement.pageTitle',
      defaultMessage: 'Missir bótaréttar',
      description: 'Loss of rights agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.lossOfRightsAgreement.pageDescription#markdown',
      defaultMessage: `Kynntu þér vel reglur og skyldur atvinnuleitenda. Við brot á reglum eða 
      ekki farið eftir þeim áttu á hættu að missa bætur í ákveðinn tíma. Það á meðal annars við ef þú:
      \n *Hafnar þátttöku í vinnumarkaðsúrræðum
      \n *Ferð til útlanda án þess að tilkynna það fyrirfram
      \n *Ert í námi án námssamnings
      \n *Uppfyllir ekki mætingarskyldu í úrræði
      \n *Segir sjálf/ur upp starfi
      \n *Ef það er ekki hægt að ná í þig
      \n *Ef þú tilkynnir ekki um vinnu samhliða því að vera á bótum 
      \n *Ert með opna laungreiðendaskrá og/eða lögskráningu
      \n Sjáðu nánar á [vef Vinnumálastofnunar](https://island.is/atvinnuleysisbaetur) undir kaflanum: Atvinnuleysisbætur - biðtími og viðurlög.`,
      description: 'Loss of rights agreementpage description',
    },
  }),
}
