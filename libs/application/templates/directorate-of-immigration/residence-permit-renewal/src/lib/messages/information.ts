import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
    sectionTitleWithPerson: {
      id: 'doi.rpr.application:information.general.sectionTitleWithPerson',
      defaultMessage: 'Upplýsingar - {person}',
      description: 'Information section title with person',
    },
  }),
  labels: {
    staysAbroad: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.staysAbroad.subSectionTitle',
        defaultMessage: 'Dvöl erlendis',
        description: 'Stays abroad sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.staysAbroad.pageTitle',
        defaultMessage: 'Dvöl erlendis á tímabilinu',
        description: 'Stays abroad page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.staysAbroad.description',
        defaultMessage: `Upplýsingar fyrir {name} \n\n Gefðu upplýsingar um ferðir erlendis á gildistíma síðasta dvalarleyfis, til þess dags þegar þessi umsókn er lögð fram.`,
        description: 'Stays abroad description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.staysAbroad.title',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, dvalið erlendis?',
        description: 'Stays abroad title',
      },
      itemTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.itemTitle',
        defaultMessage: 'Dvalarland {index}',
        description: 'Stay abroad item separator title',
      },
      questionTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.questionTitle',
        defaultMessage:
          'Hefur þú frá lögheimilsskráningu dvalið utan Íslands lengur en 3 mánuði?',
        description: 'Stays abroad title',
      },
      selectLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.selectLabel',
        defaultMessage: 'Land sem þú dvaldir í síðast',
        description: 'Country select label',
      },
      dateFromLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateFromLabel',
        defaultMessage: 'Dagsetning frá',
        description: 'From date label',
      },
      dateToLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateToLabel',
        defaultMessage: 'Dagsetning til',
        description: 'To date label',
      },
      purposeLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.purposeLabel',
        defaultMessage: 'Tilgangur dvalar',
        description: 'purpose of stay label',
      },
      buttonTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.buttonTitle',
        defaultMessage: 'Bæta við fleiri dvalarupplýsingum',
        description: 'Add more countries button title',
      },
      deleteButtonTitle: {
        id:
          'doi.cs.application:information.labels.staysAbroad.deleteButtonTitle',
        defaultMessage: 'Eyða færslu',
        description: 'Add more countries button title',
      },
      dateRangeError: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateRangeError',
        defaultMessage: 'Dvalartími þarf að vera lengur en 3 mánuðir',
        description: 'Validation error for 3 month date range',
      },
    }),
    criminalRecord: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.criminalRecord.subSectionTitle',
        defaultMessage: 'Sakaferill',
        description: 'Criminal record sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.criminalRecord.pageTitle',
        defaultMessage: 'Sakaferill',
        description: 'Criminal record page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.criminalRecord.description',
        defaultMessage: 'Upplýsingar fyrir {name}',
        description: 'Criminal record description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.criminalRecord.title',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, sætt sektum, fangelsisrefsingum eða hefur þú stöðu grunaðs manns í lögreglurannsókn?',
        description: 'Criminal record title',
      },
      itemTitle: {
        id: 'doi.cs.application:information.labels.criminalRecord.itemTitle',
        defaultMessage: 'Brot {index}',
        description: 'Crimintal record item separator title',
      },
      questionTitle: {
        id:
          'doi.cs.application:information.labels.criminalRecord.questionTitle',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, sætt sektum, fangelsisrefsingum eða hefur þú stöðu grunaðs manns í lögreglurannsókn?',
        description: 'Criminal record title',
      },
      selectLabel: {
        id: 'doi.cs.application:information.labels.criminalRecord.selectLabel',
        defaultMessage: 'Hvar gerðist brotið?',
        description: 'Country select label',
      },
      dateLabel: {
        id: 'doi.cs.application:information.labels.criminalRecord.dateLabel',
        defaultMessage: 'Hvenær var brotið?',
        description: 'date label',
      },
      punishmentLabel: {
        id:
          'doi.cs.application:information.labels.criminalRecord.punishmentLabel',
        defaultMessage: 'Hver var refsingin?',
        description: 'punishment label',
      },
      typeOfOffenseLabel: {
        id:
          'doi.cs.application:information.labels.criminalRecord.typeOfOffenseLabel',
        defaultMessage: 'Tegund brots',
        description: 'type of offense label',
      },
      buttonTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.buttonTitle',
        defaultMessage: 'Bæta við upplýsingum um fleiri brot',
        description: 'Add more offenses button title',
      },
      deleteButtonTitle: {
        id:
          'doi.cs.application:information.labels.staysAbroad.deleteButtonTitle',
        defaultMessage: 'Eyða færslu',
        description: 'Add more countries button title',
      },
    }),
    study: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.study.subSectionTitle',
        defaultMessage: 'Nám',
        description: 'Study sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.study.pageTitle',
        defaultMessage: 'Nám',
        description: 'Study page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.study.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Study description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.study.title',
        defaultMessage: 'Upplýsingar fyrir {name}',
        description: 'Study title',
      },
      fileUploadConfirmationLabel: {
        id:
          'doi.rpr.application:information.labels.study.fileUploadConfirmationLabel',
        defaultMessage: 'Staðfesting á námsárangri',
        description: 'File upload of confirmation label',
      },
      fileUploadGraduationLabel: {
        id:
          'doi.rpr.application:information.labels.study.fileUploadGraduationLabel',
        defaultMessage: 'Staðfesting á útskrift',
        description: 'Graduation file upload label',
      },
      fileUploadContinuedStudiesLabel: {
        id:
          'doi.rpr.application:information.labels.study.fileUploadContinuedStudiesLabel',
        defaultMessage: 'Staðfesting á skráningu í áframhaldandi fullt nám',
        description: 'Continued education file upload label',
      },
      fileUploadConfirmationDescription: {
        id:
          'doi.rpr.application:information.labels.study.fileUploadConfirmationDescription',
        defaultMessage: 'Ef þú hefur lokið námi',
        description: 'Confirmation upload description',
      },
      buttonText: {
        id: 'doi.rpr.application:information.labels.study.buttonText',
        defaultMessage: 'Velja skjöl til að hlaða upp',
        description: 'button file types',
      },
      acceptedFileTypes: {
        id: 'doi.rpr.application:information.labels.study.acceptedFileTypes',
        defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
        description: 'Accepted file types',
      },
    }),
    employment: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.employment.subSectionTitle',
        defaultMessage: 'Atvinnuleyfi',
        description: 'Employment sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.employment.pageTitle',
        defaultMessage: 'Atvinnuleyfi',
        description: 'Employment page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.employment.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Employment description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.employment.title',
        defaultMessage: 'Upplýsingar um atvinnuleyfi',
        description: 'Employment title',
      },
    }),
    passport: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.passport.subSectionTitle',
        defaultMessage: 'Vegabréf',
        description: 'Passport sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.passport.pageTitle',
        defaultMessage: 'Fylgigögn - Vegabréf',
        description: 'Passport page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.passport.description',
        defaultMessage:
          'Pellentesque at nibh convallis, sodales nulla ut, sagittis ligula.',
        description: 'Passport description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.passport.title',
        defaultMessage: 'Upplýsingar um vegabréf',
        description: 'Passport title',
      },
    }),
    otherDocuments: defineMessages({
      subSectionTitle: {
        id: 'doi.rpr.application:information.labels.otherDocuments.subSectionTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents sub section title',
      },
      pageTitle: {
        id: 'doi.rpr.application:information.labels.otherDocuments.pageTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents page title',
      },
      description: {
        id: 'doi.rpr.application:information.labels.otherDocuments.description',
        defaultMessage:
          'Nunc vitae turpis faucibus, facilisis justo in, hendrerit odio.',
        description: 'Other documents description',
      },
      title: {
        id: 'doi.rpr.application:information.labels.otherDocuments.title',
        defaultMessage: 'Test',
        description: 'Other documents title',
      },
    }),
  },
}
