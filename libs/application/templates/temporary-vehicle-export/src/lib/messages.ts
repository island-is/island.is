import { defineMessages } from 'react-intl'

export const m = {
  application: defineMessages({
    name: {
      id: 'rsk.tve.application:name',
      defaultMessage: 'Tímabundinn útflutningur ökutækis',
      description: 'Name of the application',
    },
    institution: {
      id: 'rsk.tve.application:institution',
      defaultMessage: 'Skatturinn',
      description: 'Institution name',
    },
    pendingArrivalTitle: {
      id: 'rsk.tve.application:pending.arrival.title',
      defaultMessage: 'Skrá þarf akstursstöðu við komu',
      description: 'Pending action title while the vehicle is abroad',
    },
    pendingArrivalContent: {
      id: 'rsk.tve.application:pending.arrival.content',
      defaultMessage:
        'Þegar ökutækið er komið aftur til landsins þarf að ljúka umsókninni með því að skrá akstursstöðu við komu og hlaða upp gögnum sem sýna fram á ferðina.',
      description: 'Pending action content while the vehicle is abroad',
    },
    pendingArrivalButton: {
      id: 'rsk.tve.application:pending.arrival.button',
      defaultMessage: 'Skrá komu',
      description: 'Pending action button while the vehicle is abroad',
    },
    historyDepartureRegistered: {
      id: 'rsk.tve.application:history.departure.registered',
      defaultMessage: 'Akstursstaða við brottför skráð',
      description: 'History log when the departure mileage is registered',
    },
    historyArrivalRegistered: {
      id: 'rsk.tve.application:history.arrival.registered',
      defaultMessage: 'Akstursstaða við komu skráð og umsókn send Skattinum',
      description: 'History log when the application is completed',
    },
  }),
  prerequisites: defineMessages({
    tabTitle: {
      id: 'rsk.tve.application:prerequisites.tab.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites tab title',
    },
    title: {
      id: 'rsk.tve.application:prerequisites.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Prerequisites title',
    },
    checkbox: {
      id: 'rsk.tve.application:prerequisites.checkbox',
      defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
      description: 'Prerequisites approval checkbox',
    },
    vehiclesTitle: {
      id: 'rsk.tve.application:prerequisites.vehicles.title',
      defaultMessage: 'Ökutæki og akstursstaða',
      description: 'Vehicles data provider title',
    },
    vehiclesSubTitle: {
      id: 'rsk.tve.application:prerequisites.vehicles.subtitle',
      defaultMessage:
        'Upplýsingar frá Samgöngustofu um ökutæki í þinni umsjá sem greitt er kílómetragjald af, ásamt síðustu skráðu akstursstöðu.',
      description: 'Vehicles data provider subtitle',
    },
    noEligibleVehicles: {
      id: 'rsk.tve.application:prerequisites.no.eligible.vehicles',
      defaultMessage:
        'Ekkert ökutæki fannst í þinni umsjá sem greitt er kílómetragjald af.',
      description: 'Error when the user has no eligible vehicles',
    },
  }),
  vehicle: defineMessages({
    sectionTitle: {
      id: 'rsk.tve.application:vehicle.section.title',
      defaultMessage: 'Ökutæki',
      description: 'Vehicle section title',
    },
    title: {
      id: 'rsk.tve.application:vehicle.title',
      defaultMessage: 'Veldu ökutæki',
      description: 'Vehicle selection title',
    },
    description: {
      id: 'rsk.tve.application:vehicle.description',
      defaultMessage:
        'Veldu það ökutæki sem flutt verður tímabundið úr landi. Aðeins eru birt ökutæki sem greitt er kílómetragjald af.',
      description: 'Vehicle selection description',
    },
  }),
  departure: defineMessages({
    sectionTitle: {
      id: 'rsk.tve.application:departure.section.title',
      defaultMessage: 'Brottför',
      description: 'Departure section title',
    },
    title: {
      id: 'rsk.tve.application:departure.title',
      defaultMessage: 'Akstursstaða við brottför',
      description: 'Departure title',
    },
    description: {
      id: 'rsk.tve.application:departure.description',
      defaultMessage:
        'Skráðu brottfarardag og akstursstöðu ökutækisins eins og hún er við brottför. Umsóknin helst opin þar til þú kemur aftur til landsins.',
      description: 'Departure description',
    },
    date: {
      id: 'rsk.tve.application:departure.date',
      defaultMessage: 'Brottfarardagur',
      description: 'Departure date label',
    },
    mileage: {
      id: 'rsk.tve.application:departure.mileage',
      defaultMessage: 'Akstursstaða við brottför',
      description: 'Departure mileage label',
    },
    latestMileage: {
      id: 'rsk.tve.application:departure.latest.mileage',
      defaultMessage: 'Síðasta skráða akstursstaða: {mileage}',
      description: 'Latest registered mileage of the selected vehicle',
    },
  }),
  arrival: defineMessages({
    sectionTitle: {
      id: 'rsk.tve.application:arrival.section.title',
      defaultMessage: 'Koma',
      description: 'Arrival section title',
    },
    title: {
      id: 'rsk.tve.application:arrival.title',
      defaultMessage: 'Akstursstaða við komu',
      description: 'Arrival title',
    },
    description: {
      id: 'rsk.tve.application:arrival.description',
      defaultMessage:
        'Skráðu komudag og akstursstöðu ökutækisins eins og hún er við komu til landsins.',
      description: 'Arrival description',
    },
    date: {
      id: 'rsk.tve.application:arrival.date',
      defaultMessage: 'Komudagur',
      description: 'Arrival date label',
    },
    mileage: {
      id: 'rsk.tve.application:arrival.mileage',
      defaultMessage: 'Akstursstaða við komu',
      description: 'Arrival mileage label',
    },
    departureInfo: {
      id: 'rsk.tve.application:arrival.departure.info',
      defaultMessage: 'Brottför skráð {date} með akstursstöðu {mileage}.',
      description: 'Summary of the registered departure',
    },
  }),
  proofOfTravel: defineMessages({
    sectionTitle: {
      id: 'rsk.tve.application:proof.of.travel.section.title',
      defaultMessage: 'Fylgigögn',
      description: 'Proof of travel section title',
    },
    title: {
      id: 'rsk.tve.application:proof.of.travel.title',
      defaultMessage: 'Staðfesting á ferð',
      description: 'Proof of travel title',
    },
    description: {
      id: 'rsk.tve.application:proof.of.travel.description',
      defaultMessage:
        'Hlaðið upp gögnum sem sýna fram á að ökutækið hafi farið úr landi, t.d. bókunarupplýsingum frá skipafélagi eða farmskrá frá skipa- eða flugfélagi.',
      description: 'Proof of travel description',
    },
    uploadHeader: {
      id: 'rsk.tve.application:proof.of.travel.upload.header',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Upload header',
    },
    uploadDescription: {
      id: 'rsk.tve.application:proof.of.travel.upload.description',
      defaultMessage:
        'Tekið er við skjölum með endingu: .pdf, .docx, .jpg, .png',
      description: 'Upload description',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'rsk.tve.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    departureTitle: {
      id: 'rsk.tve.application:overview.departure.title',
      defaultMessage: 'Yfirlit brottfarar',
      description: 'Overview title before departure is registered',
    },
    departureDescription: {
      id: 'rsk.tve.application:overview.departure.description',
      defaultMessage:
        'Þegar þú staðfestir er akstursstaða við brottför send til Samgöngustofu. Umsóknin bíður svo þar til þú skráir komu ökutækisins til landsins.',
      description: 'Overview description before departure is registered',
    },
    arrivalTitle: {
      id: 'rsk.tve.application:overview.arrival.title',
      defaultMessage: 'Yfirlit ferðar',
      description: 'Overview title before arrival is registered',
    },
    arrivalDescription: {
      id: 'rsk.tve.application:overview.arrival.description',
      defaultMessage:
        'Þegar þú staðfestir er akstursstaða við komu send til Samgöngustofu og upplýsingar um ferðina ásamt fylgigögnum sendar til Skattsins.',
      description: 'Overview description before arrival is registered',
    },
    vehicle: {
      id: 'rsk.tve.application:overview.vehicle',
      defaultMessage: 'Ökutæki',
      description: 'Overview vehicle label',
    },
    departureDate: {
      id: 'rsk.tve.application:overview.departure.date',
      defaultMessage: 'Brottfarardagur',
      description: 'Overview departure date label',
    },
    departureMileage: {
      id: 'rsk.tve.application:overview.departure.mileage',
      defaultMessage: 'Akstursstaða við brottför',
      description: 'Overview departure mileage label',
    },
    arrivalDate: {
      id: 'rsk.tve.application:overview.arrival.date',
      defaultMessage: 'Komudagur',
      description: 'Overview arrival date label',
    },
    arrivalMileage: {
      id: 'rsk.tve.application:overview.arrival.mileage',
      defaultMessage: 'Akstursstaða við komu',
      description: 'Overview arrival mileage label',
    },
    mileageDrivenAbroad: {
      id: 'rsk.tve.application:overview.mileage.driven.abroad',
      defaultMessage: 'Ekið erlendis',
      description: 'Overview label for km driven while abroad',
    },
    attachments: {
      id: 'rsk.tve.application:overview.attachments',
      defaultMessage: 'Fylgigögn',
      description: 'Overview attachments label',
    },
    registerDeparture: {
      id: 'rsk.tve.application:overview.register.departure',
      defaultMessage: 'Skrá brottför',
      description: 'Submit button for departure',
    },
    registerArrival: {
      id: 'rsk.tve.application:overview.register.arrival',
      defaultMessage: 'Skrá komu og senda',
      description: 'Submit button for arrival',
    },
  }),
  conclusion: defineMessages({
    alertTitle: {
      id: 'rsk.tve.application:conclusion.alert.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Conclusion alert title',
    },
    alertMessage: {
      id: 'rsk.tve.application:conclusion.alert.message',
      defaultMessage:
        'Akstursstaða við komu hefur verið skráð hjá Samgöngustofu og upplýsingar um ferðina sendar til Skattsins.',
      description: 'Conclusion alert message',
    },
  }),
  errors: defineMessages({
    dateInFuture: {
      id: 'rsk.tve.application:errors.date.in.future',
      defaultMessage: 'Dagsetning má ekki vera fram í tímann',
      description: 'Date cannot be in the future',
    },
    arrivalBeforeDeparture: {
      id: 'rsk.tve.application:errors.arrival.before.departure',
      defaultMessage: 'Komudagur má ekki vera á undan brottfarardegi',
      description: 'Arrival date is before departure date',
    },
    mileageInvalid: {
      id: 'rsk.tve.application:errors.mileage.invalid',
      defaultMessage: 'Akstursstaða þarf að vera heil tala stærri en 0',
      description: 'Mileage is not a positive integer',
    },
    mileageLowerThanLatest: {
      id: 'rsk.tve.application:errors.mileage.lower.than.latest',
      defaultMessage:
        'Akstursstaða má ekki vera lægri en síðasta skráða akstursstaða',
      description: 'Mileage lower than the latest registered mileage',
    },
    mileageLowerThanDeparture: {
      id: 'rsk.tve.application:errors.mileage.lower.than.departure',
      defaultMessage:
        'Akstursstaða við komu má ekki vera lægri en akstursstaða við brottför',
      description: 'Arrival mileage lower than departure mileage',
    },
    vehicleNotFound: {
      id: 'rsk.tve.application:errors.vehicle.not.found',
      defaultMessage:
        'Ökutækið fannst ekki eða þú hefur ekki heimild til að skrá akstursstöðu þess.',
      description: 'Selected vehicle not found or not registerable',
    },
    registerMileageFailed: {
      id: 'rsk.tve.application:errors.register.mileage.failed',
      defaultMessage:
        'Ekki tókst að skrá akstursstöðu hjá Samgöngustofu. Vinsamlegast reyndu aftur síðar.',
      description: 'Registering mileage at Samgöngustofa failed',
    },
    submitToSkatturinnFailed: {
      id: 'rsk.tve.application:errors.submit.to.skatturinn.failed',
      defaultMessage:
        'Ekki tókst að senda upplýsingar til Skattsins. Vinsamlegast reyndu aftur síðar.',
      description: 'Sending data to Skatturinn failed',
    },
  }),
}
