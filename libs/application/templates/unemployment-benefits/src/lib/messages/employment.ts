import { defineMessages } from 'react-intl'

export const employment = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.general.sectionTitle',
      defaultMessage: 'Atvinnuupplýsingar',
      description: 'employment information section title',
    },
  }),
  reasonForJobSearch: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.reasonForJobSearch.sectionTitle',
      defaultMessage: 'Ástæða atvinnuleitar',
      description: 'applicant reason for job search section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.reasonForJobSearch.pageTitle',
      defaultMessage: 'Ástæða atvinnuleitar',
      description: 'Reason for job search page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.reasonForJobSearch.pageDescription',
      defaultMessage:
        'Amet posuere morbi purus orci rhoncus duis. Eu turpis imperdiet magna quam gravida arcu non aliquam tincidunt. Hac imperdiet erat sit ut sit sagittis lectus molestie. Ultricies lacus eget velit elit.',
      description: 'Reason for job search page description',
    },
  }),
  yourRightsAgreement: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.sectionTitle',
      defaultMessage: 'Réttindi og skyldur',
      description: 'Your rights agreement section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.pageTitle',
      defaultMessage: 'Þín réttindi og skyldur á meðan þú ert í atvinnuleit',
      description: 'Your rights agreement page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.yourRightsAgreement.pageDescription#markdown',
      defaultMessage:
        'Áður en þú staðfestir umsókn þína um atvinnuleysistryggingar er nauðsynlegt að þú kynnir þér eftirfarandi reglur um réttindi og skyldur umsækjenda um atvinnuleysistryggingar. Launafólk og þeir sem hafa verið sjálfstætt starfandi á aldrinum 18-70 ára eiga rétt á atvinnuleysisbótum að því tilskildu að þeir hafi áunnið sér bótarétt og uppfylli skilyrði laga um atvinnuleysistryggingar og vinnumarkaðsaðgerðir svo sem þau:',
      description: 'Your rights agreement page description',
    },
  }),
  currentSituation: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.currentSituation.sectionTitle',
        defaultMessage: 'Núverandi staða',
        description:
          'applicant current situation reason for job search section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.currentSituation.pageTitle',
        defaultMessage: 'Núverandi staða',
        description: 'Current situation page description',
      },
    }),
    labels: defineMessages({
      currentSituationDropdownDescription: {
        id: 'vmst.ub.application:employment.labels.currentSituationDropdownDescription',
        defaultMessage: 'Hver er núverandi staða hjá þér?',
        description: 'current situation dropdown description',
      },
      currentSituationDropdownLabel: {
        id: 'vmst.ub.application:employment.labels.currentSituationDropdownLabel',
        defaultMessage: 'Staða',
        description: 'current situation dropdown label',
      },
      statusOptionNoJob: {
        id: 'vmst.ub.application:employment.labels.statusOptionNoJob',
        defaultMessage: 'Ég er ekki í starfi',
        description: 'status option unemployed label',
      },
      statusPartJob: {
        id: 'vmst.ub.application:employment.labels.statusPartJob',
        defaultMessage: 'Ég er í hlutastarfi',
        description: 'status option part time job label',
      },
      statusOccasionalJob: {
        id: 'vmst.ub.application:employment.labels.statusOccasionalJob',
        defaultMessage: 'Ég er í tilfallandi vinnu',
        description: 'status option occasional job label',
      },
      statusCurrentlyEmployed: {
        id: 'vmst.ub.application:employment.labels.statusCurrentlyEmployed',
        defaultMessage: 'Ég er í starfi á uppsagnarfresti',
        description: 'status option employed label',
      },
      reasonForUnemploymentDescription: {
        id: 'vmst.ub.application:employment.labels.reasonForUnemploymentDescription',
        defaultMessage:
          'Hér getur þú sett inn frekari skýringar um ástæður atvinnuleysis:',
        description: 'reason for unemployment dropdown description',
      },
      reasonForUnemploymentLabel: {
        id: 'vmst.ub.application:employment.labels.reasonForUnemploymentLabel',
        defaultMessage: 'Aðrar ástæður',
        description: 'reason for unemployment dropdown label',
      },
      partTimeJobDescription: {
        id: 'vmst.ub.application:employment.labels.partTimeJobDescription',
        defaultMessage: 'Vinsamlegast fylltu út frekari upplýsingar um starfið',
        description: 'part time job description',
      },
      partTimeJobEmployerNationalId: {
        id: 'vmst.ub.application:employment.labels.partTimeJobEmployerNationalId',
        defaultMessage: 'Kennitala fyrirtækis',
        description: 'part time job employer national id label',
      },
      partTimeJobEmployerName: {
        id: 'vmst.ub.application:employment.labels.partTimeJobEmployerName',
        defaultMessage: 'Nafn fyrirtækis',
        description: 'part time job employer name label',
      },
      partTimeJobPercentage: {
        id: 'vmst.ub.application:employment.labels.partTimeJobPercentage',
        defaultMessage: 'Starfshlutfall',
        description: 'part time job percentage label',
      },
      partTimeJobStartDate: {
        id: 'vmst.ub.application:employment.labels.partTimeJobStartDate',
        defaultMessage: 'Upphaf hlutastarfs',
        description: 'part time job start date label',
      },
      jobEndDate: {
        id: 'vmst.ub.application:employment.labels.jobEndDate',
        defaultMessage: 'Hvenær lýkur uppsagnarfresti þínum',
        description: 'Job end date label',
      },
      partTimeJobWorkHours: {
        id: 'vmst.ub.application:employment.labels.partTimeJobWorkHours',
        defaultMessage: 'Vinnutími',
        description: 'part time job work hours label',
      },
      partTimeJobSalary: {
        id: 'vmst.ub.application:employment.labels.partTimeJobSalary',
        defaultMessage: 'Laun á mánuði fyrir skatt',
        description: 'part time job salary label',
      },
      wantedJobDescription: {
        id: 'vmst.ub.application:employment.labels.wantedJobDescription',
        defaultMessage: 'Hve háu starfshlutfalli óskar þú eftir?',
        description: 'wanted job description',
      },
      wantedJobInfoBox: {
        id: 'vmst.ub.application:employment.labels.wantedJobInfoBox',
        defaultMessage:
          'Athugaðu að atvinnuleysisbætur miðast við það hlutastarf sem þú velur. Ef þú velur 50% hlutastarf áttu rétt á 50% atvinnuleysisbótum. geta aldrei verið hærri en það starfshlutfall sem þú ert tilbúinn að ráða þig í',
        description: 'wanted job info box description',
      },
      jobTimelineDescription: {
        id: 'vmst.ub.application:employment.labels.jobTimelineDescription',
        defaultMessage: 'Hvenær getur þú hafið störf?',
        description: 'job timeline description',
      },
      jobTimelineDateLabel: {
        id: 'vmst.ub.application:employment.labels.jobTimelineDateLabel',
        defaultMessage: 'Dagsetning',
        description: 'job timeline date label',
      },
      jobTimelineInfoBox: {
        id: 'vmst.ub.application:employment.labels.jobTimelineInfoBox',
        defaultMessage:
          'Athugaðu að atvinnuleysisbætur eru greiddar frá þeim degi sem þú getur hafið störf en þó aldrei fyrr en í fyrsta lagi að loknum uppsagnarfresti. Þú getur ekki skráð lengra tímabil en einn mánuð fram í tímann.',
        description: 'job timeline info box description',
      },
      occasionalJobInfoBox: {
        id: 'vmst.ub.application:employment.labels.occasionalJobInfoBox',
        defaultMessage:
          'Ef að þú ert í tilfallandi vinnu þarftu að tilkynna um vinnu fyrirfram í hvert skipti og skila upplýsingum um tekjur af tilfallandi vinnu á Mínum síðum. Þú gerir það með aðgerðinni „Tilkynna vinnu eða tekjur“.',
        description: 'occasional job info box description',
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
      defaultMessage: `Það er vel hægt að taka að sér vinnu samhliða greiðslu úr atvinnuleysistryggingasjóði.\n  Ef þú færð vinnu þarftu að láta vita áður en þú byrjar í vinnunni. Það gerir þú á „Mínum síðum“ með aðgerðinni „Tilkynning um vinnu eða tekjur.“ Atvinnuleysistryggingar eru ekki greiddar þá daga sem þú sinnir verktakavinnu. Ef þú tekur að þér vinnu sem verktaki á eigin kennitölu verður þú að tilkynna á „Mínum síðum“ um þá daga sem vinna/verkefni stendur yfir. Það gerir þú á „Mínum síðum“ með aðgerðinni „Tilkynna vinnu eða tekjur.“\nEf þú vilt nánari upplýsingar þá getur þú smellt hér.`,
      description: 'Concurrent work agreement page description',
    },
  }),
  workingAbility: {
    general: defineMessages({
      sectionTitle: {
        id: 'vmst.ub.application:employment.workingAbility.sectionTitle',
        defaultMessage: 'Vinnufærni',
        description: 'applicant working ability page section title',
      },
      pageTitle: {
        id: 'vmst.ub.application:employment.workingAbility.pageTitle',
        defaultMessage: 'Vinnufærni',
        description: 'Working ability page description',
      },
    }),
    labels: defineMessages({
      workingAbilityDescription: {
        id: 'vmst.ub.application:employment.labels.workingAbilityDescription',
        defaultMessage: 'Hvernig metur þú þína vinnufærni?',
        description: 'Working ability dropdown description',
      },
      workingAbilityLabel: {
        id: 'vmst.ub.application:employment.labels.workingAbilityLabel',
        defaultMessage: 'Staða',
        description: 'Working ability dropdown label',
      },
      optionFullTime: {
        id: 'vmst.ub.application:employment.labels.optionFullTime',
        defaultMessage: 'Ég er almennt vinnufær',
        description: 'Working ability option full time label',
      },
      optionPartTime: {
        id: 'vmst.ub.application:employment.labels.optionPartTime',
        defaultMessage: 'Ég er með skerta vinnufærni',
        description: 'Working ability option part time label',
      },
      optionDisability: {
        id: 'vmst.ub.application:employment.labels.optionDisability',
        defaultMessage: 'Ég er með örorkumat',
        description: 'Working ability option disability label',
      },
      partTimeInfoBox: {
        id: 'vmst.ub.application:employment.labels.partTimeInfoBox',
        defaultMessage:
          'Þú þarft að skila inn starfhæfnisvottorð því til staðfestingar. Engar áhyggjur þó þú sért ekki með læknisvæottorðið klárt. Þú getur vel klárað umsóknina og skilað vottorði á mínum síðum Vinnumálastofnunar síðar.',
        description: 'Working ability part time info box description',
      },
      partTimeFileUploadLabel: {
        id: 'vmst.ub.application:employment.labels.partTimeFileUploadLabel',
        defaultMessage: 'Læknisvottorð',
        description: 'Working ability part time file upload label',
      },
    }),
  },
  employmentHistory: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.employmentHistory.sectionTitle',
      defaultMessage: 'Atvinnusaga þín',
      description: 'applicant employment history section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:employment.employmentHistory.pageTitle',
      defaultMessage: 'Atvinnusaga þín',
      description: 'Employment history page description',
    },
    pageDescription: {
      id: 'vmst.ub.application:employment.employmentHistory.pageDescription',
      defaultMessage:
        'Greiðsla atvinnuleysisbóta miðast við áunninn rétt þinn. Því er mikilvægt að skila inn sem ítarlegustum upplýsingum um atvinnusögu þína. Til að fá fullar bætur þarftu að hafa unnið samtals í 12 mánuði í 100% starfi innan síðustu þriggja ára.',
      description: 'Employment history page description',
    },
  }),
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
      defaultMessage: `Það er mögulegt að missa áunninn bótarétt.\nKynntu þér vel reglur og skyldur atvinnuleitenda. Ef reglur eru brotnar eða ekki farið eftir þeim áttu á hættu að missa bætur í ákveðinn tíma. Það á meðal annars við ef þú:`,
      description: 'Loss of rights agreementpage description',
    },
  }),
}
