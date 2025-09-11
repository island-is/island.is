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
    jobTitle: {
      id: 'marp.application:job.title',
      defaultMessage: 'Starfsheiti',
      description: 'Job title',
    },
    managedBy: {
      id: 'marp.application:managed.by',
      defaultMessage: 'Utanumhaldandi',
      description: 'Managed by',
    },
    location: {
      id: 'marp.application:location',
      defaultMessage: 'Starfsstöð',
      description: 'Location',
    },
    information: {
      id: 'marp.application:information',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    dateOfConfirmation: {
      id: 'marp.application:date.of.confirmation',
      defaultMessage: 'Dagsetning staðfestingar',
      description: 'Date of confirmation',
    },
    furtherExplanation: {
      id: 'marp.application:further.explanation',
      defaultMessage: 'Nánari útskýring',
      description: 'Further explanation',
    },
    application: {
      id: 'marp.application:application',
      defaultMessage: 'Sótt er um sjúkra- og endurhæfingargreiðslur',
      description: 'Application for medical and rehabilitation payments',
    },
    applyingFor: {
      id: 'marp.application:applying.for',
      defaultMessage: 'Sótt er um',
      description: 'Applying for',
    },
    startOfTreatment: {
      id: 'marp.application:start.of.treatment',
      defaultMessage: 'Upphaf meðferðar',
      description: 'Start of treatment',
    },
    estimatedEndOfTreatment: {
      id: 'marp.application:estimated.end.of.treatment',
      defaultMessage: 'Áætluð lok meðferðar',
      description: 'Estimated end of treatment',
    },
    estimatedTimeUnclear: {
      id: 'marp.application:estimated.time.unclear',
      defaultMessage: 'Óljóst',
      description: 'Unclear',
    },
    estimatedTime: {
      id: 'marp.application:estimated.time',
      defaultMessage: 'Áætluð tímalengd',
      description: 'Estimated time',
    },
    estimatedTimeMonths: {
      id: 'marp.application:estimated.time.months',
      defaultMessage: '{months} mánuðir',
      description: '{months} months',
    },
    confirmationConfirm: {
      id: 'marp.application:confirmation.confirm',
      defaultMessage:
        'Ég staðfesti að upplýsingar að ofan eru réttar, enda eru þær forsenda fyrir áframhaldandi sjúkragreiðslum.',
      description:
        'I confirm that the above information is correct, as it is a prerequisite for ongoing medical payments.',
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
    socialInsuranceAdministrationPrivacyDescription: {
      id: 'marp.application:pre.socialInsuranceAdministration.privacy.description#markdown',
      defaultMessage:
        'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna [hér](https://www.tr.is/tryggingastofnun/personuvernd). \n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.\n\nRangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annarra viðurlaga.\n\nTryggingastofnun getur ákveðið að vísa máli þínu til samhæfingarteymis sem í sitja fulltrúar þjónustuaðila og Tryggingastofnunar. Þjónustuaðilar eru VIRK, starfsendurhæfingarsjóður, félagsþjónusta sveitarfélaga, Vinnumálastofnun, sjúkrahús og heilsugæslur. Ákveði Tryggingastofnun að vísa máli þínu til samhæfingarteymis verður þú upplýst/ur um það og gefinn kostur á að hafna þjónustu teymisins.',
      description:
        'More information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://island.is/s/tryggingastofnun/personuverndarstefna-tr).\n\nIf your income or circumstances change you must notify the Social Insurance Administration, as it can effect your payments.\n\nIncorrect or insufficient information may affect the processing of the application and possibly lead to reclamation  or other penalties. \n\nThe Social Insurance Administration may decide to refer your case to a coordination team that includes representatives of service providers and the Social Insurance Administration. Service providers are VIRK, vocational rehabilitation fund, municipal social services, the Directorate of Labour, hospitals and health care clinics. If the Social Insurance Administration decides to refer your case to a coordination team, you will be informed and given the opportunity to reject the team’s services.',
    },
    checkboxProvider: {
      id: 'marp.application:pre.checkbox.provider',
      defaultMessage: 'Ég skil ofangreindar upplýsingar',
      description: 'I understand the above information',
    },
  }),

  notEligible: defineMessages({
    title: {
      id: 'marp.application:not.eligible.title',
      defaultMessage:
        'Því miður átt þú ekki rétt á sjúkra- og endurhæfingargreiðslum',
      description:
        'Unfortunately, you are not eligible for medical and rehabilitation payments.',
    },
    applicantAgeOutOfRangeDescription: {
      id: 'marp.application:not.eligible.applicant.age.out.of.range.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Þú ert ekki á aldrinum 18-67 ára.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* You are not aged 18-67.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
    },
    baseCertNotFoundDescription: {
      id: 'marp.application:not.eligible.base.cert.not.found.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Ekkert grunnvottorð fannst.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* No certificate for sickness and rehabilitation found.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
    },
    baseCertDateInvalidDescription: {
      id: 'marp.application:not.eligible.base.cert.date.invalid.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Þú ert ekki með gilt grunnvottorð.\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* You do not have a valid certificate for sickness and rehabilitation.\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
    },
    baseCertOlderThanSevenYearsDescription: {
      id: 'marp.application:not.eligible.base.cert.older.than.seven.years.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Þú ert ekki með gilt grunnvottorð (má vera mest 7 ára gamalt).\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* You do not have a valid certificate for sickness and rehabilitation (issued within the last 7 years).\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
    },
    baseCertOlderThanSixMonthsDescription: {
      id: 'marp.application:not.eligible.base.cert.older.than.six.months.description#markdown',
      defaultMessage:
        'Ástæðan fyrir því er eftirfarandi:\n* Þú er ekki með gilt grunnvottorð (má vera mest 6 mánaða gamalt).\n\nEf þú telur þetta ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reason for this is the following:\n* You do not have a valid certificate for sickness and rehabilitation (issued within the last  6 months).\n\nIf you do not think the above applies to you, please contact the Social Insurance Administration at [tr@tr.is](mailto:tr@tr.is)',
    },
  }),

  generalInformation: defineMessages({
    // Income Plan - Instructions
    incomePlanInstructionsSubSectionTitle: {
      id: 'marp.application:general.information.income.plan.instructions.sub.section.title',
      defaultMessage: 'Tekjuáætlun - Leiðbeiningar',
      description: 'Income Plan - Instructions',
    },

    // Benefits from another country
    benefitsFromAnotherCountrySubSectionTitle: {
      id: 'marp.application:general.information.benefits.from.another.country.sub.section.title',
      defaultMessage: 'Greiðslur frá öðru landi',
      description: 'Benefits from another country',
    },
    benefitsFromAnotherCountryTitle: {
      id: 'marp.application:general.information.benefits.from.another.country.title',
      defaultMessage:
        'Færðu greiðslur frá öðru landi vegna heilsubrests eða óvinnufærni?',
      description:
        'Do you receive benefits from another country due to ill health or incapacity?',
    },
    benefitsFromAnotherCountryDescription: {
      id: 'marp.application:general.information.benefits.from.another.country.description',
      defaultMessage:
        'Rangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annarra viðurlaga.',
      description:
        'Incorrect or insufficient information may affect the processing of the application and possibly lead to a chargeback or other sanctions.',
    },
    countryRegistration: {
      id: 'marp.application:general.information.country.registration',
      defaultMessage: 'Skráning lands',
      description: 'Country registration',
    },
    country: {
      id: 'marp.application:general.information.country',
      defaultMessage: 'Land',
      description: 'Country',
    },
    selectCountry: {
      id: 'marp.application:general.information.select.country',
      defaultMessage: 'Veldu land',
      description: 'Select country',
    },
    countryIdNumber: {
      id: 'marp.application:general.information.country.id.number',
      defaultMessage: 'Kennitala/persónunúmer í landi',
      description: 'Country ID number/personal ID number',
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
      defaultMessage: 'Hvenær féll/fellur niður reiknað endurgjald?',
      description: 'When did/does the calculated remuneration expire?',
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
    questionsSchoolRegistration: {
      id: 'marp.application:general.information.questions.school.registration',
      defaultMessage: 'Skráning skóla',
      description: 'School registration',
    },
    questionsSchool: {
      id: 'marp.application:general.information.questions.school',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    questionsSelectSchool: {
      id: 'marp.application:general.information.questions.select.school',
      defaultMessage: 'Veldu skóla',
      description: 'Select school',
    },
    questionsNumberOfCredits: {
      id: 'marp.application:general.information.questions.number.of.credits',
      defaultMessage: 'Fjöldi eininga á núverandi önn',
      description: 'Number of ECTS credits per current semester',
    },
    questionsSelectNumberOfCredits: {
      id: 'marp.application:general.information.questions.select.number.of.credits',
      defaultMessage: 'Veldu fjölda eininga',
      description: 'Select number of credits',
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
      defaultMessage: 'Hvenær lýkur rétti þínum til veikindalauna?',
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

    // Information
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
      defaultMessage:
        'ICD greiningar sem valda megin heilsuvanda / óvinnufærni',
      description:
        'ICD analysis causing the main health issue / incapacitation',
    },
    informationOtherICDAnalysis: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.information.other.ICD.analysis',
      defaultMessage:
        'Aðrar ICD greiningar sem valda heilsuvanda / óvinnufærni',
      description: 'Other ICD analysis causing health issue / incapacitation',
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

    // Main impairment
    mainImpairment: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.main.impairment',
      defaultMessage: 'Megin vandi',
      description: 'Main impairment',
    },
    mainImpairmentExplanation: {
      id: 'marp.application:certificate.for.sickness.and.rehabilitation.main.impairment.explanation',
      defaultMessage: 'Annað varðandi megin vanda',
      description: 'Further information on main impairment',
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
    serviceProviderRehabilitationProvider: {
      id: 'marp.application:rehabilitation.plan.service.provider.rehabilitation.provider',
      defaultMessage: 'Endurhæfingaraðili',
      description: 'Rehabilitation provider',
    },

    // Information
    informationCurrentPosition: {
      id: 'marp.application:rehabilitation.plan.information.current.position',
      defaultMessage: 'Staða umsækjanda gagnvart vinnumarkaði eða námi í dag',
      description:
        'The applicant’s current position in relation to the labour market or study.',
    },
    informationProgress: {
      id: 'marp.application:rehabilitation.plan.information.progress',
      defaultMessage: 'Hver var framvinda fyrri endurhæfingartímabils?',
      description:
        'What was the progress of the previous rehabilitation period',
    },
    informationExplanationOfProgress: {
      id: 'marp.application:rehabilitation.plan.information.explanation.of.progress',
      defaultMessage:
        'Nánari útskýring á framvindu fyrri endurhæfingartímabils',
      description:
        'Further explanation of the progress of the previous rehabilitation period',
    },
    informationAttendance: {
      id: 'marp.application:rehabilitation.plan.information.attendance',
      defaultMessage:
        'Hvernig hefur umsækjandi sinnt endurhæfingarúrræðum á fyrra endurhæfingartímabili?',
      description:
        'How has the applicant’s attendance to rehabilitation measures during the previous rehabilitation period been',
    },
    informationExplanationOfAttendance: {
      id: 'marp.application:rehabilitation.plan.information.explanation.of.attendance',
      defaultMessage:
        'Nánari útskýring varðandi mætingar í endurhæfingarúrræði á fyrra tímabili',
      description:
        'Further explanation regarding attendance to rehabilitation measures during the previous rehabilitation period',
    },
    informationChange: {
      id: 'marp.application:rehabilitation.plan.information.change',
      defaultMessage:
        'Varð breyting á þeim endurhæfingarúrræðum eða stefnu sem lögð var upp með í fyrri áætlun?',
      description:
        'Was there any change to the rehabilitation measures or direction that were established in the previous plan?',
    },
    informationExplanationOfChange: {
      id: 'marp.application:rehabilitation.plan.information.explanation.of.change',
      defaultMessage: 'Nánari útskýring á þeim breytingum og ástæðum þeirra',
      description: 'Further explanation of those changes and their reasons',
    },
    informationApplicantCircumstancesChanges: {
      id: 'marp.application:rehabilitation.plan.information.applicant.circumstances.changes',
      defaultMessage:
        'Hefur orðið breyting á aðstæðum umsækjanda frá fyrra endurhæfingartímabili?',
      description:
        "Has there been a change in the applicant's situation since the previous rehabilitation period?",
    },
    informationExplanationOfApplicantCircumstancesChanges: {
      id: 'marp.application:rehabilitation.plan.information.explanation.of.applicant.circumstances.changes',
      defaultMessage:
        'Nánari útskýring á breytingum á aðstæðum umsækjanda og ástæðum þeirra',
      description:
        "Further explanation of changes in the applicant's situation and their reasons",
    },

    // Comprehensive assessment
    comprehensiveAssessment: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment',
      defaultMessage:
        'Heildrænt mat á færni umsækjanda í daglegu lífi og þátttöku',
      description:
        'A comprehensive assessment of the applicant’s skills and participation in everyday life',
    },
    comprehensiveAssessmentTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.tooltip',
      defaultMessage:
        'Lagt er mat á færniskerðingu umsækjanda og áhrif hennar á getu hans til að sinna eftirfarandi þáttum er varða virkni, þátttöku og sjálfstæði eins og staða hans er í dag með hjálpartækjum ef við á.',
      description:
        'The applicant’s current skills impairment and its impact on their ability to perform the following factors related to activity, participation and independence, with assistive devices if applicable, is assessed.',
    },
    comprehensiveAssessmentLearningAndApplyingKnowledge: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.learning.and.applying.knowledge',
      defaultMessage: 'Nám og beiting þekkingar',
      description: 'Learning and applying knowledge',
    },
    comprehensiveAssessmentGeneralTasksAndRequirements: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.general.tasks.and.requirements',
      defaultMessage: 'Almenn verkefni og kröfur',
      description: 'General tasks and requirements',
    },
    comprehensiveAssessmentGeneralTasksAndRequirementsTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.general.tasks.and.requirements.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að skipuleggja og framkvæma athafnir í daglegu lífi t.d. að stýra tíma, klára það sem byrjað er á og takast á við streitu og álag?',
      description:
        'How is the applicant at planning and performing tasks in their daily life, e.g. managing time, finishing what they started and managing stress and pressure?',
    },
    comprehensiveAssessmentCommunicationAndRelationships: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.communication.and.relationships',
      defaultMessage: 'Samskipti og tengsl',
      description: 'Communication and relationships',
    },
    comprehensiveAssessmentCommunicationAndRelationshipsTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.communication.and.relationships.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að eiga í samskiptum, byggja upp tengsl og viðhalda þeim, við fjölskyldu, vini, samstarfsfélaga eða aðra?',
      description:
        'How is the applicant at communicating, building and maintaining relationships with family, friends, collegues or others?',
    },
    comprehensiveAssessmentMobility: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.mobility',
      defaultMessage: 'Hreyfanleiki',
      description: 'Mobility',
    },
    comprehensiveAssessmentMobilityTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.mobility.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að flytja sig/fara á milli staða, t.d. við að ganga, halda jafnvægi og færa sig til?',
      description:
        'How is the applicant at moving between places, e.g. at walking, balacing and moving.',
    },
    comprehensiveAssessmentSelfCare: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.self.care',
      defaultMessage: 'Eigin umsjá / sjálfsumönnun',
      description: 'Self-care',
    },
    comprehensiveAssessmentSelfCareTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.self.care.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að sinna eigin umsjá, t.d. að þvo sér, klæða og sinna persónulegu hreinlæti?',
      description:
        'How is the applicant at performing their own self-care, e.g. washing, dressing themselves and maintaining personal hygiene.',
    },
    comprehensiveAssessmentDomesticLife: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.domestic.life',
      defaultMessage: 'Heimilislíf',
      description: 'Domestic life',
    },
    comprehensiveAssessmentDomesticLifeTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.domestic.life.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að sinna heimilislífi t.d. að elda mat og þrífa húsnæði?',
      description:
        'How is the applicant at handling household chores, e.g. cooking food and cleaning the house?',
    },
    comprehensiveAssessmentDailyLife: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.daily.life',
      defaultMessage: 'Meginsvið daglegs lífs',
      description: 'Daily life',
    },
    comprehensiveAssessmentDailyLifeTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.daily.life.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að taka þátt í námi, starfi eða öðrum verkefnum sem tengjast starfsþjálfun eða vinnu?',
      description:
        'How is the applicant at undertaking study, a job or other activities related to vocational training or work?',
    },
    comprehensiveAssessmentLeisureAndInterests: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.leisure.and.interests',
      defaultMessage: 'Frístundir og áhugamál',
      description: 'Leisure and interests',
    },
    comprehensiveAssessmentLeisureAndInterestsTooltip: {
      id: 'marp.application:rehabilitation.plan.comprehensive.assessment.leisure.and.interests.tooltip',
      defaultMessage:
        'Hvernig gengur umsækjanda að taka þátt í tómstundum, félagsstörfum eða öðrum viðburðum utan heimilis?',
      description:
        'How is the applicant at participating in leisure activities, social activities or other events outside of the home.',
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

  confirmedTreatment: defineMessages({
    sectionTitle: {
      id: 'marp.application:confirmed.treatment.section.title',
      defaultMessage: 'Staðfesting á viðurkenndri meðferð',
      description: 'Confirmation of treatment',
    },
    description: {
      id: 'marp.application:confirmed.treatment.description',
      defaultMessage:
        'Forsenda fyrir áframhaldandi greiðslum er að staðfesting á viðurkenndri meðferð.',
      description:
        'A prerequisite for ongoing payments is a confirmation of treatment.',
    },

    // Information
    informationFurtherExplanationOfPreviousTreatment: {
      id: 'marp.application:confirmed.treatment.information.further.explanation.of.previous.treatment',
      defaultMessage: 'Nánari útskýring á fyrri meðferð',
      description: 'Further explanation of previous treatment',
    },
    informationInformationRegardingTreatment: {
      id: 'marp.application:confirmed.treatment.information.information.regarding.treatment',
      defaultMessage: 'Upplýsingar um meðferð',
      description: 'Information regarding treatment',
    },
    informationTreatmentType: {
      id: 'marp.application:confirmed.treatment.information.treatment.type',
      defaultMessage: 'Tegund meðferðar',
      description: 'Treatment type',
    },
  }),

  confirmationOfPendingResolution: defineMessages({
    sectionTitle: {
      id: 'marp.application:confirmation.of.pending.resolution.section.title',
      defaultMessage: 'Staðfesting á bið eftir úrræðum',
      description: 'Confirmation of pending resolution',
    },
    description: {
      id: 'marp.application:confirmation.of.pending.resolution.description',
      defaultMessage:
        'Forsenda fyrir áframhaldandi greiðslum er að staðfesting á að bið eftir viðurkenndri meðferð eða endurhæfingu.',
      description:
        'A prerequisite for ongoing payments is a confirmation of pending treatment or rehabilitation',
    },

    // Information
    informationResources: {
      id: 'marp.application:confirmation.of.pending.resolution.information.resources',
      defaultMessage: 'Hvaða úrræði hefur verið sótt um og beðið er eftir:',
      description: 'What resources have been requested and are still awaited:',
    },
    informationPreviousResourcesUsed: {
      id: 'marp.application:confirmation.of.pending.resolution.information.previous.resources.used',
      defaultMessage: 'Fyrri úrræði sem hafa verið nýtt',
      description: 'Previous resources used',
    },
    informationFurtherExplanation: {
      id: 'marp.application:confirmation.of.pending.resolution.information.further.explanation',
      defaultMessage: 'Nánari útskýring',
      description: 'Further explanation',
    },

    // Application for medical and rehabilitation payments
    applicationStartOfWaitingList: {
      id: 'marp.application:confirmation.of.pending.resolution.application.start.of.waiting.list',
      defaultMessage: 'Hvenær var viðkomandi settur á biðlista',
      description: 'When was the individual placed on a waiting list?',
    },
    applicationEstimatedEndOfWaitPeriod: {
      id: 'marp.application:confirmation.of.pending.resolution.application.estimated.end.of.wait.period',
      defaultMessage: 'Hvenær er áætlað að bið ljúki?',
      description: 'Estimated end of wait period',
    },
    applicationEstimatedTimeOfWait: {
      id: 'marp.application:confirmation.of.pending.resolution.application.estimated.time.of.wait',
      defaultMessage: 'Áætluð tímalengd á bið',
      description: 'Estimated time of wait',
    },
  }),

  confirmationOfIllHealth: defineMessages({
    sectionTitle: {
      id: 'marp.application:confirmation.of.ill.health.section.title',
      defaultMessage: 'Staðfesting á heilsubresti',
      description: 'Confirmation of ill health',
    },
    description: {
      id: 'marp.application:confirmation.of.ill.health.description',
      defaultMessage:
        'Forsenda fyrir áframhaldandi greiðslum er staðfesting á heilsubresti sem kemur í veg fyrir að viðurkennd meðferð eða endurhæfing geti hafist.',
      description:
        'A prerequisite for ongoing payments is a confirmation of ill health that prevents the start of treatment or rehabilitation',
    },

    // Information
    informationProgress: {
      id: 'marp.application:confirmation.of.ill.health.information.progress',
      defaultMessage: 'Upplýsingar um framvindu',
      description: 'Information regarding progress',
    },

    // Application for medical and rehabilitation payments
    applicationStartOfIllHealth: {
      id: 'marp.application:confirmation.of.ill.health.application.start.of.ill.health',
      defaultMessage: 'Upphaf heilsubrests',
      description: 'Start of ill health',
    },
    applicationEstimatedEnd: {
      id: 'marp.application:confirmation.of.ill.health.application.estimated.end',
      defaultMessage: 'Áætluð lok',
      description: 'Estimated end',
    },
  }),

  selfAssessment: defineMessages({
    sectionTitle: {
      id: 'marp.application:self.assessment.section.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self-assessment',
    },

    // Questionnaire
    questionnaire: {
      id: 'marp.application:self.assessment.question.number',
      defaultMessage: 'Sjálfsmat (Spurning {index} af {total})',
      description: 'Self-assessment (Question {index} of {total})',
    },
    completeSelfAssessment: {
      id: 'marp.application:self.assessment.complete.self.assessment',
      defaultMessage: 'Ljúka sjálfsmati',
      description: 'Complete self-assessment',
    },

    // Questions One
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
    educationLevelDescription: {
      id: 'marp.application:self.assessment.education.level.description',
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

    // Questions Two
    currentEmploymentStatusTitle: {
      id: 'marp.application:self.assessment.current.employment.status.title',
      defaultMessage: 'Hver er núverandi staða þín á vinnumarkaði?',
      description: 'What is your current status in the labour market?',
    },
    furtherExplanation: {
      id: 'marp.application:self.assessment.further.explanation',
      defaultMessage: 'Frekari skýring',
      description: 'Further explanation',
    },
    lastProfessionTitle: {
      id: 'marp.application:self.assessment.last.profession.title',
      defaultMessage:
        'Skráðu núverandi eða síðasta starfsheiti og ártal þegar þú varst síðast í starfi:',
      description:
        'Enter your current or last job title and the year in which you were last employed:',
    },
    lastProfessionPlaceholder: {
      id: 'marp.application:self.assessment.last.profession.placeholder',
      defaultMessage: 'Veldu starfsheiti',
      description: 'Select job title',
    },
    lastActivityOfProfession: {
      id: 'marp.application:self.assessment.last.activity.of.profession',
      defaultMessage: 'Starfsemi starfsgreinar',
      description: 'Activity of profession',
    },
    lastActivityOfProfessionPlaceholder: {
      id: 'marp.application:self.assessment.last.activity.of.profession.placeholder',
      defaultMessage: 'Veldu starfsemi starfsgreinar',
      description: 'Select activity of profession',
    },
    lastProfessionYear: {
      id: 'marp.application:self.assessment.last.profession.year',
      defaultMessage: 'Ártal',
      description: 'Year',
    },
    lastProfessionYearPlaceholder: {
      id: 'marp.application:self.assessment.last.profession.year.placeholder',
      defaultMessage: 'Veldu ártal',
      description: 'Select year',
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
    rehabilitationPlanConfirmed: {
      id: 'marp.application:overiew.rehabilitation.plan.confirmed',
      defaultMessage: 'Þú hefur staðfest endurhæfingaráætlunina',
      description: 'You have confirmed your rehabilitation plan',
    },
    confirmedTreatmentConfirmed: {
      id: 'marp.application:overiew.confirmed.treatment.confirmed',
      defaultMessage: 'Þú hefur staðfest staðfestingu á viðurkenndri meðferð',
      description: 'You have confirmed your confirmation of treatment',
    },
    confirmationOfPendingResolutionConfirmed: {
      id: 'marp.application:overiew.confirmation.of.pending.resolution.confirmed',
      defaultMessage: 'Þú hefur staðfest staðfestingu á bið eftir úrræðum',
      description: 'You have confirmed your confirmation of pending resolution',
    },
    confirmationOfIllHealthConfirmed: {
      id: 'marp.application:overiew.confirmation.of.ill.health.confirmed',
      defaultMessage: 'Þú hefur staðfest staðfestingu á heilsubresti',
      description: 'You have confirmed your confirmation of ill health',
    },
    selfAssessmentQuestionnaire: {
      id: 'marp.application:overiew.self.assessment.questionnaire',
      defaultMessage: 'Spurningalisti vegna færniskerðingar',
      description: 'Questionnaire for skills impairment',
    },
    selfAssessmentQuestionnaireConfirmed: {
      id: 'marp.application:overiew.self.assessment.questionnaire.confirmed',
      defaultMessage: 'Þú hefur lokið við að svara spurningalista',
      description: 'You have completed answering the questionnaire',
    },
    selfAssessmentLastProfessionTitle: {
      id: 'marp.application:overiew.self.assessment.last.profession.title',
      defaultMessage: 'Núverandi eða síðasta starfsheiti',
      description: 'Current or last job title',
    },
    selfAssessmentLastProfessionYear: {
      id: 'marp.application:overiew.self.assessment.last.profession.year',
      defaultMessage: 'Ártal þegar þú varst síðast í starfi',
      description: 'Year in which you were last employed',
    },
  }),

  conclusion: defineMessages({
    title: {
      id: 'marp.application:conclusionScreen.expandableDescriptionField.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    alertTitle: {
      id: 'marp.application:conclusionScreen.expandableDescriptionField.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Your application has been received',
    },
    alertMessage: {
      id: 'marp.application:conclusionScreen.expandableDescriptionField.alertMessage',
      defaultMessage:
        'Umsókn um sjúkra- og endurhæfingargreiðslur hefur verið send til Tryggingastofnunar',
      description:
        'Your application for medical and rehabilitation payments has been sent to the Social Insurance Administration',
    },
    next: {
      id: 'marp.application:conclusionScreen.expandableDescriptionField.next#markdown',
      defaultMessage:
        '* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til sjúkra- og endurhæfingargreiðslna. Vinnslutími umsókna um sjúkra- og endurhæfingargreiðslur er fjórar til sex vikur.',
      description:
        '* The Social Insurance Administration will review your application and confirm that all information provided is accurate.\n* If required, they will call for additional information/documents.\n* Once all necessary documents have been received, the Social Insurance Administration will review the application and determine whether medical and rehabilitation payments will be granted. The processing time for medical and rehabilitation payments applications is four to six weeks.',
    },
    entitlements: {
      id: 'marp.application:conclusionScreen.entitlements#markdown',
      defaultMessage:
        '# **Þú gætir átt rétt á:**\n\n Tryggingastofnun vekur athygli þína á að því þú gætir átt rétt á öðrum greiðslum samhliða sjúkra- og endurhæfingargreiðslum, svo sem:\n* Heimilisuppbót\n* Barnalífeyri\n* Greiðslum vegna bifreiðakostnaðar\n\nTryggingastofnun hvetur þig til að sækja um þessar greiðslur teljir þú þig eiga rétt á þeim. Hægt er að finna umsóknirnar á Mínum síðum á tr.is. Innskráning  á Mínar síður fer fram með rafrænum skilríkjum.\n\n Ef þú hefur spurningar eða athugasemdir er ávallt hægt að hafa samband í síma 560 4400 eða senda fyrirspurn í gegnum Mínar síður á tr.is.',
      description:
        '# **You may be entitled to:**\n\nThe Social Insurance Administration would like to point out that you may be entitled to other payments along side the medical and rehabilitation payments, such as:\n* Household supplement\n* Child pension\n* Payments for car expenses\n\nThe Social Insurance Administration encourages you to apply for these payments if you think you may be entitled to them. You can find these applications on My Pages at the Social Insurance Administration. Login to My Pages is done using electronic ID.\n\nIf you have any questions or comments please contact us via telephone at 560 4400 or send an enquiry through My Pages at tr.is.',
    },
  }),
}

export const errorMessages = defineMessages({
  dateRequired: {
    id: 'marp.application:error.date.required',
    defaultMessage: 'Það þarf að velja dagsetningu',
    description: 'You must select a date',
  },
  countriesRequired: {
    id: 'marp.application:error.countries.required',
    defaultMessage: 'Það þarf að skrá að minnsta kosti eitt land',
    description: 'You must add at least one country',
  },
  countryRequired: {
    id: 'marp.application:error.country.required',
    defaultMessage: 'Það þarf að velja land',
    description: 'You must select a country',
  },
  countryIdNumberRequired: {
    id: 'marp.application:error.country.id.number.required',
    defaultMessage: 'Kennitala/persónunúmer í landi þarf að vera gilt',
    description: 'Country ID number/personal ID number must be valid',
  },
  countryIdNumberMin: {
    id: 'marp.application:error.country.id.number.min',
    defaultMessage:
      'Kennitala/persónunúmer í landi þarf að vera að minnsta kosti 5 stafir eða tákn',
    description:
      'Country ID number/personal ID number must be at least 5 characters or symbols',
  },
  selfAssessmentQuestionnaireRequired: {
    id: 'marp.application:error.self.assessment.questionnaire.required',
    defaultMessage: 'Þú átt eftir að fylla út í reit á þessari síðu',
    description: 'You have to fill in a field on this page.',
  },
})

export const statesMessages = defineMessages({
  applicationSubmittedDescription: {
    id: 'marp.application:applicationSubmittedDescription',
    defaultMessage: 'Umsókn þín hefur verið send til Tryggingastofnunar',
    description:
      'Your application has been submitted to the Social Insurance Administration',
  },
  applicationApprovedDescription: {
    id: 'marp.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna sjúkra- og endurhæfingargreiðslna hefur verið samþykkt',
    description:
      'The application for medical and rehabilitation payments has been approved',
  },
  applicationDismissed: {
    id: 'marp.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um sjúkra- og endurhæfingargreiðslur frá',
    description:
      'Tryggingastofnun has dismissed your application for medical and rehabilitation payments',
  },
  applicationDismissedDescription: {
    id: 'marp.application:application.dismissed.description',
    defaultMessage:
      'Umsókn þinni um sjúkra- og endurhæfingargreiðslur hefur verið vísað frá',
    description:
      'Your application for medical and rehabilitation payments has been dismissed',
  },
  applicationRejectedDescription: {
    id: 'marp.application:applicationRejectedDescription',
    defaultMessage:
      'Umsókn um sjúkra- og endurhæfingargreiðslur hefur verið synjað',
    description:
      'The application for medical and rehabiliation payments has been rejected',
  },
})
