import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    sectionTitle: {
      id: 'hid.application:prerequisites.general.section.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection section title',
    },
    subTitle: {
      id: 'hid.application:prerequisites.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'Data collection section subtitle',
    },
    checkboxLabel: {
      id: 'hid.application:prerequisites.general.checkbox.label',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'Checkbox label',
    },
  }),
  errors: defineMessages({
    noDeclarationAvailableTitle: {
      id: 'hid.application:prerequisites.errors.noDeclarationAvailableTitle',
      defaultMessage: 'Engin yfirlýsing í boði',
      description:
        'Prerequisite error message title when no declaration is available',
    },
    noDeclarationAvailable: {
      id: 'hid.application:prerequisites.errors.noDeclarationAvailable#markdown',
      defaultMessage: `Engin yfirlýsing í boði, helstu ástæður eru þessar:
* Þú ert ekki með gilda sjúkratryggingu á Íslandi.
* Ekki eru einstaklingar á þínu lögheimili sem þú getur sótt yfirlýsingu fyrir

Ef þú telur þetta ekki rétt skaltu hafa samband hér: (ehic@sjukra.is)[mailto:ethic@sjukra.is]`,
      description:
        'Prerequisite error message when no declaration is available',
    },
  }),
  intro: defineMessages({
    sectionTitle: {
      id: 'hid.application:prerequisites.intro.section.title',
      defaultMessage: 'Upplýsingar til umsækjanda',
      description: 'Introduction section title',
    },
  }),
  dataProviders: defineMessages({
    nationalRegistryTitle: {
      id: 'hid.application:prerequisites.dataproviders.nationalregistry.title',
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National registry data provider title',
    },
    nationalRegistryDescription: {
      id: 'hid.application:prerequisites.dataproviders.nationalregistry.description',
      defaultMessage:
        'Upplýsingar um nafn, kennitölu og heimilisfang. Upplýsingar um maka og forsjá barna',
      description: 'National registry data provider description',
    },
    userProfileTitle: {
      id: 'hid.application:prerequisites.dataproviders.userprofile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User profile data provider title',
    },
    userProfileDescription: {
      id: 'hid.application:prerequisites.dataproviders.userprofile.description',
      defaultMessage:
        'Upplýsingar um símanúmer eða netfang til þess að auðvelda umsóknarferlið.',
      description: 'User profile data provider description',
    },
    healthInsuranceTitle: {
      id: 'hid.application:prerequisites.dataproviders.healthInsurance.title',
      defaultMessage: 'Sjúkratrygginar',
      description: 'Health insurance data provider title',
    },
    healthInsuranceDescription: {
      id: 'hid.application:prerequisites.dataproviders.healthInsurance.description',
      defaultMessage: 'Upplýsingar um stöðu á sjúkratryggingum',
      description: 'Health insurance data provider description',
    },
  }),
}
