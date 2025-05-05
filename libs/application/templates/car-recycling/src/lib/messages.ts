import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const carRecyclingMessages: MessageDir = {
  // Messages shared across the Car Recycling application templates
  shared: defineMessages({
    applicationName: {
      id: 'rf.cr.application:application.name',
      defaultMessage: 'Skilavottorð',
      description: 'Vehicle Recycling',
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
      id: 'rf.cr.application:external.data.sub.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'rf.cr.application:external.data.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
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
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'rf.cr.application:prerequisites.userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    externalDataTransportAuthorityTitle: {
      id: 'rf.cr.application:external.data.transport.authority.title',
      defaultMessage: 'Upplýsingar frá Samgöngustofu',
      description: 'Information from the Icelandic Transport Authority',
    },
    externalDataTransportAuthoritySubtitle: {
      id: 'rf.cr.application:external.data.transport.authority.description',
      defaultMessage: 'Upplýsingar um þín ökutæki',
      description: 'Information about your vehicles',
    },
    checkboxProvider: {
      id: 'rf.cr.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
  }),
  cars: defineMessages({
    list: {
      id: 'rf.cr.application:cars.list',
      defaultMessage: 'Ökutækjalisti',
      description: 'Vehicle list',
    },
    sectionTitle: {
      id: 'rf.cr.application:section.title',
      defaultMessage: 'Afskrá til endurvinnslu',
      description: 'Unregister for recycling',
    },
    search: {
      id: 'rf.cr.application:cars.search',
      defaultMessage: 'Leita að ökutæki',
      description: 'Search for vehicle',
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
      description: 'Cannot be recycled',
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
      description: 'Keeper',
    },
    onlyOwnerCanRecyle: {
      id: 'rf.cr.application:only.owner.can.recyle',
      defaultMessage: 'Aðeins eigandi ökutækis má skrá í endurvinnslu',
      description:
        'Only the owner of the vehicle may register it for recycling',
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
    mileage: {
      id: 'rf.cr.application:mileage',
      defaultMessage: 'Kílómetrastaða',
      description: 'Vehicles mileage status',
    },
    noVehicles: {
      id: 'rf.cr.application:no.vehicles',
      defaultMessage: 'Engin ökutæki fundust skráð á umsækjanda',
      description: 'No vehicles was found registered to the applicant',
    },
    vehicleSelected: {
      id: 'rf.cr.application:vehicle.selected',
      defaultMessage: 'Ökutæki valið til endurvinnslu',
      description: 'Vehicle selected for recycling',
    },
  }),
  review: defineMessages({
    confirmSectionTitle: {
      id: 'rf.cr.application:confirmation.section.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit the application',
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
      id: 'rf.cr.application:review.national.id',
      defaultMessage: 'Kennitala',
      description: 'Icelandic ID number',
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
    buttonsEdit: {
      id: 'rf.cr.application:review.buttons.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    mileage: {
      id: 'rf.cr.application:mileage',
      defaultMessage: 'Kílómetrastaða',
      description: 'Vehicles mileage status',
    },
    canceled: {
      id: 'rf.cr.application:review.canceled',
      defaultMessage: 'Hætt við afskráningu',
      description: 'Deregistration canceled',
    },
  }),
  conclusionScreen: defineMessages({
    title: {
      id: 'rf.cr.application:conclusion.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    alertTitle: {
      id: 'rf.cr.application:conclusion.screen.title',
      defaultMessage:
        'Ökutæki er tilbúið til afskráningar. Til að klára afskráningu þarf að fara með ökutækið til móttökuaðila. Greiðsla til eiganda kemur sjálfkrafa þegar bifreið hefur verið afhent til endurvinnslu.',
      description:
        'Vehicle is ready for deregistration. To finalise the deregistration process the vehicle must be delivered to a reception centre. A payment will automatically be deposited to the owner once the vehicle has been delivered for recycling',
    },
    accordionText: {
      id: 'rf.cr.application:conclusion.accordion.text#markdown',
      defaultMessage:
        'Þú ferð með ökutæki til móttökuaðila. Móttökuaðili tekur á móti ökutæki og afskráir. Greiðsla berst innan tveggja daga eftir afhendingu á ökutæki.',
      description:
        'You deliver the vehicle to a reception centre. A receiving partner recieves the vehicle and deregisters it. Payment shall be received within two days of the delivery of the vehicle',
    },
    nextStepsLabel: {
      id: 'rf.cr.application:conclusion.screen.next.steps.label',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    buttonsViewApplication: {
      id: 'rf.cr.application:conclusion.screen.buttons.view.application',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),
}

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'rf.cr.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have create a draft application.',
  },
  applicationSent: {
    id: 'rf.cr.application:application.sent.title',
    defaultMessage: 'Umsókn hefur verið send.',
    description: 'The application has been sent',
  },
  applicationSentDescription: {
    id: 'rf.cr.application:application.sent.description',
    defaultMessage: 'Hægt er að breyta umsókn',
    description: 'It is possible to edit the application',
  },
})

export const errorMessages = defineMessages({
  mustSelectAVehicle: {
    id: 'rf.cr.application:validator.must.select.a.vehicle',
    defaultMessage:
      'Vinsamlegast veldu að minnsta kosti eitt ökutæki til að halda áfram.',
    description: 'Please select at lest one vehicle to continue',
  },
  errorTitle: {
    id: 'rf.cr.application:error.error.title',
    defaultMessage: 'Það kom upp villa',
    description: 'Application check error title',
  },
  createOwnerDescription: {
    id: 'rf.cr.application:error.create.owner.description',
    defaultMessage: 'Ekki tókst að stofna eiganda bifreiðar hjá Úrvinnslusjóði',
    description:
      'Unable to create vehicle owner at the Icelandic Recycling Fund',
  },
  createVehicleDescription: {
    id: 'rf.cr.application:error.create.vehicle.description',
    defaultMessage: 'Ekki tókst að stofna valda bifreið hjá Úrvinnslusjóði',
    description:
      'Unable to create selected vehicle at the Icelandic Recycling Fund',
  },
  recycleVehicleDescription: {
    id: 'rf.cr.application:error.recycle.vehicle.description',
    defaultMessage:
      'Ekki tókst að skrá bifreið til endurvinnslu hjá Úrvinnslusjóði',
    description:
      'Unable to register vehicle for recycling at the Icelandic Recycling Fund',
  },
  cancelRecycleVehicleDescription: {
    id: 'rf.cr.application:error.cancel.recycle.vehicle.description',
    defaultMessage:
      'Ekki tókst að afskrá bifreið í endurvinnslu hjá Úrvinnslusjóði',
    description: 'Unable to deregister vehicle at the Icelandic Recycling Fund',
  },
  mileageMissing: {
    id: 'rf.cr.application:error.mileage.missing',
    defaultMessage: 'Það verður að setja inn kílómetrastöðu',
    description: 'Mileage as a mandatory',
  },
  mileageLowerThanLast: {
    id: 'rf.cr.application:error.mileage.lower.than.last',
    defaultMessage: 'Kílómetrastaðan verður að vera hærri en síðasta skráning',
    description: 'Mileage must be greater than last registration',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'rf.cr.application:in.review.form.title',
    defaultMessage: 'Skilavottorð',
    description: 'Vehicle Recycling',
  },
})
