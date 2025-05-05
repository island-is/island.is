import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Skráning á námskeið hjá Vinnueftirlitinu',
      description: `Application's name`,
    },
    subTitle: {
      id: 'aosh.sem.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aosh.sem.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description:
        'Agreement of having read the above statements regarding data fetching',
    },
    tabTitle: {
      id: 'aosh.sem.application:externalData.dataProvider.tabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Data fetching',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.sem.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'aosh.sem.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.sem.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aosh.sem.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  ver: defineMessages({
    generalErrorTitle: {
      id: 'aosh.sem.application:externalData.ver.generalErrorTitle',
      defaultMessage: 'Villa í umsókn',
      description: 'General error title when fetching data from VER',
    },
    generalError: {
      id: 'aosh.sem.application:externalData.ver.generalError',
      defaultMessage:
        'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
      description: 'General error when fetching data from VER',
    },
    noSeminarFoundTitle: {
      id: 'aosh.sem.application:externalData.ver.noSeminarFoundTitle',
      defaultMessage: 'Námskeið fannst ekki',
      description: 'Error message when seminar is not found',
    },
    noSeminarFound: {
      id: 'aosh.sem.application:externalData.ver.noSeminarFound#markdown',
      defaultMessage:
        'Engar upplýsingar um þetta námskeið fundust. Vertu viss um að þú hafir valið rétt námskeið inná island.is.',
      description: 'Error message when seminar is not found',
    },
    title: {
      id: 'aosh.sem.application:externalData.ver.title',
      defaultMessage: 'Upplýsingar úr réttindagrunni Vinnueftirlitsins',
      description: 'Ver data provider title',
    },
    subTitle: {
      id: 'aosh.sem.application:externalData.ver.subTitle',
      defaultMessage:
        'Upplýsingar um þín réttindi og stöðu námskeiða eru sótt úr réttindagrunni Vinnueftirlitsins',
      description: 'Ver data provider subtitle',
    },
  }),
}
