import { defineMessages } from 'react-intl'

export const m = {
  application: defineMessages({
    name: {
      id: 'rsk.cei.application:name',
      defaultMessage: 'Skráning km stöðu á út/innflutningi',
      description: 'Application name',
    },
    institution: {
      id: 'rsk.cei.application:institution',
      defaultMessage: 'Skatturinn',
      description: 'Application institution',
    },
  }),

  prerequisites: defineMessages({
    title: {
      id: 'rsk.cei.application:prerequisites.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Section title for external data consent',
    },
    approvalCheckboxLabel: {
      id: 'rsk.cei.application:prerequisites.checkbox',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Consent checkbox label',
    },
    vehiclesTitle: {
      id: 'rsk.cei.application:prerequisites.vehicles.title',
      defaultMessage: 'Upplýsingar frá Samgöngustofu',
      description: 'Transport Authority data provider title',
    },
    vehiclesSubTitle: {
      id: 'rsk.cei.application:prerequisites.vehicles.subtitle',
      defaultMessage: 'Upplýsingar um ökutæki þín.',
      description: 'Transport Authority data provider subtitle',
    },
    confirmButton: {
      id: 'rsk.cei.application:prerequisites.confirm',
      defaultMessage: 'Staðfesta',
      description: 'Confirm data collection',
    },
  }),

  registrationType: defineMessages({
    sectionTitle: {
      id: 'rsk.cei.application:registration.type.section.title',
      defaultMessage: 'Tegund skráningar',
      description: 'Registration type section title',
    },
    title: {
      id: 'rsk.cei.application:registration.type.title',
      defaultMessage: 'Tegund skráningar',
      description: 'Registration type title',
    },
    description: {
      id: 'rsk.cei.application:registration.type.description',
      defaultMessage: 'Skráning inn/út úr landi',
      description: 'Registration type description',
    },
    optionExport: {
      id: 'rsk.cei.application:registration.type.option.export',
      defaultMessage: 'Skrá bíla út úr landi',
      description: 'Export vehicles option',
    },
    optionImport: {
      id: 'rsk.cei.application:registration.type.option.import',
      defaultMessage: 'Skrá bíla inn í landið',
      description: 'Import vehicles option',
    },
  }),

  exportVehicles: defineMessages({
    title: {
      id: 'rsk.cei.application:exportVehicles.title',
      defaultMessage: 'Ökutæki',
      description: 'Export vehicles title',
    },
    description: {
      id: 'rsk.cei.application:exportVehicles.description',
      defaultMessage:
        'Veldu ökutæki sem þú ætlar að flytja tímabundið úr landi. Þú getur valið fleiri en eitt ökutæki.',
      description: 'Export vehicles description',
    },
    alertMessage: {
      id: 'rsk.cei.application:exportVehicles.alert.message',
      defaultMessage:
        'Kílómetragjald er 6 kr/km. Þegar ökutæki er flutt tímabundið úr landi þarf að skrá km stöðu við brottför og komu til að tryggja að gjald sé ekki innheimt fyrir akstur erlendis.',
      description: 'Export vehicles info alert message',
    },
    alertTitle: {
      id: 'rsk.cei.application:exportVehicles.alert.title',
      defaultMessage: 'Athugið',
      description: 'Export vehicles alert title',
    },
    checkboxLabel: {
      id: 'rsk.cei.application:exportVehicles.checkbox.label',
      defaultMessage: 'Ökutæki skráð á þig',
      description: 'Export vehicles checkbox group label',
    },
    selectedCount: {
      id: 'rsk.cei.application:exportVehicles.selected.count',
      defaultMessage: 'Ökutæki valin',
      description: 'Export vehicles selected count label',
    },
  }),

  importVehicles: defineMessages({
    title: {
      id: 'rsk.cei.application:importVehicles.title',
      defaultMessage: 'Ökutæki',
      description: 'Import vehicles title',
    },
    description: {
      id: 'rsk.cei.application:importVehicles.description',
      defaultMessage:
        'Veldu ökutæki sem þú ert að flytja aftur inn í landið. Þú getur valið fleiri en eitt ökutæki.',
      description: 'Import vehicles description',
    },
    checkboxLabel: {
      id: 'rsk.cei.application:importVehicles.checkbox.label',
      defaultMessage: 'Ökutæki skráð á þig',
      description: 'Import vehicles checkbox group label',
    },
    selectedCount: {
      id: 'rsk.cei.application:importVehicles.selected.count',
      defaultMessage: 'Ökutæki valin',
      description: 'Import vehicles selected count label',
    },
  }),

  commonDatesAndMileageMessages: defineMessages({
    sectionTitle: {
      id: 'rsk.cei.application:dates.mileage.section.title',
      defaultMessage: 'Dagsetningar og km staða',
      description: 'Common dates and mileage section title',
    },
    title: {
      id: 'rsk.cei.application:dates.mileage.title',
      defaultMessage: 'Dagsetningar og km staða',
      description: 'Common dates and mileage title',
    },
  }),

  importDatesAndMileage: defineMessages({
    description: {
      id: 'rsk.cei.application:importDates.mileage.description',
      defaultMessage:
        'Skráðu dagsetningar ferðar og km stöðu hvers ökutækis við komu inn í landið.',
      description: 'Dates and mileage description',
    },
    returnDateLabel: {
      id: 'rsk.cei.application:importDates.mileage.return.date',
      defaultMessage: 'Áætlaður heimkomudagur',
      description: 'Return date label',
    },
    mileageLabel: {
      id: 'rsk.cei.application:importDates.mileage.mileage.label',
      defaultMessage: 'Km staða við heimkomu',
      description: 'Mileage at arrival label',
    },
    mileageFileLabel: {
      id: 'rsk.cei.application:importDates.mileage.file.label',
      defaultMessage: 'Staðfesting á heimkomu',
      description: 'Mileage file label',
    },
    uploadDocsHeader: {
      id: 'rsk.cei.application:importDates.mileage.upload.docs.header',
      defaultMessage: 'Hlaða upp skjölum fyrir staðfestingu á heimkomu.',
      description: 'Upload docs header',
    },
    uploadDocsDescription: {
      id: 'rsk.cei.application:importDates.mileage.upload.docs.description',
      defaultMessage: 'Samþykktar skráartegundir eru .pdf,',
      description: 'Upload docs description',
    },
  }),

  exportDatesAndMileage: defineMessages({
    description: {
      id: 'rsk.cei.application:exportDates.mileage.description',
      defaultMessage:
        'Skráðu dagsetningar ferðar og km stöðu hvers ökutækis við brottför.',
      description: 'Dates and mileage description',
    },
    returnDateLabel: {
      id: 'rsk.cei.application:exportDates.mileage.return.date',
      defaultMessage: 'Áætlaður brottfaradagur',
      description: 'Departure date label',
    },
    mileageLabel: {
      id: 'rsk.cei.application:exportDates.mileage.mileage.label',
      defaultMessage: 'Km staða við brottför',
      description: 'Mileage at departure label',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'rsk.cei.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    title: {
      id: 'rsk.cei.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    datesHeader: {
      id: 'rsk.cei.application:overview.dates.header',
      defaultMessage: 'Dagsetningar',
      description: 'Overview dates section header',
    },
    departureDateLabel: {
      id: 'rsk.cei.application:overview.departure.date',
      defaultMessage: 'Brottfarardagur',
      description: 'Overview departure date label',
    },
    returnDateLabel: {
      id: 'rsk.cei.application:overview.return.date',
      defaultMessage: 'Áætlaður heimkomudagur',
      description: 'Overview return date label',
    },
    vehiclesHeader: {
      id: 'rsk.cei.application:overview.vehicles.header',
      defaultMessage: 'Ökutæki og km staða',
      description: 'Overview vehicles section header',
    },
    mileageAtDeparture: {
      id: 'rsk.cei.application:overview.mileage.at.departure',
      defaultMessage: 'Km staða við brottför',
      description: 'Mileage at departure label in overview',
    },
    submitButton: {
      id: 'rsk.cei.application:overview.submit',
      defaultMessage: 'Senda inn',
      description: 'Submit button label',
    },
  }),

  completed: defineMessages({
    alertTitle: {
      id: 'rsk.cei.application:completed.alert.title',
      defaultMessage: 'Umsókn hefur verið skilað',
      description: 'Completed alert title',
    },
    alertMessage: {
      id: 'rsk.cei.application:completed.alert.message',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Completed alert message',
    },
  }),
}
