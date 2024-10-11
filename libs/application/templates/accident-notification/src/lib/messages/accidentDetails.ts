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
        'Vinsamlegast gerðu grein fyrir dagsetningu, tíma og orsökum slyssins.',
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
    moreThanAYearAlertTitle: {
      id: 'an.application:accidentDetails.general.moreThanAYearAlertTitle',
      defaultMessage: 'Athugið',
      description: 'Alert',
    },
    moreThanAYearAlertMessage: {
      id: 'an.application:accidentDetails.general.moreThanAYearAlertMessage',
      defaultMessage:
        'Öll slys skal að jafnaði tilkynna innan eins árs, en heimilt er að veita undanþágu frá þeirri reglu, að ákveðnum forsendum uppfylltum.',
      description:
        'The accident took place more than a year ago. It is necessary to contact the Insurance Fund for further instructions.',
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
    symptoms: {
      id: 'an.application:accidentDetails.labels.symptoms',
      defaultMessage: 'Lýsing á einkennum og afleiðingum slyss',
      description: 'Accident symptoms',
    },
    doctorVisit: {
      id: 'an.application:accidentDetails.labels.doctorVisit',
      defaultMessage: 'Hvenær leitaðir þú fyrst til læknis?',
      description: 'When did you first visit a doctor after the accident?',
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
    symptoms: {
      id: 'an.application:accidentDetails.placeholder.symptoms',
      defaultMessage: 'Skrifaðu hér einkenni og afleiðingar slyssins',
      description: 'Write here the symptoms and consequences of the accident',
    },
    doctorVisitTime: {
      id: 'an.application:accidentDetails.placeholder.doctorVisit',
      defaultMessage: 'Sláðu inn tíma heimsóknar',
      description: 'Enter the time of the visit',
    },
  }),
}
