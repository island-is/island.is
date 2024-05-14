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
  errors: defineMessages({}),
  intro: defineMessages({
    sectionTitle: {
      id: 'hid.application:prerequisites.intro.section.title',
      defaultMessage: 'Upplýsingar til umsækjanda',
      description: 'Introduction section title',
    },
    text: {
      id: 'hid.application:prerequisites.intro.text#markdown',
      defaultMessage:
        '- Umsókn um kaup ríkisins á íbúðareign þinni skuldbindur þig ekki til að selja en með henni hefst söluferlið.\n- Nóg er að einn af eigendum fylli út umsóknina en þegar kemur að sölunni þurfa allir eigendur að undirrita.\n- Staðfesting umsóknar mun berast eigendum í Stafræna pósthólfið þeirra.\n- Gott er fyrir umsækjanda að þekkja öll lán eignar og uppgreiðsluverð þeirra því kallað er eftir þeim upphæðum í umsókninni.\n- Eftir að umsókn klárast hefst úrvinnsla hjá Þórkötlu en stefnt er að því að það ferli taki um 2-4 vikur.\n- Haft verður samband við eigendur ef einhver gögn vantar eða ef eitthvað stöðvar ferlið sem og til að fá staðfest formlega að óskað sé eftir að íbúðarhúsnæði verði keypt af ríkinu.',
      description: 'Introduction text',
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
