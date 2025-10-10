import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section',
    },
    tabTitle: {
      id: 'vmst.ub.application:externalData.dataProvider.tabTitle',
      defaultMessage: 'Forkröfur',
      description: 'Tab title of external data section',
    },
    submitButton: {
      id: 'vmst.ub.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Staðfesta og halda áfram',
      description: 'Continue to application',
    },
    checkboxLabel: {
      id: 'vmst.ub.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'vmst.ub.application:externalData.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry/Company Registry',
    },
    subTitle: {
      id: 'vmst.ub.application:externalData.nationalRegistry.subTitle',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'We will fetch name, national id and address',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'vmst.ub.application:externalData.userProfile.title',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'vmst.ub.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Upplýsingar um símanúmer og netfang til að auðvelda umsóknarferlið.',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  tax: defineMessages({
    title: {
      id: 'vmst.ub.application:externalData.tax.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Your tax info from the tax registry',
    },
    subTitle: {
      id: 'vmst.ub.application:externalData.tax.subTitle',
      defaultMessage:
        'Vinnumálastofnun sækir upplýsingar um launagreiðslur síðustu 36 mánaða, sbr. 4 mgr. 9. gr. laga nr. 54/2006 um atvinnuleysisbætur og ákvæði laga nr. 90/2018 um persónuvernd og vinnslu persónuupplýsinga.',
      description: 'To make stuff easier',
    },
  }),
  vmst: defineMessages({
    rskTitle: {
      id: 'vmst.ub.application:externalData.vmst.rskTitle',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Rsk information from VMST title',
    },
    rskSubTitle: {
      id: 'vmst.ub.application:externalData.vmst.rskSubTitle',
      defaultMessage:
        'Vinnumálastofnun sækir upplýsingar um launagreiðslur síðustu 36 mánaða, sbr. 4 mgr. 9. gr. laga nr. 54/2006 um atvinnuleysisbætur og ákvæði laga nr. 90/2018 um persónuvernd og vinnslu persónuupplýsinga.',
      description: 'Rsk information from VMST description',
    },
    insuranceTitle: {
      id: 'vmst.ub.application:externalData.vmst.insuranceTitle',
      defaultMessage: 'Tryggingastofnun ríkisins',
      description: 'Rsk information from VMST title',
    },
    insuranceSubTitle: {
      id: 'vmst.ub.application:externalData.vmst.insuranceSubTitle',
      defaultMessage:
        ' Við framkvæmd laga um atvinnuleysisbætur er VMST nauðsynlegt að afla upplýsinga um örorku, mæðra- og feðralaun og meðlag.',
      description: 'Rsk information from VMST description',
    },
  }),
}
