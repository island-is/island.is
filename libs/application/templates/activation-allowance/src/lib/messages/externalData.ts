import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    pageTitle: {
      id: 'aa.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: `Data provider page title`,
    },
    subTitle: {
      id: 'aa.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'The following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'aa.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description:
        'Agreement of having read the above statements regarding data fetching',
    },
    buttonApprove: {
      id: 'aa.application:externalData.dataProvider.button.approve',
      defaultMessage: 'Staðfesta og halda áfram',
      description: 'Approve button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aa.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'aa.application:externalData.nationalRegistry.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aa.application:externalData.userProfile.title',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'aa.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  tax: defineMessages({
    title: {
      id: 'aa.application:externalData.tax.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Tax data provider title',
    },
    subTitle: {
      id: 'aa.application:externalData.tax.subTitle',
      defaultMessage:
        'Vinnumálastofnun sækir upplýsingar um launagreiðslur síðustu 36 mánaða, sbr. 4 mgr. 9. gr. laga nr. 54/2006 um atvinnuleysistryggingar og ákvæði laga nr. 90/2018 um persónuvernd og vinnslu persónuupplýsinga.',
      description: 'Tax data provider subtitle',
    },
  }),
  nationalInsuranceInstitute: defineMessages({
    title: {
      id: 'aa.application:externalData.nationalInsuranceInstitute.title',
      defaultMessage: 'Tryggingastofnun ríkisins',
      description: 'National insurance institute data provider title',
    },
    subTitle: {
      id: 'aa.application:externalData.nationalInsuranceInstitute.subTitle',
      defaultMessage:
        'Við framkvæmd laga um atvinnuleysistryggingar er VMST nauðsynlegt að afla upplýsinga um örorku, mæðra- og feðralaun og meðlag.',
      description: 'National insurance institute data provider subtitle',
    },
  }),
}
