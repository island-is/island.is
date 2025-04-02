import { defineMessages } from 'react-intl'

export const employment = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:employment.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: 'applicant section page title',
    },
  }),
  labels: defineMessages({}),
  reasonForJobSearch: defineMessages({
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
  currentSituation: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:employment.currentSituation.pageTitle',
      defaultMessage: 'Núverandi staða',
      description: 'Current situation page description',
    },
  }),
  concurrentWorkAgreement: defineMessages({
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
  workingAbility: defineMessages({
    pageTitle: {
      id: 'vmst.ub.application:employment.workingAbility.pageTitle',
      defaultMessage: 'Vinnufærni',
      description: 'Working ability page description',
    },
  }),
  employmentHistory: defineMessages({
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
