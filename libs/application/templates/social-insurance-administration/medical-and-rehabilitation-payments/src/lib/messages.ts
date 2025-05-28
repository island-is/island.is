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
    // Data collection
    skraInformationTitle: {
      id: 'marp.application:pre.skra.information.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá, RSK og Útlendingarstofnun',
      description:
        'Information from Registers Iceland, RSK and Directorate of Immigration',
    },
    skraInformationDescription: {
      id: 'marp.application:pre.skra.information.description',
      defaultMessage:
        'Upplýsingar um þig, maka og börn. Upplýsingar um búsetu.',
      description:
        'Information about you, spouse and children. Information about residence.',
    },
    healthInstitutionTitle: {
      id: 'marp.application:pre.health.institution.title',
      defaultMessage: 'Upplýsingar frá heilbrigðisstofnun',
      description: 'Information from health institution',
    },
    healthInstitutionDescription: {
      id: 'marp.application:pre.health.institution.description',
      defaultMessage: 'Upplýsingar um læknisvottorð.',
      description: 'Information about medical certificate.',
    },
    unionHealthFundTitle: {
      id: 'marp.application:pre.union.health.fund.title',
      defaultMessage: 'Upplýsingar frá sjúkrasjóði stéttarfélags',
      description: 'Information from union health fund',
    },
    unionHealthFundDescription: {
      id: 'marp.application:pre.union.health.fund.description',
      defaultMessage:
        'Upplýsingar um hvenær þú lýkur/laukst áunnum sjúkrasjóðsrétti.',
      description:
        'Information about when you end/ended your acquired health fund rights.',
    },
    serviceRehabilitationTreatmentProviderTitle: {
      id: 'marp.application:pre.service.rehabilitation.treatment.provider.title',
      defaultMessage:
        'Upplýsingar frá þjónustuaðila, endurhæfingar- eða meðferðaraðila',
      description:
        'Information from service provider, rehabilitation or treatment provider',
    },
    serviceRehabilitationTreatmentProviderDescription: {
      id: 'marp.application:pre.service.rehabilitation.treatment.provider.description',
      defaultMessage:
        'Tryggingastofnun sækir endurhæfingaráætlun til þjónustuaðila sem sér um endurhæfingu eða meðferð.',
      description:
        'The Social Insurance Administration retrieves the rehabilitation plan from the service provider responsible for rehabilitation or treatment.',
    },
  }),

  generalInformation: defineMessages({
    // Payment information

    // Income Plan - Instructions
    incomePlanInstructionsSubSectionTitle: {
      id: 'marp.application:general.information.income.plan.instructions.sub.section.title',
      defaultMessage: 'Tekjuáætlun - Leiðbeiningar',
      description: 'Income Plan - Instructions',
    },

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
        'Sjálfstætt starfandi einstaklingar þurfa að setja inn þá dagsetningu sem reiknað endurgjald var/verður fellt niður.',
      description:
        'Self-employed individuals must enter the date on which the calculated remuneration was/will be cancelled.',
    },
    questionsCalculatedRemunerationDate: {
      id: 'marp.application:general.information.questions.calculated.remuneration.date',
      defaultMessage: 'Hvenær fellur niður reiknað endurgjald?',
      description: 'When does the calculated remuneration expire?',
    },
    questionsIsPartTimeEmployed: {
      id: 'marp.application:general.information.questions.is.part.time.employed',
      defaultMessage: 'Ertu í hlutastarfi?',
      description: 'Are you working part-time?',
    },
    questionsIsStudying: {
      id: 'marp.application:general.information.questions.is.studying',
      defaultMessage: 'Ertu í námi?',
      description: 'Are you studying?',
    },

    // Employee sick pay
    employeeSickPaySubSectionTitle: {
      id: 'marp.application:general.information.employee.sick.pay.sub.section.title',
      defaultMessage: 'Veikindalaun',
      description: 'Sick pay',
    },
    employeeSickPayTitle: {
      id: 'marp.application:general.information.employee.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til veikindalauna hjá atvinnurekanda?',
      description:
        'Have you used your sick pay entitlement at your current employer?',
    },
    employeeSickPayDoesEndDateTitle: {
      id: 'marp.application:general.information.employee.sick.pay.does.end.date.title',
      defaultMessage: 'Hvenær líkur rétti þínum til veikindalauna?',
      description: 'When does your sick pay entitlement end?',
    },
    employeeSickPayDidEndDateTitle: {
      id: 'marp.application:general.information.employee.sick.pay.did.end.date.title',
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

  rehabilitationPlan: defineMessages({
    sectionTitle: {
      id: 'marp.application:rehabilitation.plan.section.title',
      defaultMessage: 'Endurhæfingaráætlun',
      description: 'Rehabilitation Plan',
    },
    description: {
      id: 'marp.application:rehabilitation.plan.description',
      defaultMessage:
        'Staðfesting að þú sért komin með áætlun fyrir starfsendurhæfingu eða meðferð hjá viðurkenndum fagaðila.',
      description:
        'Confirmation that you have a plan for vocational rehabilitation or treatment with an approved professional.',
    },

    // Service Provider
    serviceProvider: {
      id: 'marp.application:rehabilitation.plan.service.provider',
      defaultMessage: 'Þjónustuaðili: {serviceProvider}',
      description: 'Service Provider: {serviceProvider}',
    },
    serviceProviderLocation: {
      id: 'marp.application:rehabilitation.plan.service.provider.location',
      defaultMessage: 'Starfsstöð',
      description: 'Location',
    },
    serviceProviderRehabilitationProvider: {
      id: 'marp.application:rehabilitation.plan.service.provider.rehabilitation.provider',
      defaultMessage: 'Endurhæfingaraðili',
      description: 'Rehabilitation provider',
    },
    serviceProviderJobTitle: {
      id: 'marp.application:rehabilitation.plan.service.provider.job.title',
      defaultMessage: 'Starfsheiti',
      description: 'Job title',
    },

    // Rehabilitation objective
    rehabilitationObjective: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective',
      defaultMessage: 'Markmið endurhæfingar',
      description: 'Rehabilitation objective',
    },
    rehabilitationObjectiveStart: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.start',
      defaultMessage: 'Upphaf endurhæfingar',
      description: 'Start of rehabilitation',
    },
    rehabilitationObjectiveEstimatedEnd: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.estimated.end',
      defaultMessage: 'Áætluð lok endurhæfingar',
      description: 'Estimated end of rehabilitation',
    },
    rehabilitationObjectiveEmphasisAndAim: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.emphasis.and.aim',
      defaultMessage: 'Áhersla og stefna í endurhæfingu',
      description: 'Emphasis and aim of rehabilitation',
    },
    rehabilitationObjectivePhysicalHealthGoals: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.physical.health.goals',
      defaultMessage: 'Markmið tengd líkamlegri heilsu',
      description: 'Goals related to physical health',
    },
    rehabilitationObjectivePhysicalHealthGoalsTooltip: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.physical.health.goals.tooltip',
      defaultMessage:
        'Líkamlegur vandi vísar til skerðinga eða truflana á líkamlegri starfsemi eða uppbyggingu líkamans. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum líkamlegum áföllum. Slíkur vandi getur haft áhrif á hreyfigetu, líkamsstöðu, skynjun, kraft, verki eða aðra líkamlega eiginleika og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum. Markmið geta stuðlað að aukinni líkamlegri virkni, getu og vellíðan í daglegu lífi.',
      description:
        'A physical impairment refers to problem or disruption of the physical function or body structure. The impairment may be caused by illness, injury or other physical trauma. Such impairment may affect mobility, posture, sensation, strength, pain or other physical abilities and thus limit the person’s ability to perform daily activities. Goals can contribute to increased physical activity, ability and well-being in everyday life.',
    },
    rehabilitationObjectivePhysicalHealthResources: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.physical.health.resources',
      defaultMessage: 'Úrræði fyrir líkamlega heilsu',
      description: 'Resources for physical health',
    },
    rehabilitationObjectiveMentalHealthGoals: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.mental.health.goals',
      defaultMessage: 'Markmið tengd andlegri heilsu',
      description: 'Goals related to mental health',
    },
    rehabilitationObjectiveMentalHealthGoalsTooltip: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.mental.health.goals.tooltip',
      defaultMessage:
        'Andlegur vandi vísar til skerðinga eða frávika í starfsemi hugans eða tilfinningalífs. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum áföllum. Slíkur vandi nær meðal annars til skynjunar, jafnvægis í tilfinningalífi, einbeitingu, minni, samskipta- eða aðlögunarhæfni og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum. Markmið geta stuðlað að andlegu jafnvægi, vellíðan og sjálfstæði.',
      description:
        'Mental impairment refers to problems or deviation in the functionality of the mind or emotions. The impairment may be caused by illness, injury or other trauma. Such impairments include problems with sensation, emotional balance, focus, memory, communication or adjustment, and thus limit the person’s ability to perform daily activities. Goals can contribute to increased mental balance, well-being and independence.',
    },
    rehabilitationObjectiveMentalHealthResources: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.mental.health.resources',
      defaultMessage: 'Úrræði fyrir andlega heilsu',
      description: 'Resources for mental health',
    },
    rehabilitationObjectiveActivityAndParticipationGoals: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.activity.and.participation.goals',
      defaultMessage: 'Markmið tengd virkni og þátttöku',
      description: 'Goals related to activity and participation',
    },
    rehabilitationObjectiveActivityAndParticipationGoalsTooltip: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.activity.and.participation.goals.tooltip',
      defaultMessage:
        'Virkni og þátttöku vandi vísar til getu við að taka þátt í samfélaginu og sinna daglegum athöfnum. Vandinn getur stafað af sjúkdómum, meiðslum, öðrum áföllum og umhverfisþáttum. Slíkur vandi getur falið í sér takmarkanir á getu til að sinna eða uppfylla hlutverk í fjölskyldu, tómstundum, námi, vinnu eða öðrum félagslegum aðstæðum. Markmið geta stuðlað að því að efla virkni og færni í að takast á við daglegt líf, auka félagslega þátttöku, sjálfstæði, að takast á við samfélagslega aðstæður og getu til náms/starfa.',
      description:
        'Activity and participation impairment refers to the ability to participate in society and carry out daily activities. The impairment may be caused by illness, injury, other trauma or environmental factors. Such impairment may include limitations in the ability to perform or fulfil roles within a family, leisure, study, work or other social settings. Goals can contribute to the development of skills to cope with daily life, increase social participation and independence, help deal with social settings and the increase the ability to study/work.',
    },
    rehabilitationObjectiveActivityAndParticipationResources: {
      id: 'marp.application:rehabilitation.plan.rehabilitation.objective.activity.and.participation.resources',
      defaultMessage: 'Úrræði fyrir virkni og þátttöku',
      description: 'Resources for activity and participation',
    },
    confirm: {
      id: 'marp.application:rehabilitation.plan.confirm',
      defaultMessage:
        'Ég staðfesti að ofangreindar upplýsingar eru réttar og skil að virk þátttaka mín í áætlaðri meðferð eða endurhæfingu er forsenda sjúkra- og endurhæfingargreiðslna frá TR.',
      description:
        'I confirm that the above information is correct and understand that my active participation in the planned treatment or rehabilitation is a prerequisite for receiving medical and rehabilitation payments from TR.',
    },
  }),

  selfAssessment: defineMessages({
    sectionTitle: {
      id: 'marp.application:self.assessment.section.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self-assessment',
    },
    title: {
      id: 'marp.application:self.assessment.title',
      defaultMessage: 'Spurningalisti vegna færniskerðingar',
      description: 'Questionnaire for skills impairment',
    },
    description: {
      id: 'marp.application:self.assessment.description',
      defaultMessage:
        'Þessi hluti inniheldur spurningar um hvernig þú upplifir eigin færni í daglegu lífi og starfi. Hér getur verið um að ræða líkamlega, andlega eða félagslega þætti sem geta haft áhrif á getu þína til að sinna daglegum athöfnum, starfi og frístundum. \n\nHafðu í huga að um er að ræða umfangsmikinn lista yfir atriði sem eiga ekki endilega við þig. Því er mikilvægt að þú metir hvernig þú upplifir stöðuna eins og hún er núna, ekki hvernig hún var áður eða hvernig þú vilt að hún verði.',
      description:
        'This section contains questions about how you experience your own skills in everyday life and work. These may include physical, mental, or social factors that can affect your ability to carry out daily activities, work, and leisure activities. \n\nKeep in mind that this is an extensive list of subjects that do not necessarily apply to you. Therefore, it is important that you evaluate how you experience your situation as it is at the present time, not how it was before or how you would like it to be.',
    },
    questionNumber: {
      id: 'marp.application:self.assessment.question.number',
      defaultMessage: 'Spurning {index} af {total}',
      description: 'Question {index} of {total}',
    },
    previousQuestion: {
      id: 'marp.application:self.assessment.previous.question',
      defaultMessage: 'Fyrri spurning',
      description: 'Previous question',
    },
    nextQuestion: {
      id: 'marp.application:self.assessment.next.question',
      defaultMessage: 'Næsta spurning',
      description: 'Next question',
    },
    noDifficultyOption: {
      id: 'marp.application:self.assessment.no.difficulty.option',
      defaultMessage: 'Enginn vandi',
      description: 'No difficulty',
    },
    minorDifficultyOption: {
      id: 'marp.application:self.assessment.minor.difficulty.option',
      defaultMessage: 'Vægur vandi',
      description: 'Minor difficulty',
    },
    moderateDifficultyOption: {
      id: 'marp.application:self.assessment.moderate.difficulty.option',
      defaultMessage: 'Miðlungs vandi',
      description: 'Moderate difficulty',
    },
    majorDifficultyOption: {
      id: 'marp.application:self.assessment.major.difficulty.option',
      defaultMessage: 'Mikill vandi',
      description: 'Major difficulty',
    },
    completeInabilityOption: {
      id: 'marp.application:self.assessment.complete.inability.option',
      defaultMessage: 'Algjör vandi',
      description: 'Complete inability',
    },
    noAnswerOption: {
      id: 'marp.application:self.assessment.no.answer.option',
      defaultMessage: 'Get/vil ekki svara',
      description: 'Cannot/will not answer',
    },
    completeSelfAssessment: {
      id: 'marp.application:self.assessment.complete.self.assessment',
      defaultMessage: 'Ljúka sjálfsmati',
      description: 'Complete self-assessment',
    },
    sectionDescription: {
      id: 'marp.application:self.assessment.section.description',
      defaultMessage:
        'Þessi sjálfsmatslisti er ætlaður til að meta þína eigin upplifun af færni til daglegra athafna og þátttöku í endurhæfingu/viðurkenndri meðferð. Markmiðið er að fá betri innsýn í hvernig þú metur þína getu og hvort endurhæfing/viðurkennd meðferð sé að skila tilætluðum árangri.\n\nListinn samanstendur af spurningum um líkamlega, andlega og félagslega færni sem og þátttöku í daglegu lífi, starfi eða frístundum.\n\nVinsamlegast svaraðu eftir bestu  getu og í samræmi við núverandi stöðu. Ef þú þarft aðstoð við að svara þá er í lagi að fá hjálp, helst frá einhverjum sem þekkir þig vel.',
      description:
        'This self-assessment list is intended to assess your own experience of the ability to perform daily activities and participate in rehabilitation/recognized treatment. The goal is to gain better insight into how you assess your ability and whether rehabilitation/recognized treatment is achieving the desired results.\n\nThe list consists of questions about physical, mental and social skills as well as participation in daily life, work or leisure activities.\n\nPlease answer to the best of your ability and in accordance with your current status. If you need help answering, it is okay to get help, preferably from someone who knows you well.',
    },
    hadAssistance: {
      id: 'marp.application:self.assessment.had.assistance',
      defaultMessage: 'Ég fæ aðstoð við að svara sjálfsmatinu',
      description: 'I get an assistance to answer the self-assessment',
    },
    highestlevelOfEducationDescription: {
      id: 'marp.application:self.assessment.highest.level.of.education.description',
      defaultMessage: 'Hvert er hæsta námsstig sem þú hefur lokið?',
      description: 'What is the highest level of education you have completed?',
    },
    levelOfEducationTitle: {
      id: 'marp.application:self.assessment.level.of.education.title',
      defaultMessage: 'Námsstig',
      description: 'Level of education',
    },
    levelOfEducationPlaceholder: {
      id: 'marp.application:self.assessment.level.of.education.placeholder',
      defaultMessage: 'Veldu námsstig',
      description: 'Select a level of education',
    },

    // Questions Three
    mainProblemTitle: {
      id: 'marp.application:self.assessment.main.problem.title',
      defaultMessage: 'Hver er helsti vandi sem leiðir til óvinnufærni?',
      description: 'What is the main problem that leads to incapacity?',
    },
    mainProblem: {
      id: 'marp.application:self.assessment.main.problem',
      defaultMessage: 'Helsti vandi',
      description: 'Main problem',
    },
    hasPreviouslyReceivedRehabilitationOrTreatment: {
      id: 'marp.application:self.assessment.has.previously.received.rehabilitation.or.treatment',
      defaultMessage:
        'Hefur þú áður tekið þátt í endurhæfingu eða meðferð vegna vandans sem veldur óvinnufærni?',
      description:
        'Have you previously received rehabilitation or treatment for the problem causing your incapacity?',
    },
    previousRehabilitationOrTreatment: {
      id: 'marp.application:self.assessment.previous.rehabilitation.or.treatment',
      defaultMessage: 'Hvaða endurhæfingu eða meðferð hefur þú tekið þátt í?',
      description: 'What rehabilitation or treatment have you received?',
    },
    previousRehabilitationSuccessful: {
      id: 'marp.application:self.assessment.previous.rehabilitation.successful',
      defaultMessage: 'Hefur fyrri endurhæfing skilað þér árangri?',
      description: 'Was the previous rehabilitation successful?',
    },
    previousRehabilitationSuccessfulFurtherExplanations: {
      id: 'marp.application:self.assessment.previous.rehabilitation.successful.further.explanations',
      defaultMessage: 'Skráðu inn frekari skýringar',
      description: 'List further explanations',
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
    rehabilitationPlanConfirmed: {
      id: 'marp.application:overiew.rehabilitation.plan.confirmed',
      defaultMessage: 'Þú hefur staðfest endurhæfingaráætlunina',
      description: 'You have confirmed your rehabilitation plan',
    },
    selfAssessmentConfirmed: {
      id: 'marp.application:overiew.self.assessment.confirmed',
      defaultMessage: 'Þú hefur lokið við að svara spurningalista',
      description: 'You have completed answering the questionnaire',
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
