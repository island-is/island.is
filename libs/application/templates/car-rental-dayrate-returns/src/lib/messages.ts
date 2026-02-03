import { defineMessages } from 'react-intl'

export const m = {
  application: defineMessages({
    name: {
      id: 'rsk.crdr.application:name',
      defaultMessage: 'Bílaleigu gjaldflokkar',
      description: 'Application name',
    },
    institution: {
      id: 'rsk.crdr.application:institution',
      defaultMessage: 'Skatturinn',
      description: 'Application institution',
    },
  }),
  prerequisites: defineMessages({
    tabTitle: {
      id: 'rsk.crdr.application:prerequisites.tab.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Tab title for external data consent',
    },
    title: {
      id: 'rsk.crdr.application:prerequisites.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Section title for external data consent',
    },
    approvalCheckboxLabel: {
      id: 'rsk.crdr.application:prerequisites.checkbox',
      defaultMessage: 'Ég skil að ofangreindra upplýsinga verður aflað',
      description: 'Consent checkbox label',
    },
    skatturTitle: {
      id: 'rsk.crdr.application:prerequisites.skattur.title',
      defaultMessage: 'Upplýsingar frá Skattinum',
      description: 'Skatturinn data provider title',
    },
    skatturSubTitle: {
      id: 'rsk.crdr.application:prerequisites.skattur.subtitle',
      defaultMessage:
        'Upplýsingar frá Skattinum - Upplýsingar um gjaldflokksstöðu bifreiða',
      description: 'Skatturinn data provider subtitle',
    },
    vehiclesTitle: {
      id: 'rsk.crdr.application:prerequisites.vehicles.title',
      defaultMessage: 'Upplýsingar frá Samgöngustofu',
      description: 'Transport Authority data provider title',
    },
    vehiclesSubTitle: {
      id: 'rsk.crdr.application:prerequisites.vehicles.subtitle',
      defaultMessage:
        'Upplýsingar úr Ökutækjaskrá - Upplýsingar um þínar bifreiðar og stöðu þeirra',
      description: 'Transport Authority data provider subtitle',
    },
    confirmButton: {
      id: 'rsk.crdr.application:prerequisites.confirm',
      defaultMessage: 'Staðfesta',
      description: 'Confirm data collection',
    },
  }),

  notAllowed: defineMessages({
    descriptionTitle: {
      id: 'rsk.crdr.application:notAllowed.title',
      defaultMessage:
        'Aðeins prókúru- og umboðshafar bílaleiga hafa aðgang að þessari umsókn',
      description: 'Not allowed title',
    },
    descriptionText: {
      id: 'rsk.crdr.application:notAllowed.description',
      defaultMessage:
        'Ef þú telur að þú ættir að hafa aðgang að þessari umsókn, vinsamlegast hafðu samband við Skattinn í síma 442 1000',
      description: 'Not allowed description',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:overview.section.title',
      defaultMessage: 'Yfirlit yfir bifreiðar',
      description: 'Overview section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:overview.multi.title',
      defaultMessage: 'Yfirlit yfir bifreiðar',
      description: 'Overview multi field title',
    },
    header: {
      id: 'rsk.crdr.application:overview.header',
      defaultMessage: 'Yfirlit',
      description: 'Overview table header',
    },
    registeredCount: {
      id: 'rsk.crdr.application:overview.registered.count',
      defaultMessage: 'Fjöldi bifreiða á daggjaldi í síðasta mánuði',
      description: 'Registered vehicles count label',
    },
    dayRateCount: {
      id: 'rsk.crdr.application:overview.dayrate.count',
      defaultMessage: 'Fjöldi bifreiða á daggjaldi',
      description: 'Day rate vehicles count label',
    },
    kmRateCount: {
      id: 'rsk.crdr.application:overview.kmrate.count',
      defaultMessage: 'Fjöldi bifreiða á kílómetragjaldi',
      description: 'Kilometer rate vehicles count label',
    },
  }),

  categorySelection: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:category.section.title',
      defaultMessage: 'Gjaldtegund',
      description: 'Category selection section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:category.multi.title',
      defaultMessage: 'Skrá bifreiðar á kílómetragjald eða daggjald',
      description: 'Category selection multi field title',
    },
    description: {
      id: 'rsk.crdr.application:category.description',
      defaultMessage: 'Veldu þær breytingar sem þú vilt gera',
      description: 'Category selection description',
    },
    optionDayRate: {
      id: 'rsk.crdr.application:category.option.dayrate',
      defaultMessage: 'Færa bifreiðar á daggjald',
      description: 'Option to change to day rate',
    },
    optionKmRate: {
      id: 'rsk.crdr.application:category.option.kmrate',
      defaultMessage: 'Færa bifreiðar á kílómetragjald',
      description: 'Option to change to km rate',
    },
  }),

  singleOrMulti: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:single.multi.section.title',
      defaultMessage: 'Fjöldi skráninga',
      description: 'Single or multi selection section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:single.multi.multi.title',
      defaultMessage: 'Magnskráning eða stakir bílar',
      description: 'Single or multi selection multi field title',
    },
    description: {
      id: 'rsk.crdr.application:single.multi.description',
      defaultMessage: 'Veldu magnskráningu eða staka skráningu.',
      description: 'Single or multi selection description',
    },
    optionMultiLabel: {
      id: 'rsk.crdr.application:single.multi.option.multi.label',
      defaultMessage: 'Magnskráning',
      description: 'Bulk registration option label',
    },
    optionMultiSubLabel: {
      id: 'rsk.crdr.application:single.multi.option.multi.sub',
      defaultMessage:
        'Hér má hlaða upp .xlsx eða .csv skjali til að magnskrá breytingar á gjaldflokki og kílómetrastöðu.',
      description: 'Bulk registration option sublabel',
    },
    optionSingleLabel: {
      id: 'rsk.crdr.application:single.multi.option.single.label',
      defaultMessage: 'Skrá stakan bíl',
      description: 'Single vehicle registration option label',
    },
    optionSingleSubLabel: {
      id: 'rsk.crdr.application:single.multi.option.single.sub',
      defaultMessage:
        'Þú getur skráð upplýsingar um gjaldflokk og kílómetrastöðu beint í gegnum viðmótið.',
      description: 'Single vehicle registration option sublabel',
    },
  }),

  multiUpload: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:multi.upload.section.title',
      defaultMessage: 'Magnskráning',
      description: 'Bulk upload section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:multi.upload.multi.title',
      defaultMessage: 'Skrá bifreiðar',
      description: 'Bulk upload multi field title',
    },
    description: {
      id: 'rsk.crdr.application:multi.upload.description',
      defaultMessage: 'Veldur þær breytingar sem þú vilt gera',
      description: 'Bulk upload description',
    },
    stepsMessage: {
      id: 'rsk.crdr.application:multi.upload.steps#markdown',
      defaultMessage:
        '1. Sækir sniðmátið \n\n2. Gerir viðeigandi breytingar á skjalinu \n\n3. Hleður upp skjalinu hér að neðan',
      description: 'Bulk upload help steps',
    },
    templateButton: {
      id: 'rsk.crdr.application:multi.upload.template.button',
      defaultMessage: 'Sniðmát',
      description: 'Download template button label',
    },
    uploadTitle: {
      id: 'rsk.crdr.application:multi.upload.title',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Upload title (no errors)',
    },
    uploadTitleError: {
      id: 'rsk.crdr.application:multi.upload.title.error',
      defaultMessage:
        'Dragðu aftur inn skjal hingað til að hlaða upp eftir að lagfæra villur',
      description: 'Upload title (errors present)',
    },
    uploadDescription: {
      id: 'rsk.crdr.application:multi.upload.description.upload',
      defaultMessage: 'Tekið er við skjölum með endingum: .csv, .xlsx',
      description: 'Upload description',
    },
    uploadButtonLabel: {
      id: 'rsk.crdr.application:multi.upload.button.label',
      defaultMessage: 'Hlaða upp skjali',
      description: 'Upload button label',
    },
    errorTemplateButton: {
      id: 'rsk.crdr.application:multi.upload.template.error.button',
      defaultMessage: 'Sniðmát með villum',
      description: 'Download error template button label',
    },
    errorMessageToUser: {
      id: 'rsk.crdr.application:multi.upload.error.message.to.user',
      defaultMessage:
        'villur fundust. Hlaða má niður sniðmáti með villum og reynda aftur.',
      description: 'Error message to user',
    },
    noCarsToChangeFound: {
      id: 'rsk.crdr.application:multi.upload.error.no.cars',
      defaultMessage: 'Engir breytingar fundust í skjalinu',
      description: 'No cars to change found error',
    },
    invalidFileType: {
      id: 'rsk.crdr.application:multi.upload.error.invalid.file.type',
      defaultMessage: 'Skrá verður að vera .csv eða .xlsx',
      description: 'Invalid file type upload error',
    },
  }),

  tableView: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:table.view.section.title',
      defaultMessage: 'Skrá gjald',
      description: 'Table view section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:table.view.multi.title',
      defaultMessage: 'Skrá bifreiðar',
      description: 'Table view multi field title',
    },
  }),

  endOfMonth: defineMessages({
    multiTitle: {
      id: 'rsk.crdr.application:end.month.multi.title',
      defaultMessage: 'Of nálægt lokum mánaðar',
      description: 'End of month check title',
    },
    message: {
      id: 'rsk.crdr.application:end.month.message',
      defaultMessage:
        'Of lítið eftir af mánuðinum til þess að hægt sé að sækja um. Vinsamlegast reynið aftur eftir mánaðamót.',
      description: 'End of month warning message',
    },
  }),

  carsChangesCount: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:cars.changes.count.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Cars changes count section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:cars.changes.count.multi.title',
      defaultMessage: 'Staðfesta breytingar',
      description: 'Cars changes count multi field title',
    },
    header: {
      id: 'rsk.crdr.application:cars.changes.count.header',
      defaultMessage: 'Fjöldi bifreiða til að breyta',
      description: 'Cars changes count table header',
    },
    submitButton: {
      id: 'rsk.crdr.application:cars.changes.count.submit',
      defaultMessage: 'Senda inn',
      description: 'Submit button label',
    },
    alertMessage: {
      id: 'rsk.crdr.application:cars.changes.count.info.message',
      defaultMessage:
        'Það getur tekið 1-2 mínútur að senda inn umsóknina að vinna úr upplýsingum.',
      description: 'Cars changes count info message',
    },
  }),

  verify: defineMessages({
    sectionTitle: {
      id: 'rsk.crdr.application:verify.section.title',
      defaultMessage: 'Skráning móttekin!',
      description: 'Verify section title',
    },
    multiTitle: {
      id: 'rsk.crdr.application:verify.multi.title',
      defaultMessage: 'Skráning móttekin!',
      description: 'Verify multi field title',
    },
    description: {
      id: 'rsk.crdr.application:verify.description',
      defaultMessage: 'Staðfestingaskjár',
      description: 'Verify description',
    },
  }),

  completed: defineMessages({
    alertTitle: {
      id: 'rsk.crdr.application:completed.alert.title',
      defaultMessage: 'Umsókn hefur verið skilað',
      description: 'Completed alert title',
    },
    alertMessage: {
      id: 'rsk.crdr.application:completed.alert.message',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Completed alert message',
    },
  }),

  multiUploadErrors: defineMessages({
    dayRateMin30Days: {
      id: 'rsk.crdr.application:multi.upload.error.dayrate.min30days',
      defaultMessage:
        'Bílar þurfa að vera skráðir á daggjald í amk 30 daga áður en hægt er að breyta til baka!',
      description: 'Changing from day rate to km rate too soon',
    },
    carNotFound: {
      id: 'rsk.crdr.application:multi.upload.error.car.not.found',
      defaultMessage:
        'Þessi bíll fannst ekki í lista af þínum bílum á daggjaldi í síðasta mánuði!',
      description: 'Car not found',
    },
    previousPeriodUsageRequired: {
      id: 'rsk.crdr.application:multi.upload.error.prev.usage.required',
      defaultMessage:
        'Notkun bíls á síðasta dagsfjölda þarf að vera til staðar!',
      description: 'Previous period usage missing',
    },
    prevPeriodUsageGreaterThanPrevPeriodTotalDays: {
      id: 'rsk.crdr.application:multi.upload.error.prev.period.usage.greater.than.prev.period.total.days',
      defaultMessage: 'Fleirri dagar notaðir en heildar dagsfjöldi!',
      description:
        'Previous period usage greater than previous period total days',
    },
  }),
}
