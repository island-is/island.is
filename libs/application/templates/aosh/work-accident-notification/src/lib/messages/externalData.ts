import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    pageTitle: {
      id: 'aosh.wan.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Tilkynning um vinnuslys',
      description: `Application's name`,
    },
    subTitle: {
      id: 'aosh.wan.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'he following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aosh.wan.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description:
        'Agreement of having read the above statements regarding data fetching',
    },
    announcement: {
      id: 'aosh.wan.application:externalData.dataProvider.announcement',
      defaultMessage: 'Tilkynning',
      description: 'Announcement following prerequisites',
    },
    announcementDescription: {
      id: 'aosh.wan.application:externalData.dataProvider.announcementDescription#markdown',
      defaultMessage: `Vinsamlega athugaðu að þú ert innskráð/ur sem einstaklingur. 
        Atvinnurekanda ber skylda til að sjá til þess að vinnuslys sé tilkynnt til 
        Vinnueftirlitsins þegar slys verður vegna eða við vinnu á vinnustað hans 
        og starfsmaður verður óvinnufær í einn eða fleiri daga, umfram þann dag 
        sem slysið varð. Einstaklingar eiga ekki að tilkynna eigin slys inn til 
        Vinnueftirlitsins eina undantekningin á þessari reglu eru einstaklingar 
        sem reka eigin starfsemi á sinni eigin kennitölu. 
        \n Ef þú ert að skrá þessa tilkynningu fyrir hönd fyrirtækis þá væri æskilegra 
        að þú værir innskráður á vefinn með auðkenni viðkomandi fyrirtækis eða með umboð 
        frá fyrirtækinu til að skrá vinnuslys fyrir hönd þess. Athugaðu að þú munt ekki hafa aðgang að neinum upplýsingum 
        um aðrar tilkynningar fyrirtækisins.`,
      description: 'Announcement description following prerequisites',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.wan.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'aosh.wan.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.wan.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aosh.wan.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
}
