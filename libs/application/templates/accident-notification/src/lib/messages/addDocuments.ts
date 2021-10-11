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
      defaultMessage: `Vinsamlegast passaðu upp á að texti sé lesanlegur til að koma í veg fyrir að það þurfi ekki að óska eftir gögnum aftur. bla bla bla`,
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
      defaultMessage: 'Tekið er við skjölum með endingunum: .pdf, .docx, .rtf',
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
        'Ef þú hefur auka skjöl sem þú villt koma til skila eins og ljósmyndir af slysstað, skýrsla til vinnueftirlitsins eða önnnur gögn teng slysinu, þá vinsamlegast bættu þeim við hér að neðan.',
      description: 'Additional documents description',
    },
  }),
  injuryCertificate: defineMessages({
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
    uploadHeader: {
      id: 'an.application:addDocuments.deathCertificateFile.uploadHeader',
      defaultMessage: 'Dragðu dánarvottorð hingað til að hlaða upp',
      description: 'Definition of upload header for death certificate',
    },
    uploadIntroduction: {
      id: 'an.application:addDocuments.deathCertificateFile.uploadIntroduction',
      defaultMessage: `Vinsamlegast bættu við dánarvottorði hér að neðan`,
      description: 'Upload introduction for death certificate',
    },
  }),
  powerOfAttorney: defineMessages({
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
}
