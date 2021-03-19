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
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplisýngar hafi verið gefnar upp.',
      description: 'Overview subtitle',
    },
    reviewTitle: {
      id: 'ple.application:overview.review.title',
      defaultMessage: 'Upplýsingar um listabókstaf',
      description: 'Overview review title',
    },
    partyLetter: {
      id: 'ple.application:overview.partyletter',
      defaultMessage: 'Listabókstafur',
      description: 'Overview label for party letter',
    },
    partyName: {
      id: 'ple.application:overview.partyname',
      defaultMessage: 'Nafn flokks',
      description: 'Overview label for party name',
    },
    responsibleParty: {
      id: 'ple.application:overview.responsible.party',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Overview label for responsible party',
    },
    signaturesCount: {
      id: 'ple.application:overview.signatures.count',
      defaultMessage: 'Fjöldi meðmælenda',
      description: 'Overview label for signatures count',
    },
    warningCount: {
      id: 'ple.application:overview.warning.count',
      defaultMessage: 'Fjöldi meðmælenda í vafa',
      description: 'Overview label for signatures count with warning',
    },
    includePapers: {
      id: 'ple.application:overview.include.papers',
      defaultMessage: 'Ég er líka með meðmælendur á pappír',
      description: 'Overview label for include papers checkbox',
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
  validationMessages: defineMessages({
    approveTerms: {
      id: 'ple.application:validationmessages.approveTerms',
      defaultMessage: 'Vinsamlegast samþykktu skilmála',
      description: 'Error message for terms and conditions',
    },
    ssd: {
      id: 'ple.application:validationmessages.ssd',
      defaultMessage: 'Vinsamlegast veldu kennitölu',
      description: 'Error message for selection ssd',
    },
    partyLetterOccupied: {
      id: 'ple.application:validationmessages.letter.occupied',
      defaultMessage: 'Bókstafur þegar á skrá',
      description: 'Error message if party letter is occupied',
    },
    partyLetterSingle: {
      id: 'ple.application:validationmessages.letter.single',
      defaultMessage: 'Bókstafur skal vera stakur',
      description: 'Error message if party letter is empty or > 1',
    },
    partyName: {
      id: 'ple.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu nafn á flokkinn',
      description: 'Error message if party name is empty',
    },
  }),
}
