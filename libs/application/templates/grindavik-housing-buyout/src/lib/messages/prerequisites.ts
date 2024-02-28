import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    sectionTitle: {
      id: 'ghb.application:prerequisites.general.section.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection section title',
    },
    checkboxLabel: {
      id: 'ghb.application:prerequisites.general.checkbox.label',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'Checkbox label',
    },
  }),
  errors: defineMessages({
    noResidenceTitle: {
      id: 'ghb.application:errors.noResidence.title',
      defaultMessage: 'Lögheimili ekki í Grindavík 10. nóvember 2023',
      description: 'Not eligible section title',
    },
    noResidenceDescription: {
      id: 'ghb.application:errors.noResidence.description#markdown',
      defaultMessage:
        'Samkvæmt upplýsingum um lögheimili frá **Þjóðskrá** varst þú með skráð lögeimili í **{locality}** þann 10. nóvember 2023.\n\nÞessi umsókn er aðeins fyrir einstaklinga með lögheimili í Grindavík þann 10. nóvember 2023.',
      description: 'Not eligible description',
    },
    youAreNotTheOwnerTitle: {
      id: 'ghb.application:errors.youAreNotTheOwner.title',
      defaultMessage: 'Ekki þinglýstur eigandi',
      description: 'Not eligible section title',
    },
    youAreNotTheOwnerDescription: {
      id: 'ghb.application:errors.youAreNotTheOwner.description#markdown',
      defaultMessage:
        'Samkvæmt **húsnæðis og mannvirkjastofnun** varst þú ekki þinglýstur eigandi að **{streetName}** þar sem þú varst með lögheimili þann 10.nóvember 2023.',
      description: 'Not eligible description',
    },
  }),
  dataProviders: defineMessages({
    nationalRegistryTitle: {
      id: 'ghb.application:prerequisites.dataproviders.nationalregistry.title',
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National registry data provider title',
    },
    nationalRegistryDescription: {
      id: 'ghb.application:prerequisites.dataproviders.nationalregistry.description',
      defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang.',
      description: 'National registry data provider description',
    },
    userProfileTitle: {
      id: 'ghb.application:prerequisites.dataproviders.userprofile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User profile data provider title',
    },
    userProfileDescription: {
      id: 'ghb.application:prerequisites.dataproviders.userprofile.description',
      defaultMessage:
        'Upplýsingar um símanúmer eða netfang til þess að auðvelda umsóknarferlið.',
      description: 'User profile data provider description',
    },
    getGrindavikHousingTitle: {
      id: 'ghb.application:prerequisites.dataproviders.getGrindavikHousing.title',
      defaultMessage: 'Upplýsingar frá Húsnæðis- og mannvirkjastofnun',
      description: 'Grindavik housing data provider title',
    },
    getGrindavikHousingDescription: {
      id: 'ghb.application:prerequisites.dataproviders.getGrindavikHousing.description',
      defaultMessage:
        'Upplýsingar um eignarhlutfall, notkunareiningar og brunabótamat.',
      description: 'Grindavik housing data provider description',
    },
    getResidenceHistoryTitle: {
      id: 'ghb.application:prerequisites.dataproviders.getResidenceHistory.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá um lögheimili',
      description: 'Residence history data provider title',
    },
    getResidenceHistoryDescription: {
      id: 'ghb.application:prerequisites.dataproviders.getResidenceHistory.description',
      defaultMessage:
        'Upplýsingar um hvort lögheimili sé í Grindavík 10. nóvember 2023.',
      description: 'Residence history data provider description',
    },
  }),
}
