import { defineMessages } from 'react-intl'

export const externalData = defineMessages({
  formTitle: {
    id: 'atr.application:externalData.formTitle',
    defaultMessage: 'Umsókn um endurgreiðslu áfengisútgjalda',
    description: 'Title for externalDataSection',
  },
  sectionTitle: {
    id: 'atr.application:externalData.sectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for externalDataSection',
  },
  checkboxLabel: {
    id: 'atr.application:externalData.checkboxLabel',
    defaultMessage:
      'Ég samþykki að gögnin sem sótt verða séu notað til að útfæra þessa umsókn.',
    description: 'Checkbox label for externalDataSection',
  },
  title: {
    id: 'atr.application:externalData.title',
    defaultMessage: 'Gögn sem sótt verða',
    description: 'Title for fetching data',
  },
  userProfileTitle: {
    id: 'atr.application:externalData.userProfileTitle',
    defaultMessage: 'Þjóðskrá ísland',
    description: 'Title for fetching data',
  },
  userProfileSubTitle: {
    id: 'atr.application:externalData.userProfileSubTitle',
    defaultMessage: 'Sótt verður aldur umsækjanda og kennitala.',
    description: 'Title for fetching data',
  },
  userProfileTitleValidateAgeError: {
    id: 'atr.application:externalData.userProfileTitle.ValidateAgeError',
    defaultMessage: 'Leyfilegur aldur til áfengiskaupa er 20 ára og eldri.',
    description:
      'Error Title when age restriciton from national registry is not met',
  },
  userProfileSubTitleValidateAgeError: {
    id: 'atr.application:externalData.userProfileSubTitle.ValidateAgeError',
    defaultMessage:
      'Leyfilegur aldur þeirra sem kaupa áfengi er 20 ára og eldri og ólíklegt að það komi til með að breytast á næstunni. Ef þú náðir að koma þér framhjá aldurstakmörkunum og kaupa þér áfengi er ekki hægt með góðu móti að endurgreiða þér áfengisgjöldin.',
    description:
      'Error message when age restriciton from national registry is not met',
  },
  rskTitle: {
    id: 'atr.application:externalData.rskTitle',
    defaultMessage: 'Skatturinn',
    description: 'Title for skatturinn dataprovider',
  },
  rskSubTitle: {
    id: 'atr.application:externalData.rskSubTitle',
    defaultMessage: 'Upplýsingar um greiðslu skatta á íslandi.',
    description: 'SubTitle for skatturinn dataprovider',
  },
  sysludmadurTitle: {
    id: 'atr.application:externalData.sysludmadurTitle',
    defaultMessage: 'Sýslumaður',
    description: 'Title for sýslumaður dataprovider',
  },
  sysludmadurSubTitle: {
    id: 'atr.application:externalData.sysludmadurSubTitle',
    defaultMessage: 'Sakavottorð.',
    description: 'SubTitle for sýslumaður dataprovider',
  },
  atvrTitle: {
    id: 'atr.application:externalData.atvrTitle',
    defaultMessage: 'Áfengis- og tóbaksverslun ríksins',
    description: 'Title for alþjóðlegur vinnsluvefur dataprovider',
  },
  atvrSubTitle: {
    id: 'atr.application:externalData.atvrSubTitle',
    defaultMessage:
      'Uppfletting í gagnagrunni ÁTVR til að fletta upp viðskiptum notanda.',
    description: 'SubTitle for alþjóðlegur vinnsluvefur dataprovider',
  },
  submitButtonTitle: {
    id: 'atr.application:externalData.submitButtonTitle',
    defaultMessage: 'Hefja umsókn',
    description: 'Title for submitting data provider screen',
  },
})
