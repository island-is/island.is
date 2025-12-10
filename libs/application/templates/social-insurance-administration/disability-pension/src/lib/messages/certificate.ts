import { defineMessages } from 'react-intl'

export const certificate = defineMessages({
  title: {
    id: 'dp.application:certificate.title',
    defaultMessage: 'Vottorð um örorku',
    description: 'Disability certificate',
  },
  description: {
    id: 'dp.application:certificate.description',
    defaultMessage:
      'Forsenda fyrir greiðslum er að heilsubrestur einstaklings sé afleiðing af sjúkdómi, slysi eða áfalli. Grunnvottorð þarf að innihalda staðfestingu þess efnis.',
    description:
      'The prerequisite for payments is that the person’s health issues is the result of illness, accident or trauma. The Certificate for Sickness and Rehabilitation must contain confirmation to that effect.',
  },
  available: {
    id: 'dp.application:certificate.available',
    defaultMessage: 'Til staðar er vottorð um örorku',
    description: 'Disability certificate is available',
  },
  notAvailable: {
    id: 'dp.application:certificate.not.available',
    defaultMessage: 'Ekki er til staðar vottorð um örorku',
    description: 'Disability certificate is not available',
  },

  // Managed by
  managedBy: {
    id: 'dp.application:certificate.managed.by',
    defaultMessage: 'Utanumhaldandi',
    description: 'Managed by section title',
  },
  name: {
    id: 'dp.application:certificate.name',
    defaultMessage: 'Nafn',
    description: 'The name of the managing person',
  },
  residence: {
    id: 'dp.application:certificate.residence',
    defaultMessage: 'Starfsstöð',
    description: 'The job site of the managing person',
  },
  address: {
    id: 'dp.application:certificate.address',
    defaultMessage: 'Heimilisfang',
    description: 'Address of the job site',
  },

  // Information
  informationTitle: {
    id: 'dp.application:certificate.information',
    defaultMessage: 'Upplýsingar',
    description: 'Information section title',
  },
  incapacityDate: {
    id: 'dp.application:certificate.information.incapacitated.date',
    defaultMessage:
      'Dagsetning þegar umsækjandi varð óvinnufær að hluta eða öllu leyti vegna núverandi heilsubrests',
    description:
      'Date when the applicant became incapacitated due to current health problems',
  },
  iCDAnalysis: {
    id: 'dp.application:certificate.information.ICD.analysis',
    defaultMessage: 'ICD greiningar sem valda megin heilsuvanda / óvinnufærni',
    description: 'ICD analysis causing the main health issue / incapacitation',
  },
  otherICDAnalysis: {
    id: 'dp.application:certificate.information.other.ICD.analysis',
    defaultMessage: 'Aðrar ICD greiningar sem valda heilsuvanda / óvinnufærni',
    description: 'Other ICD analysis causing health issue / incapacitation',
  },
  medicalHistory: {
    id: 'dp.application:certificate.information.medical.history',
    defaultMessage: 'Fyrri heilsufarssaga',
    description: 'Previous medical history',
  },
  impairmentCause: {
    id: 'dp.application:certificate.information.impairment.cause',
    defaultMessage:
      'Vandi sem veldur skerðingu á getu einstaklings til atvinnuþátttöku',
    description:
      'Impairment causing impaired capability for work participation',
  },
  impairmentStability: {
    id: 'dp.application:certificate.information.impairment.stability',
    defaultMessage: 'Stöðuleiki sjúkdómsgangs með tilliti til ICD greininga',
    description: 'Impairment stability',
  },
  impairmentProjectedImprovement: {
    id: 'dp.application:certificate.information.impairment.projected.improvement',
    defaultMessage: 'Hvenær er talið að færni muni aukast',
    description: 'Estimated rate of improvement',
  },
  medicalImplementsUsage: {
    id: 'dp.application:certificate.information.medical.implements.usage',
    defaultMessage:
      'Hvaða lyf, hjálpartæki eða önnur inngrip notar skjólstæðingur?',
    description: 'What medicine, aids or other implements does the client use?',
  },
  employmentCapability: {
    id: 'dp.application:certificate.information.employment.capability',
    defaultMessage: 'Starfsgeta',
    description: 'Employment capability',
  },
  previousTherapies: {
    id: 'dp.application:certificate.information.previous.therapies',
    defaultMessage: 'Hvaða endurhæfing hefur verið reynd?',
    description: 'What therapies have been tried?',
  },
  medicine: {
    id: 'dp.application:certificate.information.medicine',
    defaultMessage: 'Lyf',
  },
  otherInterventions: {
    id: 'dp.application:certificate.information.other.interventions',
    defaultMessage: 'Önnur inngrip',
  },
  supports: {
    id: 'dp.application:certificate.information.supports',
    defaultMessage: 'Hjálpartæki',
  },
  noMedicationAndSupportsUsed: {
    id: 'dp.application:certificate.information.no.medication.and.supports.used',
    defaultMessage: 'Engin lyf eða hjálpartæki eru notuð',
  },

  // Physical impairment
  physicalImpairment: {
    id: 'dp.application:certificate.physical.impairment',
    defaultMessage: 'Líkamlegar skerðingar',
    description: 'Physical impairment',
  },
  physicalImpairmentEffect: {
    id: 'dp.application:certificate.physical.impairment.effect',
    defaultMessage: 'Líkamsstarfsemi sem röskun/fötlun veldur skerðingu á.',
    description: 'Physical impairment effect',
  },

  // cognitive impairment
  cognitiveImpairment: {
    id: 'dp.application:certificate.cognitive.impairment',
    defaultMessage: 'Vitrænar skerðingar',
    description: 'Cognitive impairment',
  },
  cognitiveImpairmentEffect: {
    id: 'dp.application:certificate.cognitive.impairment.effect',
    defaultMessage: 'Mat á vitrænni skerðingu',
    description: 'Cognitive impairment effect',
  },
})
