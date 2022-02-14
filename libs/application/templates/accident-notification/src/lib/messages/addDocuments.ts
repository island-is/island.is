import { defineMessages } from 'react-intl'

export const addDocuments = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:addDocuments.general.sectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Section title for add documents screen',
    },
    heading: {
      id: 'an.application:addDocuments.general.heading',
      defaultMessage: 'Fylgiskjöl',
      description: 'Heading for add documents screen',
    },
    description: {
      id: 'an.application:addDocuments.general.description',
      defaultMessage: `Vinsamlegast passaðu upp á að texti sé lesanlegur til að koma í veg fyrir að það þurfi ekki að óska eftir gögnum aftur.`,
      description: 'Description for add documents screen',
    },
    uploadHeader: {
      id: 'an.application:addDocuments.general.uploadHeader',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Definition of upload header for injury certificate',
    },
    uploadTitle: {
      id: 'an.application:addDocuments.general.uploadTitle',
      defaultMessage: 'Hlaða upp fylgiskjali',
      description: 'Title of subsection for attachment upload',
    },
    uploadIntroduction: {
      id: 'an.application:addDocuments.general.uploadIntroduction',
      defaultMessage: `Vinsamlegast bættu við skjali hér að neðan`,
      description: 'Upload introduction for injury certificate',
    },
    uploadDescription: {
      id: 'an.application:addDocuments.general.uploadDescription',
      defaultMessage:
        'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf, .jpg, .jpeg, .png, .heic',
      description: 'Definition of upload description',
    },
    uploadButtonLabel: {
      id: 'an.application:addDocuments.general.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Definition of upload button label',
    },
    additionalDocumentsDescription: {
      id: 'an.application:addDocuments.general.additionalDocumentsDescription',
      defaultMessage:
        'Ef þú hefur auka skjöl sem þú vilt koma til skila eins og ljósmyndir af slysstað, skýrsla til vinnueftirlitsins eða önnur gögn tengd slysinu, þá vinsamlegast bættu þeim við hér að neðan.',
      description: 'Additional documents description',
    },
    submitButtonLabel: {
      id: 'an.application:addDocuments.general.submitButtonLabel',
      defaultMessage: 'Halda áfram',
      description: 'Attachments in review button label',
    },
  }),
  injuryCertificate: defineMessages({
    title: {
      id: 'an.application:addDocuments.injuryCertificate.title',
      defaultMessage: 'Áverkavottorð',
      description: 'Definition of upload title for injury certificate',
    },

    uploadHeader: {
      id: 'an.application:addDocuments.injuryCertificate.uploadHeader',
      defaultMessage: 'Dragðu áverkavottorð hingað til að hlaða upp',
      description: 'Definition of upload header for injury certificate',
    },
    uploadIntroduction: {
      id: 'an.application:addDocuments.injuryCertificate.uploadIntroduction',
      defaultMessage: `Vinsamlegast bættu við áverkavottorði hér að neðan`,
      description: 'Upload introduction for injury certificate',
    },
  }),
  deathCertificate: defineMessages({
    title: {
      id: 'an.application:addDocuments.deathCertificateFile.title',
      defaultMessage: 'Lögregluskýrsla',
      description: 'Definition of title for police report',
    },
    uploadHeader: {
      id: 'an.application:addDocuments.deathCertificateFile.uploadHeader',
      defaultMessage: 'Dragðu lögregluskýrslu hingað til að hlaða upp',
      description: 'Definition of upload header for death certificate',
    },
    uploadIntroduction: {
      id: 'an.application:addDocuments.deathCertificateFile.uploadIntroduction',
      defaultMessage: `Vinsamlegast bættu við lögregluskýrslu hér að neðan`,
      description: 'Upload introduction for police report',
    },
  }),
  powerOfAttorney: defineMessages({
    title: {
      id: 'an.application:addDocuments.powerOfAttorneyFile.title',
      defaultMessage: 'Umboðsskjal',
      description: 'Definition of title for power of attorney',
    },
    uploadHeader: {
      id: 'an.application:addDocuments.powerOfAttorneyFile.uploadHeader',
      defaultMessage: 'Dragðu umboðsskjal hingað til að hlaða upp',
      description: 'Definition of upload header for power of attorney',
    },
    uploadIntroduction: {
      id: 'an.application:addDocuments.powerOfAttorneyFile.uploadIntroduction',
      defaultMessage: `Vinsamlegast bættu við umboðsskjali hér að neðan`,
      description: 'Upload introduction for power of attorney',
    },
  }),
  additional: defineMessages({
    uploadHeader: {
      id: 'an.application:addDocuments.additional.uploadHeader',
      defaultMessage: 'Dragðu auka skjöl hingað til að hlaða upp',
      description: 'Definition of upload header for additional attachments',
    },
    title: {
      id: 'an.application:addDocuments.additional.title',
      defaultMessage: `Önnur fylgiskjöl`,
      description: 'General title for additional attachments',
    },
  }),
}
