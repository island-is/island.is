import { defineMessages } from 'react-intl'

export const fishingLicenseFurtherInformation = {
  general: defineMessages({
    sectionTitle: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.general.sectionTitle',
      defaultMessage: 'Umsókn um veiðileyfi',
      description: 'Fishing license further information section title',
    },
    title: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.name',
      defaultMessage: 'Umsókn um veiðileyfi',
      description: 'Fishing license further information title',
    },
    subtitle: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.subtitle',
      defaultMessage:
        'Vinsamlegast farið yfir eftirfarandi skráningu til að tryggja að allar upplýsingar séu réttar.  ',
      description:
        'Please review the following listing to ensure all information is correct.',
    },
    total: {
      id: 'gfl.application:fishingLicenseFurtherInformation.general.total',
      defaultMessage: 'Samtals',
      description: 'Total',
    },
  }),
  labels: defineMessages({
    date: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.date',
      defaultMessage: 'Dagsetning veiðileyfis',
      description: 'Date of validity',
    },
    attachments: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.attachments',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    area: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.attachments',
      defaultMessage: 'Veiðisvæði',
      description: 'Area', // TODO
    },
    roenet: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.roenet',
      defaultMessage: 'Fjöldi hrognkelsaneta',
      description: 'Number of roe nets',
    },
    railnet: {
      id: 'gfl.application:fishingLicenseFurtherInformation.labels.railnet',
      defaultMessage: 'Teinalengd nets',
      description: 'Railnet length',
    },
  }),
  fieldInformation: defineMessages({
    date: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.fieldInformation.date',
      defaultMessage: 'Umbeðin gildistaka',
      description: 'Date of validity',
    },
    attachments: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.fieldInformation.attachments',
      defaultMessage:
        'Vinsamlegast settu hér inn leyfi frá ferðamálastofu- ferðaskipuleggjendaleyfi',
      description: 'Please add a valid government-issued license as attachment', // TODO
    },
    area: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.fieldInformation.area',
      defaultMessage: '',
      description: '',
    },
  }),
  placeholders: defineMessages({
    date: {
      id: 'gfl.application:fishingLicenseFurtherInformation.placeholders.date',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Choose a date',
    },
    area: {
      id: 'gfl.application:fishingLicenseFurtherInformation.placeholders.area',
      defaultMessage: 'Veldu veiðisvæði',
      description: 'Choose area',
    },
  }),
  attachmentInfo: defineMessages({
    title: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.attachmentInfo.title',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Drag files to upload',
    },
    subtitle: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.attachmentInfo.subtitle',
      defaultMessage:
        'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf, .jpg, png. ',
      description: 'Approved file formats: .pdf, .docx, .rtf, .jpg, png. ',
    },
    buttonLabel: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.attachmentInfo.buttonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Choose documents to upload',
    },
  }),
  errorMessages: defineMessages({
    railNetTooLarge: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.errorMessages.railNetTooLarge',
      defaultMessage: 'Samtals teinalengd má ekki vera hærri en 7500 metrar',
      description: 'Total rail net length cannot exceed 7500 meters',
    },
    missingRequiredFields: {
      id:
        'gfl.application:fishingLicenseFurtherInformation.errorMessages.missingRequiredFields',
      defaultMessage: 'Vinsamlegast fylltu út alla reiti',
      description: 'Please fill out all required fields',
    },
  }),
}
