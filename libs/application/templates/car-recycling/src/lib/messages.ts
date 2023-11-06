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
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'english translation',
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
      defaultMessage: 'Ökutæki í afskrá til endurvinnslu',
      description: 'Vehicles deregistered for recycling',
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
