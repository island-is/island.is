import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    formTitle: {
      id: 'hst.application:prerequisites.general.form.title',
      defaultMessage: 'Forsendur',
      description: 'Data collection form title',
    },
    sectionTitle: {
      id: 'hst.application:prerequisites.general.section.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection section title',
    },
    infoTitle: {
      id: 'hst.application:prerequisites.general.info.title',
      defaultMessage: 'Upplýsingar til notenda',
      description: 'User information section title',
    },
    infoDescription: {
      id: 'hst.application:prerequisites.general.info.description#markdown',
      defaultMessage:
        'Heimaþjónusta fer fram á heimili fólks  og í gegnum rafrænar lausnir, eða þar sem best hentar. Hann felur í sér stuðning við að sinna daglegum verkefnum og almennu heimilishaldi auk þess sem samskipti, samvera og hvatning er höfð í fyrirrúmi.',
      description: 'User information section description',
    },
    checkboxLabel: {
      id: 'hst.application:prerequisites.general.checkbox.label',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'Checkbox label',
    },
  }),
  dataProviders: defineMessages({
    nationalRegistryTitle: {
      id: 'hst.application:prerequisites.dataproviders.nationalregistry.title',
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National registry data provider title',
    },
    nationalRegistryDescription: {
      id: 'hst.application:prerequisites.dataproviders.nationalregistry.description',
      defaultMessage:
        'Upplýsingar um nafn, kennitölu og heimilisfang. Upplýsingar um börn og maka með sama lögheimili.',
      description: 'National registry data provider description',
    },
    userProfileTitle: {
      id: 'hst.application:prerequisites.dataproviders.userprofile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User profile data provider title',
    },
    userProfileDescription: {
      id: 'hst.application:prerequisites.dataproviders.userprofile.description',
      defaultMessage:
        'Upplýsingar um símanúmer eða netfang er hægt að uppfæra á vefsíðu island.is ef þess þarf.',
      description: 'User profile data provider description',
    },
    internalRevenueTitle: {
      id: 'hst.application:prerequisites.dataproviders.ir.title',
      defaultMessage: 'Skatturinn',
      description: 'Internal revenue data provider title',
    },
    internalRevenueDescription: {
      id: 'hst.application:prerequisites.dataproviders.ir.description',
      defaultMessage:
        'Afrit af skattframtali og upplýsingar um staðgreiðslu í staðgreiðsluskrá.',
      description: 'Internal revenue data provider description',
    },
    healthInsuranceTitle: {
      id: 'hst.application:prerequisites.dataproviders.hi.title',
      defaultMessage: 'Sjúkratryggingar',
      description: 'Health insurance data provider title',
    },
    healthInsuranceDescription: {
      id: 'hst.application:prerequisites.dataproviders.hi.description',
      defaultMessage:
        'Upplýsingar um heilsugæslustöð eða sjálfstætt starfandi heimilislækni.',
      description: 'Health insurance data provider description',
    },
  }),
}
