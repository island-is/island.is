import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared accross party letter application
  externalDataSection: defineMessages({
    title: {
      id: 'ple.application:terms.title',
      defaultMessage: 'Skilmálar',
      description: 'External data title',
    },
    subtitle: {
      id: 'ple.application:terms.subtitle',
      defaultMessage: 'Eftirfarandi gildir um umsókn og meðmælendasöfnun',
      description: 'External data subtitle',
    },
    dmrTitle: {
      id: 'ple.application:dmr.title',
      defaultMessage: 'Dómsmálaráðuneyti',
      description: 'External data DRM title',
    },
    dmrSubtitle: {
      id: 'ple.application:dmr.subtitle',
      defaultMessage: 'Skilmálar og reglugerðir',
      description: 'External data DRM subtitle',
    },
    nationalRegistryTitle: {
      id: 'ple.application:nationalRegistry.title',
      defaultMessage: 'Persónupplýsingar úr þjóðskrá',
      description: 'External data national registry title',
    },
    nationalRegistrySubtitle: {
      id: 'ple.application:nationalRegistry.subtitle',
      defaultMessage: 'Frekar skýring hér',
      description: 'External data national registry subtitle',
    },
    islandTitle: {
      id: 'ple.application:island.title',
      defaultMessage: 'Ísland.is',
      description: 'External data island.is title',
    },
    islandSubtitle: {
      id: 'ple.application:island.subtitle',
      defaultMessage: 'Lorem ipsum dolar sit amet, consectetur adipiscing elit',
      description: 'External data island.is subtitle',
    },
    agree: {
      id: 'ple.application:island.subtitle',
      defaultMessage: 'Lorem ipsum dolar sit amet, consectetur adipiscing elit',
      description: 'External data island.is subtitle',
    },
  }),
  recommendations: defineMessages({
    title: {
      id: 'ple.application:recommendations.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Recommendations title',
    },
    linkDescription: {
      id: 'ple.application:recommendations.link.description',
      defaultMessage: 'Hér er hlekkur til að senda út á fólk',
      description: 'Recommendations link description',
    },
  }),
  selectSSD: defineMessages({
    title: {
      id: 'ple.application:ssd.title',
      defaultMessage: 'Kennitala framboðs',
      description: 'Select SSD title',
    },
  }),
  selectPartyLetter: defineMessages({
    title: {
      id: 'ple.application:partyletter.title',
      defaultMessage: 'Skráðu nafn og listabókstaf',
      description: 'Party Letter title',
    },
    sectionTitle: {
      id: 'ple.application:partyletter.section.title',
      defaultMessage: 'Nafn flokks',
      description: 'Party Letter section title',
    },
    partyLetterLabel: {
      id: 'ple.application:partyletter.partyletter.label',
      defaultMessage: 'Listabókstafur sem óskað er eftir',
      description: 'Label for party letter input box',
    },
    partyLetterPlaceholder: {
      id: 'ple.application:partyletter.partyletter.placeholder',
      defaultMessage: 'Listabókstafur',
      description: 'Placeholder for party letter input box',
    },
    partyNameLabel: {
      id: 'ple.application:partyletter.partyname.label',
      defaultMessage: 'Nafn flokks',
      description: 'Label for party name input box',
    },
    partyNamePlaceholder: {
      id: 'ple.application:partyletter.partyname.placeholder',
      defaultMessage: 'Nafn',
      description: 'Placeholder for party name input box',
    },
    partyLetterSubtitle: {
      id: 'ple.application:partyletter.subtitle',
      defaultMessage:
        'Við  alþingiskosningarnar 28. október 2017 buðu eftirtalin stjórnmálasamtök fram lista og voru þeir merktir sem hér segir:',
      description: 'Description before listing upp unavailable party letters',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'ple.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    subtitle: {
      id: 'ple.application:overview.subtitle',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplisýngar hafi verið gefnar upp. ',
      description: 'Overview subtitle',
    },
    submitButton: {
      id: 'ple.application:overview.submit.button',
      defaultMessage: 'Skila lista',
      description: 'Overview submit button',
    },
    finalTitle: {
      id: 'ple.application:overview.final.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title after submit',
    },
    finalSubtitle: {
      id: 'ple.application:overview.final.subtitle',
      defaultMessage:
        'Þú munt fá skilaboð í tölvupósti þegar umsókn er í vinnslu',
      description: 'Subtitle after submit',
    },
  }),
}
