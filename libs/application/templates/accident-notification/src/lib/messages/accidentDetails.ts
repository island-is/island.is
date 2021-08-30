import { defineMessages } from 'react-intl'

export const accidentDetails = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:accidentDetails.general.sectionTitle',
      defaultMessage: 'Lýsing á slysi',
      description: 'Description of accident',
    },
    description: {
      id: 'an.application:accidentDetails.general.description',
      defaultMessage:
        'Vinsamlegast gerðu grein fyrir dagsetningu og tíma slyss, tildrögum-, orsökum- og aðstæðum slyssins.',
      description:
        'Please state the date and time of the accident, the cause, cause and circumstances of the accident.',
    },
    insuranceAlertTitle: {
      id: 'an.application:accidentDetails.general.insuranceAlertTitle',
      defaultMessage: 'Athugið',
      description: 'Alert',
    },
    insuranceAlertText: {
      id: 'an.application:accidentDetails.general.insuranceAlertText',
      defaultMessage:
        'Samkvæmt rafrænum upplýsingum Ríkisskattstjóra virðist þú ekki hafa fyllt út viðeigandi reit á skattframtali og ert því ekki slysatryggður við heimilsstörf á því tímabili er slysið átti sér stað.',
      description:
        'According to electronic information from the Director of Internal Revenue, you do not appear to have filled in the appropriate field on your tax return and are therefore not insured against household related accidents during the period in which the accident took place.',
    },
  }),
  labels: defineMessages({
    date: {
      id: 'an.application:accidentDetails.labels.date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    time: {
      id: 'an.application:accidentDetails.labels.time',
      defaultMessage: 'Tími',
      description: 'Time',
    },
    description: {
      id: 'an.application:accidentDetails.labels.description',
      defaultMessage: 'Ýtarleg lýsing á slysi',
      description: 'Description of accident',
    },
  }),
  placeholder: defineMessages({
    date: {
      id: 'an.application:accidentDetails.placeholder.date',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Choose a date',
    },
    time: {
      id: 'an.application:accidentDetails.placeholder.time',
      defaultMessage: 'Sláðu inn tíma slyssins',
      description: 'Enter the time of the accident',
    },
    description: {
      id: 'an.application:accidentDetails.placeholder.description',
      defaultMessage: 'Skrifaðu hér tildrög, orsök og aðstæður slyssins',
      description:
        'Write here the outline, cause and circumstances of the accident',
    },
  }),
}
