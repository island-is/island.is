import { defineMessages } from 'react-intl'

export const certificate = defineMessages({
  sectionTitle: {
    id: 'dp.application:disability.pension.certificate.section.title',
    defaultMessage: 'Grunnvottorð / Vottorð um örorku',
    description: 'Certificate for Disability Pension',
  },

  description: {
    id: 'dp.application:disability.pension.certificate.description',
    defaultMessage:
      'Forsenda fyrir greiðslum er að heilsubrestur einstaklings sé afleiðing af sjúkdómi, slysi eða áfalli. Grunnvottorð þarf að innihalda staðfestingu þess efnis.',
    description:
      'The prerequisite for payments is that the person’s health issues is the result of illness, accident or trauma. The Certificate for Sickness and Rehabilitation must contain confirmation to that effect.',
  },

  // Managed by
  managedBy: {
    id: 'dp.application:disability.pension.certificate.managed.by',
    defaultMessage: 'Utanumhaldandi',
    description: 'Managed by',
  },
  residence: {
    id: 'dp.application:disability.pension.certificate.residence',
    defaultMessage: 'Aðsetur',
    description: 'Residence',
  },
  doctorNumber: {
    id: 'dp.application:disability.pension.certificate.doctor.number',
    defaultMessage: 'Læknisnúmer',
    description: 'Doctor number',
  },
  email: {
    id: 'dp.application:disability.pension.certificate.email',
    defaultMessage: 'Netfang',
    description: 'Email',
  },
  phoneNumber: {
    id: 'dp.application:disability.pension.certificate.phone.number',
    defaultMessage: 'Símanúmer',
    description: 'Phone number',
  },
  address: {
    id: 'dp.application:disability.pension.certificate.address',
    defaultMessage: 'Heimilisfang',
    description: 'Address',
  },

  // Information
  information: {
    id: 'dp.application:disability.pension.certificate.information',
    defaultMessage: 'Upplýsingar',
    description: 'Information',
  },
  informationDateOfLastExamination: {
    id: 'dp.application:disability.pension.certificate.information.date.of.last.examination',
    defaultMessage: 'Dagsetning síðustu skoðunar',
    description: 'Date of last examination',
  },
  informationDateOfCertificate: {
    id: 'dp.application:disability.pension.certificate.information.date.of.certificate',
    defaultMessage: 'Dagsetning vottorðs',
    description: 'Date of certificate',
  },
  informationIncapacitatedDate: {
    id: 'dp.application:disability.pension.certificate.information.incapacitated.date',
    defaultMessage:
      'Dagsetning þegar umsækjandi varð óvinnufær að hluta eða öllu leyti vegna núverandi heilsubrests',
    description:
      'Date when the applicant became incapacitated due to current health problems',
  },
  informationICDAnalysis: {
    id: 'dp.application:disability.pension.certificate.information.ICD.analysis',
    defaultMessage: 'ICD greiningar sem valda megin heilsuvanda / óvinnufærni',
    description: 'ICD analysis causing the main health issue / incapacitation',
  },
  informationOtherICDAnalysis: {
    id: 'dp.application:disability.pension.certificate.information.other.ICD.analysis',
    defaultMessage: 'Aðrar ICD greiningar sem valda heilsuvanda / óvinnufærni',
    description: 'Other ICD analysis causing health issue / incapacitation',
  },
  informationMedicalHistory: {
    id: 'dp.application:disability.pension.certificate.information.medical.history',
    defaultMessage: 'Fyrri heilsufarssaga',
    description: 'Previous medical history',
  },
  informationMedicalImpairmentCause: {
    id: 'dp.application:disability.pension.certificate.information.medical.impairment.cause',
    defaultMessage:
      'Vandi sem veldur skerðingu á getu einstaklings til atvinnuþátttöku',
    description: 'Certificate cause',
  },
  informationMedicalImpairmentStability: {
    id: 'dp.application:disability.pension.certificate.information.medical.impairment.stability',
    defaultMessage: 'Stöðuleiki sjúkdómsgangs með tilliti til ICD greininga',
    description: 'TODO',
  },
  informationMedicalImpairmentProjectedImprovement: {
    id: 'dp.application:disability.pension.certificate.information.medical.impairment.projected.improvement',
    defaultMessage: 'Hvenær er talið að færni muni aukast',
    description: 'TODO',
  },
  informationMedicalMedicalImplementsUsage: {
    id: 'dp.application:disability.pension.certificate.information.medical.medical.implements.usage',
    defaultMessage:
      'Er einstaklingur að nota lyf vegna heilsubrests, hjálpartæki eða önnur inngrip í daglegu lífi',
    description: 'TODO',
  },
  informationCurrentStatus: {
    id: 'dp.application:disability.pension.certificate.information.current.status',
    defaultMessage: 'Staða umsækjanda í dag',
    description: 'Applicant current status',
  },

  // Physical impairment
  physicalImpairment: {
    id: 'dp.application:disability.pension.certificate.physical.impairment',
    defaultMessage: 'Líkamlegar skerðingar',
    description: 'Physical impairment',
  },
  physicalImpairmentTooltip: {
    id: 'dp.application:disability.pension.certificate.physical.impairment.tooltip',
    defaultMessage:
      'Líkamlegur vandi vísar til skerðinga eða truflana á líkamlegri starfsemi eða uppbyggingu líkamans. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum líkamlegum áföllum. Slíkur vandi getur haft áhrif á hreyfigetu, líkamsstöðu, skynjun, kraft, verki eða aðra líkamlega eiginleika og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum.',
    description:
      'A physical impairment refers to problem or disruption of the physical function or body structure. The impairment may be caused by illness, injury or other physical trauma. Such impairment may affect mobility, posture, sensation, strength, pain or other physical abilities and thus limit the person’s ability to perform daily activities.',
  },
  physicalImpairmentEffect: {
    id: 'dp.application:disability.pension.certificate.physical.impairment.effect',
    defaultMessage: 'Líkamsstarfsemi sem röskun/fötlun veldur skerðingu á.',
    description: 'TODO',
  },

  // cognitive impairment
  cognitiveImpairment: {
    id: 'dp.application:disability.pension.certificate.cognitive.impairment',
    defaultMessage: 'Vitrænar skerðingar',
    description: 'Cognitive impairment',
  },
  cognitiveImpairmentEffect: {
    id: 'dp.application:disability.pension.certificate.cognitive.impairment.effect',
    defaultMessage: 'Mat á vitrænni skerðingu',
    description: 'TODO',
  },

  // function assessment
  functionalAssessment: {
    id: 'dp.application:disability.pension.certificate.functional.assessment',
    defaultMessage: 'Mat á færni',
    description: 'Functional assessment',
  },
  functionalAssessmentDescription: {
    id: 'dp.application:disability.pension.certificate.functional.assessment.description',
    defaultMessage: 'Mat á færni einstaklinga.',
    description: 'TODO',
  },
})
