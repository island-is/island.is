import { defineMessages } from 'react-intl'

export const injuredPersonInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:injuredPersonInformation.general.sectionTitle',
      defaultMessage: 'Hinn slasaði',
      description: 'Section title for injured person information person',
    },
    heading: {
      id: 'an.application:injuredPersonInformation.general.heading',
      defaultMessage: 'Upplýsingar um þann slasaða',
      description: 'Section title for injured person information person',
    },
    description: {
      id: 'an.application:injuredPersonInformation.general.description',
      defaultMessage:
        'Stofnanir, samtök og félög sem eru virk á sviði persónuverndar geta sent inn tilkynningu án umboðs að uppfylltum skilyrðum 80. gr. reglugerðar (ESB) 2016/679 (almennu persónuverndarreglugerðarinnar).',
      description: 'Description label for injured person information section.',
    },
    juridicalDescription: {
      id: 'an.application:injuredPersonInformation.general.juridicalDescription',
      defaultMessage:
        'Stofnanir, samtök og félög sem eru virk á sviði persónuverndar geta sent inn tilkynningu án umboðs að uppfylltum skilyrðum 80. gr. reglugerðar (ESB) 2016/679 (almennu persónuverndarreglugerðarinnar).',
      description:
        'Description label for injured person information section when submitting for juridical person.',
    },
    jobTitle: {
      id: 'an.application:injuredPersonInformation.general.jobTitle',
      defaultMessage: 'Starfsheiti',
      description: 'Title above the job title input field',
    },
    jobTitleDescription: {
      id: 'an.application:injuredPersonInformation.general.jobTitleDescription',
      defaultMessage:
        'Sláðu inn starfsheiti þess slasaða þegar slysið átti sér stað.',
      description: 'Description for job title input field',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'an.application:injuredPersonInformation.labels.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'an.application:injuredPersonInformation.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    email: {
      id: 'an.application:injuredPersonInformation.labels.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'an.application:injuredPersonInformation.labels.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    jobTitle: {
      id: 'an.application:injuredPersonInformation.labels.jobTitle',
      defaultMessage: 'Starfsheiti',
      description: 'Label for job title input field',
    },
  }),
  upload: defineMessages({
    uploadHeader: {
      id: 'an.application:injuredPersonInformation.upload.uploadHeader',
      defaultMessage: 'Dragðu áverkavottorð hingað til að hlaða upp',
      description: 'Definition of upload header',
    },
  }),
}
