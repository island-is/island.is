import { defineMessages } from 'react-intl'

export const m = {
  application: defineMessages({
    name: {
      id: 'rsk.rdr.application:name',
      defaultMessage: 'Bílaleigu gjaldflokkar',
      description: 'Application name',
    },
    institution: {
      id: 'rsk.rdr.application:institution',
      defaultMessage: 'Skatturinn',
      description: 'Application institution',
    },
  }),
  prerequisites: defineMessages({
    tabTitle: {
      id: 'rsk.rdr.application:prerequisites.tab.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Tab title for external data consent',
    },
    title: {
      id: 'rsk.rdr.application:prerequisites.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Section title for external data consent',
    },
    approvalCheckboxLabel: {
      id: 'rsk.rdr.application:prerequisites.checkbox',
      defaultMessage: 'Ég skil að ofangreinda upplýsinga verður aflað',
      description: 'Consent checkbox label',
    },
    skatturTitle: {
      id: 'rsk.rdr.application:prerequisites.skattur.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Skatturinn data provider title',
    },
    skatturSubTitle: {
      id: 'rsk.rdr.application:prerequisites.skattur.subtitle',
      defaultMessage:
        'Upplýsingar frá Skattinum - Upplýsingar um gjaldflokksstöðu bifreiða',
      description: 'Skatturinn data provider subtitle',
    },
    vehiclesTitle: {
      id: 'rsk.rdr.application:prerequisites.vehicles.title',
      defaultMessage: 'Upplýsingar frá Samgöngustofu',
      description: 'Transport Authority data provider title',
    },
    vehiclesSubTitle: {
      id: 'rsk.rdr.application:prerequisites.vehicles.subtitle',
      defaultMessage:
        'Upplýsingar úr Ökutækjaskrá - Upplýsingar um þínar bifreiðar og stöðu þeirra',
      description: 'Transport Authority data provider subtitle',
    },
    confirmButton: {
      id: 'rsk.rdr.application:prerequisites.confirm',
      defaultMessage: 'Staðfesta',
      description: 'Confirm data collection',
    },
  }),

  notAllowed: defineMessages({
    descriptionTitle: {
      id: 'rsk.rdr.application:notAllowed.title',
      defaultMessage:
        'Aðeins prókúru- og umboðshafar bílaleiga hafa aðgang að þessari umsókn',
      description: 'Not allowed title',
    },
    descriptionText: {
      id: 'rsk.rdr.application:notAllowed.description',
      defaultMessage:
        'Ef þú telur að þú ættir að hafa aðgang að þessari umsókn, vinsamlegast hafðu samband við Skattinn í síma 442 1000',
      description: 'Not allowed description',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:overview.section.title',
      defaultMessage: 'Yfirlit yfir bifreiðar',
      description: 'Overview section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:overview.multi.title',
      defaultMessage: 'Yfirlit yfir bifreiðar',
      description: 'Overview multi field title',
    },
    header: {
      id: 'rsk.rdr.application:overview.header',
      defaultMessage: 'Yfirlit',
      description: 'Overview table header',
    },
    registeredCount: {
      id: 'rsk.rdr.application:overview.registered.count',
      defaultMessage: 'Fjöldi bifreiða á skrá',
      description: 'Registered vehicles count label',
    },
    dayRateCount: {
      id: 'rsk.rdr.application:overview.dayrate.count',
      defaultMessage: 'Fjöldi bifreiða á daggjaldi',
      description: 'Day rate vehicles count label',
    },
    kmRateCount: {
      id: 'rsk.rdr.application:overview.kmrate.count',
      defaultMessage: 'Fjöldi bifreiða á kílómetragjaldi',
      description: 'Kilometer rate vehicles count label',
    },
  }),

  categorySelection: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:category.section.title',
      defaultMessage: 'Gjald tegund',
      description: 'Category selection section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:category.multi.title',
      defaultMessage: 'Skrá bifreiðar á kílómetragjald eða daggjald',
      description: 'Category selection multi field title',
    },
    description: {
      id: 'rsk.rdr.application:category.description',
      defaultMessage: 'Veldur þær breytingar sem þú vilt gera',
      description: 'Category selection description',
    },
    optionDayRate: {
      id: 'rsk.rdr.application:category.option.dayrate',
      defaultMessage: 'Færa bifreiðar á daggjald',
      description: 'Option to change to day rate',
    },
    optionKmRate: {
      id: 'rsk.rdr.application:category.option.kmrate',
      defaultMessage: 'Færa bifreiðar á kílómetragjald',
      description: 'Option to change to km rate',
    },
  }),

  singleOrMulti: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:single.multi.section.title',
      defaultMessage: 'Fjöldi skráninga',
      description: 'Single or multi selection section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:single.multi.multi.title',
      defaultMessage: 'Magnskráning eða stakir bílar',
      description: 'Single or multi selection multi field title',
    },
    description: {
      id: 'rsk.rdr.application:single.multi.description',
      defaultMessage: 'Veldu magnskráningu eða stakskráningu.',
      description: 'Single or multi selection description',
    },
    optionMultiLabel: {
      id: 'rsk.rdr.application:single.multi.option.multi.label',
      defaultMessage: 'Magnskráning',
      description: 'Bulk registration option label',
    },
    optionMultiSubLabel: {
      id: 'rsk.rdr.application:single.multi.option.multi.sub',
      defaultMessage:
        'Hér má hlaða upp .xlsx eða .csv skjali til að magnskrá breytingar á gjaldflokki og kílómetrastöðu.',
      description: 'Bulk registration option sublabel',
    },
    optionSingleLabel: {
      id: 'rsk.rdr.application:single.multi.option.single.label',
      defaultMessage: 'Skrá staka bíla',
      description: 'Single vehicle registration option label',
    },
    optionSingleSubLabel: {
      id: 'rsk.rdr.application:single.multi.option.single.sub',
      defaultMessage:
        'Þú getur skráð upplýsingar um gjaldflokk og kílómetrastöðu beint í gegnum viðmótið.',
      description: 'Single vehicle registration option sublabel',
    },
  }),

  multiUpload: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:multi.upload.section.title',
      defaultMessage: 'Magn skráning',
      description: 'Bulk upload section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:multi.upload.multi.title',
      defaultMessage: 'Skrá bifreiðar',
      description: 'Bulk upload multi field title',
    },
    description: {
      id: 'rsk.rdr.application:multi.upload.description',
      defaultMessage: 'Veldur þær breytingar sem þú vilt gera',
      description: 'Bulk upload description',
    },
    stepsMessage: {
      id: 'rsk.rdr.application:multi.upload.steps',
      defaultMessage:
        '1. Sæktu sniðmátið \n2. Gerðu viðeigandi breytingar á skjalinu \n3. Hleður upp skjalinu hér að neðan',
      description: 'Bulk upload help steps',
    },
  }),

  tableView: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:table.view.section.title',
      defaultMessage: 'Skrá gjald',
      description: 'Table view section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:table.view.multi.title',
      defaultMessage: 'Skrá bifreiðar',
      description: 'Table view multi field title',
    },
  }),

  endOfMonth: defineMessages({
    multiTitle: {
      id: 'rsk.rdr.application:end.month.multi.title',
      defaultMessage: 'Of nálægt lok mánaðar',
      description: 'End of month check title',
    },
    message: {
      id: 'rsk.rdr.application:end.month.message',
      defaultMessage:
        'Það er of lítið eftir af mánuðinum til að hægt sé að sækja um. Vinsamlegast reynið aftur eftir mánaðamót.',
      description: 'End of month warning message',
    },
  }),

  carsChangesCount: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:cars.changes.count.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Cars changes count section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:cars.changes.count.multi.title',
      defaultMessage: 'Staðfesta breytingar',
      description: 'Cars changes count multi field title',
    },
    header: {
      id: 'rsk.rdr.application:cars.changes.count.header',
      defaultMessage: 'Fjöldi bifreiða sem mun reyna breyta',
      description: 'Cars changes count table header',
    },
    submitButton: {
      id: 'rsk.rdr.application:cars.changes.count.submit',
      defaultMessage: 'Senda inn',
      description: 'Submit button label',
    },
  }),

  verify: defineMessages({
    sectionTitle: {
      id: 'rsk.rdr.application:verify.section.title',
      defaultMessage: 'Skráning móttekin!',
      description: 'Verify section title',
    },
    multiTitle: {
      id: 'rsk.rdr.application:verify.multi.title',
      defaultMessage: 'Skráning móttekin!',
      description: 'Verify multi field title',
    },
    description: {
      id: 'rsk.rdr.application:verify.description',
      defaultMessage: 'Staðfestinga skjár',
      description: 'Verify description',
    },
  }),

  completed: defineMessages({
    alertTitle: {
      id: 'rsk.rdr.application:completed.alert.title',
      defaultMessage: 'Umsóknin hefur verið skilað',
      description: 'Completed alert title',
    },
    alertMessage: {
      id: 'rsk.rdr.application:completed.alert.message',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Completed alert message',
    },
  }),
}
