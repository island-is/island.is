import { MessageDescriptor, defineMessages } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const medicalAndRehabilitationPaymentsFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'marp.application:applicationTitle',
      defaultMessage: 'Sjúkra- og endurhæfingargreiðslur',
      description: 'Medical and Rehabilitation Payments',
    },
    date: {
      id: 'marp.application:date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    datePlaceholder: {
      id: 'marp.application:date.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    notApplicable: {
      id: 'marp.application:not.applicable',
      defaultMessage: 'Á ekki við',
      description: 'Not applicable',
    },
    sickPayDidEndDate: {
      id: 'marp.application:sick.pay.did.end.date',
      defaultMessage: 'Réttinum lauk',
      description: 'Your entitlement ended',
    },
    sickPayDoesEndDate: {
      id: 'marp.application:sick.pay.does.end.date',
      defaultMessage: 'Réttinum lýkur',
      description: 'Your entitlement ends',
    },
    uploadConfirmationDocument: {
      id: 'marp.application:upload.confirmation.document',
      defaultMessage: 'Hlaða inn staðfestingarskjali',
      description: 'Upload confirmation document',
    },
  }),

  pre: defineMessages({
    sectionTitle: {
      id: 'marp.application:pre.section.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },

    // Application type
    applicationTypeSubSectionTitle: {
      id: 'marp.application:pre.application.type.sub.section.title',
      defaultMessage: 'Tegund umsóknar',
      description: 'Type of application',
    },
    applicationTypeSubSectionDescription: {
      id: 'marp.application:pre.application.type.sub.section.description',
      defaultMessage: 'Vinsamlegast veldu tegund umsóknar',
      description: 'Vinsamlegast veldu tegund umsóknar',
    },

    // Data collection
  }),

  generalInformation: defineMessages({
    // Payment information

    // Questions
    questionsSubSectionTitle: {
      id: 'marp.application:general.information.questions.sub.section.title',
      defaultMessage: 'Spurningar',
      description: 'Questions',
    },
    questionsIsSelfEmployed: {
      id: 'marp.application:general.information.questions.is.self.employed',
      defaultMessage: 'Ertu sjálfstætt starfandi?',
      description: 'Are you self-employed?',
    },
    questionsIsSelfEmployedDescription: {
      id: 'marp.application:general.information.questions.is.self.employed.description',
      defaultMessage:
        'Sjálfstætt starfandi einstaklingar þurfa að setja inn dagsetningu lækkunar á reiknuðu endurgjaldi.',
      description:
        'Self-employed individuals must enter the date of reduction in calculated remuneration',
    },
    questionsIsSelfEmployedDate: {
      id: 'marp.application:general.information.questions.is.self.employed.date',
      defaultMessage: 'Hvenær var lækkun á reiknuðu endurgjaldi?',
      description: 'When was the reduction in calculated remuneration?',
    },
    questionsIsWorkingPartTime: {
      id: 'marp.application:general.information.questions.is.working.part.time',
      defaultMessage: 'Ertu í hlutastarfi?',
      description: 'Are you working part-time?',
    },
    questionsIsStudying: {
      id: 'marp.application:general.information.questions.is.studying',
      defaultMessage: 'Ertu í námi?',
      description: 'Are you studying?',
    },

    // Sick pay
    sickPaySubSectionTitle: {
      id: 'marp.application:general.information.sick.pay.sub.section.title',
      defaultMessage: 'Veikindalaun',
      description: 'Sick pay',
    },
    sickPayTitle: {
      id: 'marp.application:general.information.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til veikindalauna hjá atvinnurekanda?',
      description:
        'Have you used your sick pay entitlement at your current employer?',
    },
    sickPayDoesEndDateTitle: {
      id: 'marp.application:general.information.sick.pay.does.end.date.title',
      defaultMessage: 'Hvenær líkur rétti þínum til veikindalauna?',
      description: 'When does your sick pay entitlement end?',
    },
    sickPayDidEndDateTitle: {
      id: 'marp.application:general.information.sick.pay.did.end.date.title',
      defaultMessage: 'Hvenær lauk rétti þínum til veikindalauna?',
      description: 'When did your sick pay entitlement end?',
    },

    // Union sick pay
    unionSickPaySubSectionTitle: {
      id: 'marp.application:general.information.union.sick.pay.sub.section.title',
      defaultMessage: 'Sjúkradagpeningar',
      description: 'Union sick pay',
    },
    unionSickPayTitle: {
      id: 'marp.application:general.information.union.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til sjúkradagpeninga frá stéttarfélagi?',
      description: 'Have you used your union sick pay entitlement?',
    },
    unionSickPayUnionDescriptionTitle: {
      id: 'marp.application:general.information.union.sick.pay.union.description.title',
      defaultMessage: 'Skráning stéttarfélags',
      description: 'Union registration',
    },
    unionSickPayUnionSelectTitle: {
      id: 'marp.application:general.information.union.sick.pay.union.select.title',
      defaultMessage: 'Stéttarfélag',
      description: 'Union',
    },
    unionSickPayUnionSelectPlaceholder: {
      id: 'marp.application:general.information.union.sick.pay.union.select.placeholder',
      defaultMessage: 'Veldu stéttarfélag',
      description: 'Select union',
    },
    unionSickPayDidEndDate: {
      id: 'marp.application:general.information.union.sick.pay.did.end.date',
      defaultMessage: 'Hvenær lauk rétti þínum til sjúkradagpeninga?',
      description: 'When did your entitlement to union sick pay end?',
    },
    unionSickPayDoesEndDate: {
      id: 'marp.application:general.information.union.sick.pay.does.end.date',
      defaultMessage: 'Hvenær lýkur rétti þínum til sjúkradagpeninga?',
      description: 'When does your entitlement to union sick pay end?',
    },
    unionSickPayFromUnionTitle: {
      id: 'marp.application:general.information.union.sick.pay.from.union.title',
      defaultMessage: 'Sjúkradagpeningar frá stéttarfélagi',
      description: 'Sick pay from union',
    },
    unionSickPayFromUnionName: {
      id: 'marp.application:general.information.union.sick.pay.from.union.name',
      defaultMessage: 'Þitt stéttarfélag',
      description: 'Your union',
    },

    // Tengdar umsóknir?
  }),

  // Grunnvottorð
  certificateForSicknessAndRehabilitation: defineMessages({
    sectionTitle: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.section.title',
      defaultMessage: 'Grunnvottorð',
      description: 'Certificate for Sickness and Rehabilitation',
    },
    description: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.description',
      defaultMessage:
        'Forsenda fyrir greiðslum er að heilsubrestur einstaklings sé afleiðing af sjúkdómi, slysi eða áfalli. Grunnvottorð þarf að innihalda staðfestingu þess efnis.',
      description:
        'The prerequisite for payments is that the person’s health issues is the result of illness, accident or trauma. The Certificate for Sickness and Rehabilitation must contain confirmation to that effect.',
    },

    // Managed by
    managedBy: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.managed.by',
      defaultMessage: 'Utanumhaldandi',
      description: 'Managed by',
    },
    managedByJobTitle: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.managed.by.job.title',
      defaultMessage: 'Starfsheiti',
      description: 'Job title',
    },
    managedByLocation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.managed.by.location',
      defaultMessage: 'Starfsstöð',
      description: 'Location',
    },
    managedByAddress: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.managed.by.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },

    // Information
    information: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    informationDateOfLastExamination: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.date.of.last.examination',
      defaultMessage: 'Dagsetning síðustu skoðunar',
      description: 'Date of last examination',
    },
    informationDateOfCertificate: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.date.of.certificate',
      defaultMessage: 'Dagsetning vottorðs',
      description: 'Date of certificate',
    },
    informationIncapacitatedDate: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.incapacitated.date',
      defaultMessage:
        'Dagsetning þegar umsækjandi varð óvinnufær vegna núverandi heilsuvanda',
      description:
        'Date when the applicant became incapacitated due to current health problems',
    },
    informationICDAnalysis: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.ICD.analysis',
      defaultMessage: 'ICD greiningar sem valda megin heisuvanda / óvinnufærni',
      description:
        'ICD analysis causing the main health issue / incapacitation',
    },
    informationMedicalHistory: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.medical.history',
      defaultMessage: 'Fyrri heilsufarssaga',
      description: 'Previous medical history',
    },
    informationCurrentStatus: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.current.status',
      defaultMessage: 'Staða umsækjanda í dag',
      description: 'Applicant current status',
    },

    // Physical impairment
    physicalImpairment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.physical.impairment',
      defaultMessage: 'Líkamlegur vandi',
      description: 'Physical impairment',
    },
    physicalImpairmentTooltip: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.physical.impairment.tooltip',
      defaultMessage:
        'Líkamlegur vandi vísar til skerðinga eða truflana á líkamlegri starfsemi eða uppbyggingu líkamans. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum líkamlegum áföllum. Slíkur vandi getur haft áhrif á hreyfigetu, líkamsstöðu, skynjun, kraft, verki eða aðra líkamlega eiginleika og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum.',
      description:
        'A physical impairment refers to problem or disruption of the physical function or body structure. The impairment may be caused by illness, injury or other physical trauma. Such impairment may affect mobility, posture, sensation, strength, pain or other physical abilities and thus limit the person’s ability to perform daily activities.',
    },
    physicalImpairmentAffect: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.physical.impairment.affect',
      defaultMessage: 'Hversu mikið hefur líkamlegur vandi áhrif á daglegt líf',
      description: 'How much does the physical impairment affect daily life',
    },
    physicalImpairmentExplanation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.physical.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi líkamlegan vanda',
      description: 'Further explanation of the physical impairment',
    },

    // Mental impairment
    mentalImpairment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.mental.impairment',
      defaultMessage: 'Andlegur vandi',
      description: 'Mental impairment',
    },
    mentalImpairmentTooltip: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.mental.impairment.tooltip',
      defaultMessage:
        'Andlegur vandi vísar til skerðinga eða frávika í starfsemi hugans eða tilfinningalífs. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum áföllum. Slíkur vandi nær meðal annars til skynjunar, jafnvægis í tilfinningalífi, einbeitingu, minni, samskipta- eða aðlögunarhæfni og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum.',
      description:
        'Mental impairment refers to problems or deviation in the functionality of the mind or emotions. The impairment may be caused by illness, injury or other trauma. Such impairments include problems with sensation, emotional balance, focus, memory, communication or adjustment, and thus limit the person’s ability to perform daily activities.',
    },
    mentalImpairmentAffect: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.mental.impairment.affect',
      defaultMessage: 'Hversu mikið hefur andlegur vandi áhrif á daglegt líf',
      description: 'How much does the mental impairment affect daily life',
    },
    mentalImpairmentExplanation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.mental.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi andlegan vanda',
      description: 'Further explanation of the mental impairment',
    },

    // Activity and participation impairment
    activityAndParticipationImpairment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.activity.and.participation.impairment',
      defaultMessage: 'Virkni- og þátttökuvandi',
      description: 'Activity and participation impairment',
    },
    activityAndParticipationImpairmentTooltip: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.activity.and.participation.impairment.tooltip',
      defaultMessage:
        'Virkni og þátttöku vandi vísar til getu við að taka þátt í samfélaginu og sinna daglegum athöfnum. Vandinn getur stafað af sjúkdómum, meiðslum, öðrum áföllum og umhverfisþáttum. Slíkur vandi getur falið í sér takmarkanir á getu til að sinna eða uppfylla hlutverk í fjölskyldu, tómstundum, námi, vinnu eða öðrum félagslegum aðstæðum.',
      description:
        'Activity and participation impairment refers to the ability to participate in society and carry out daily activities. The impairment may be caused by illness, injury, other trauma or environmental factors. Such impairment may include limitations in the ability to perform or fulfil roles within a family, leisure, study, work or other social settings.',
    },
    activityAndParticipationImpairmentAffect: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.activity.and.participation.impairment.affect',
      defaultMessage:
        'Hversu mikið hefur virkni- og þátttökuvandi áhrif á daglegt líf',
      description:
        'How much does the activity and participation impairment affect daily life',
    },
    activityAndParticipationImpairmentExplanation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.activity.and.participation.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi virkni- og þátttökuvanda',
      description:
        'Further explanation of the activity and participation impairment',
    },
    activityAndParticipationImpairmentMainImpairmentExplanation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.activity.and.participation.impairment.main.impairment.explanation',
      defaultMessage: 'Annað varðandi megin vanda',
      description: 'Further information on main impairment',
    },

    // Application for medical and rehabilitation payments
    application: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application',
      defaultMessage: 'Sótt er um sjúkra- og endurhæfingargreiðslur',
      description: 'Application for medical and rehabilitation payments',
    },
    applicationCertificateRequestedBy: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.certificate.requested.by',
      defaultMessage: 'Hver óskaði eftir vottorði',
      description: 'Certificate requested by',
    },
    applicationApplyingDueTo: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.applying.due.to',
      defaultMessage: 'Sótt er um eftirfarandi greiðslu vegna',
      description: 'Applying for payments due to',
    },
    applicationApplyingFor: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.applying.for',
      defaultMessage: 'Sótt er um',
      description: 'Applying for',
    },
    applicationTypeOfTreatment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.type.of.treatment',
      defaultMessage: 'Tegund meðferðar',
      description: 'Type of treatment',
    },
    applicationIncludedInTreatment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.included.in.treatment',
      defaultMessage: 'Innihald meðferðar',
      description: 'Included in treatment',
    },
    applicationStartOfTreatment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.start.of.treatment',
      defaultMessage: 'Upphaf meðferðar',
      description: 'Start of treatment',
    },
    applicationEstimatedEndOfTreatment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.estimated.end.of.treatment',
      defaultMessage: 'Áætluð lok meðferðar',
      description: 'Estimated end of treatment',
    },
    applicationEstimatedTime: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.application.estimated.time',
      defaultMessage: 'Áætluð tímalengd',
      description: 'Estimated time',
    },
  }),

  selfAssessment: defineMessages({
    sectionTitle: {
      id: 'marp.application:self.assessment.section.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self-assessment',
    },
  }),

  overview: defineMessages({
    studyConfirmation: {
      id: 'marp.application:overview.study.confirmation',
      defaultMessage: 'Staðfesting á námi',
      description: 'Confirmation of study',
    },
    unionSickPayConfirmation: {
      id: 'marp.application:overview.union.sick.pay.confirmation',
      defaultMessage: 'Sjúkradagpeningar frá stéttarfélagi',
      description: 'Sick pay from union',
    },
  }),

  conclusion: defineMessages({}),
}

export const errorMessages = defineMessages({
  dateRequired: {
    id: 'marp.application:error.date.required',
    defaultMessage: 'Það þarf að velja dagsetningu',
    description: 'You must select a date',
  },
})

export const statesMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'marp.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna sjúkra- og endurhæfingagreiðslna hefur verið samþykkt',
    description:
      'The application for medical and rehabilitation payments has been approved',
  },
})
