import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const carRecyclingMessages: MessageDir = {
  // Messages shared across the Car Recycling application templates
  shared: defineMessages({
    applicationName: {
      id: 'rf.cr.application:application.name',
      defaultMessage: 'Skilavottorð',
      description: 'Application for car recycle',
    },
    institution: {
      id: 'rf.cr.application:institution.name',
      defaultMessage: 'Úrvinnslusjóður',
      description: 'Icelandic Recycling Fund',
    },
    formTitle: {
      id: 'rf.cr.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
  }),
  pre: defineMessages({
    prerequisitesSection: {
      id: 'rf.cr.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSubSection: {
      id: 'rf.cr.application:externalData.sub.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataDescription: {
      id: 'rf.cr.application:externalData.description',
      defaultMessage:
        'Eftirfarandi upplýsingar verða sóttar rafrænt með þínu samþykki',
      description: 'External data description',
    },
    nationalRegistryInformationTitle: {
      id: 'rf.cr.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'rf.cr.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
    userProfileInformationTitle: {
      id: 'rf.cr.application:prerequisites.userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from your account at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'rf.cr.application:prerequisites.userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from your account at Ísland.is.',
    },
    externalDataTransportAuthorityTitle: {
      id: 'rf.cr.application:externalData.transport.authority.title',
      defaultMessage: 'Upplýsingar frá Samgöngustofu',
      description: 'External data Transport authority title',
    },
    externalDataTransportAuthoritySubtitle: {
      id: 'rf.cr.application:externalData.transport.authority.description',
      defaultMessage: 'Upplýsingar um þín ökutæki',
      description: 'External data Transport authority description',
    },
    checkboxProvider: {
      id: 'rf.cr.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
  }),
  cars: defineMessages({
    list: {
      id: 'rf.cr.application:cars.list',
      defaultMessage: 'Ökutækjalisti',
      description: 'Cars list',
    },
    sectionTitle: {
      id: 'rf.cr.application:section.title',
      defaultMessage: 'Afskrá til endurvinnslu',
      description: 'Unregister for recycling',
    },
    filter: {
      id: 'rf.cr.application:cars.filter',
      defaultMessage: 'Sía ökutæki',
      description: 'Filter vehicles',
    },
    overview: {
      id: 'rf.cr.application:cars.overview',
      defaultMessage: 'Ökutæki',
      description: 'Vehicles',
    },
    recycle: {
      id: 'rf.cr.application:cars.recycle',
      defaultMessage: 'Endurvinna',
      description: 'Recycle',
    },
    cantBeRecycled: {
      id: 'rf.cr.application:cant.be.recycled',
      defaultMessage: 'Ekki hægt að endurvinna',
      description: 'Cant be recycled',
    },
    owner: {
      id: 'rf.cr.application:owner',
      defaultMessage: 'Eigandi',
      description: 'Owner',
    },
    coOwner: {
      id: 'rf.cr.application:co.owner',
      defaultMessage: 'Meðeigandi',
      description: 'Co-owner',
    },
    operator: {
      id: 'rf.cr.application:operator',
      defaultMessage: 'Umráðamaður',
      description: 'Operator',
    },
    onlyOwnerCanRecyle: {
      id: 'rf.cr.application:onlyOwnerCanRecyle',
      defaultMessage: 'Aðeins eigandi ökutækis má skrá í endurvinnslu',
      description: 'Only the owner of the vehicle may place it for recycling',
    },
    cancel: {
      id: 'rf.cr.application:cancel',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
    selectedTitle: {
      id: 'rf.cr.application:selected.title',
      defaultMessage: 'Ökutæki valin til endurvinnslu',
      description: 'Vehicles selected for recycling',
    },
  }),
  review: defineMessages({
    confirmSectionTitle: {
      id: 'rf.cr.application:confirmation.section.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit an application',
    },
    confirmationDescription: {
      id: 'rf.cr.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    name: {
      id: 'rf.cr.application:review.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'rf.cr.application:review.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    address: {
      id: 'rf.cr.application:review.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    municipality: {
      id: 'rf.cr.application:review.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    carsSectionTitle: {
      id: 'rf.cr.application:review.cars.section.title',
      defaultMessage: 'Ökutæki valin til endurvinnslu',
      description: 'Vehicles selected for recycling',
    },
  }),
  conclusionScreen: defineMessages({
    title: {
      id: 'rf.cr.application:conclusion.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Car recycling application recieved',
    },
    alertTitle: {
      id: 'rf.cr.application:conclusion.screen.title',
      defaultMessage:
        'Ökutæki er tilbúið til afskráningar. Til að klára afskráningu þarf að fara með ökutækið til móttökuaðila. Greiðsla til eiganda kemur sjálfkrafa er bifreið hefur verið afhent til endurvinnslu.',
      description: 'Vehicles ready for deregistration',
    },
    bulletList: {
      id: `rf.cr.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Þú ferð með ökutæki til móttökuaðila.\n* Móttökuaðili tekur á móti ökutæki og afskráir.\n* Greiðsla berst innan tveggja daga eftir afhendingu á ökutæki.`,
      description: 'BulletList',
    },
    nextStepsLabel: {
      id: 'rf.cr.application:conclusionScreen.nextStepsLabel',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    buttonsViewApplication: {
      id: 'rf.cr.application:conclusionScreen.buttonsViewApplication',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),
}

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'rf.cr.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'Description of the state - draft',
  },
})

export const errorMessages = defineMessages({
  mustSelectACar: {
    id: 'rf.cr.application:validator.mustSelectACar',
    defaultMessage:
      'Vinsamlegast veldu að minnsta kosti eitt ökutæki til að halda áfram.',
    description: 'Please select a vehicle then continue',
  },
})
