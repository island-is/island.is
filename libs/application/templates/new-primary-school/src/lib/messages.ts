import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const newPrimarySchoolMessages: MessageDir = {
  // Messages shared across the New Primary School application templates
  shared: defineMessages({
    applicationName: {
      id: 'nps.application:application.name',
      defaultMessage: 'Umsókn í grunnskóla',
      description: 'Application for primary school',
    },
    enrollmentApplicationName: {
      id: 'nps.application:enrollment.application.name',
      defaultMessage: 'Innritun í 1. bekk',
      description: 'Enrollment in 1st grade',
    },
    newPrimarySchoolApplicationName: {
      id: 'nps.application:new.primary.school.application.name',
      defaultMessage: 'Umsókn um skólaskipti',
      description: 'Application for school transfer',
    },
    continuingEnrollmentApplicationName: {
      id: 'nps.application:continuing.enrollment.application.name',
      defaultMessage: 'Umsókn um áframhaldandi skólavist',
      description: 'Application for continuing enrollment',
    },
    institution: {
      id: 'nps.application:institution.name',
      defaultMessage: 'Sveitarfélög',
      description: 'Municipalities',
    },
    formTitle: {
      id: 'nps.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    alertTitle: {
      id: 'nps.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    yes: {
      id: 'nps.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'nps.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    date: {
      id: 'nps.application:date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    datePlaceholder: {
      id: 'nps.application:date.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    fullName: {
      id: 'nps.application:full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'nps.application:nationalId',
      defaultMessage: 'Kennitala',
      description: 'National id',
    },
    email: {
      id: 'nps.application:email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    municipality: {
      id: 'nps.application:municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    municipalityPlaceholder: {
      id: 'nps.application:municipality.placeholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Select municipality',
    },
    postalCode: {
      id: 'nps.application:postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    address: {
      id: 'nps.application:address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    phoneNumber: {
      id: 'nps.application:phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    relation: {
      id: 'nps.application:relation',
      defaultMessage: 'Tengsl',
      description: 'Relation',
    },
    relationPlaceholder: {
      id: 'nps.application:relation.placeholder',
      defaultMessage: 'Veldu tengsl',
      description: 'Select relation',
    },
    school: {
      id: 'nps.application:school',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    schoolPlaceholder: {
      id: 'nps.application:school.placeholder',
      defaultMessage: 'Veldu skóla',
      description: 'Select school',
    },
    gender: {
      id: 'nps.application:gender',
      defaultMessage: 'Kyn',
      description: 'Gender',
    },
    male: {
      id: 'nps.application:gender.male',
      defaultMessage: 'Karlkyns',
      description: 'Male',
    },
    female: {
      id: 'nps.application:gender.female',
      defaultMessage: 'Kvenkyns',
      description: 'Female',
    },
    otherGender: {
      id: 'nps.application:gender.other',
      defaultMessage: 'Kynsegin/Annað',
      description: 'non-binary/Other',
    },
    language: {
      id: 'nps.application:language',
      defaultMessage: 'Tungumál',
      description: 'Language',
    },
    languagePlaceholder: {
      id: 'nps.application:language.placeholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Choose language',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'nps.application:external.data.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },

    // Data collection
    externalDataSubSection: {
      id: 'nps.application:external.data.sub.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'nps.application:external.data.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    nationalRegistryInformationTitle: {
      id: 'nps.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'nps.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'Information about you, spouse and children.',
    },
    userProfileInformationTitle: {
      id: 'nps.application:prerequisites.userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'nps.application:prerequisites.userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    childInformationTitle: {
      id: 'nps.application:prerequisites.child.information.title',
      defaultMessage: 'Upplýsingar frá Miðstöð menntunar og skólaþjónustu',
      description:
        'Information from the Directorate of Education and School Services',
    },
    childInformationSubTitle: {
      id: 'nps.application:prerequisites.child.information.subtitle',
      defaultMessage: 'Upplýsingar um barn og ólíkar þarfir þess.',
      description: 'Information about the child and their different needs.',
    },
    checkboxProvider: {
      id: 'nps.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    startApplication: {
      id: 'nps.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },

    // Children
    childrenSubSectionTitle: {
      id: 'nps.application:prerequisites.children.sub.section.title',
      defaultMessage: 'Börn',
      description: 'Children',
    },
    childrenDescription: {
      id: 'nps.application:prerequisites.childrenDescription#markdown',
      defaultMessage: `Samkvæmt uppflettingu í Þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef þú sérð ekki barnið þitt hér, þá bendum við þér að hafa samband við Þjóðskrá. \n\nAthugaðu að einungis er hægt að sækja um fyrir eitt barn í einu. Ef skrá á tvö börn svo sem tvíbura er hægt að fara beint í að skrá annað barn þegar búið er að skrá það fyrra.`,
      description: `According to Registers Iceland, you have custody of the following child/children. If you do not see your child here, please contact Registers Iceland. \n\nPlease note that you can only apply for one child at a time. If you want to register two children, such as twins, you can proceed to register the second child directly after completing the registration for the first one.`,
    },
    childrenRadioTitle: {
      id: 'nps.application:prerequisites.childrenRadioTitle',
      defaultMessage: 'Veldu barn fyrir umsóknina',
      description: 'Select child for the application',
    },
  }),

  applicationType: defineMessages({
    sectionTitle: {
      id: 'nps.application:application.type.section.title',
      defaultMessage: 'Tegund umsóknar',
      description: 'Application type',
    },
    schoolTransferSubLabel: {
      id: 'nps.application:application.type.school.transfer.sub.label',
      defaultMessage:
        'Sé barnið þitt skráð í skóla getur þú óskað eftir að það verði skráð í annan skóla í því sveitarfélagi þar sem þú býrð. Þú getur einnig sótt um að barnið þitt fari í skóla í öðru sveitarfélagi eða í sjálfstætt starfandi skóla. Almennt gildir að í sveitarfélögum er val um grunnskóla en ef takmarka þarf fjölda nemenda í einstaka skólum eiga nemendur áfram rétt á skólavist í þeim skóla sem þeir þegar eru skráðir í.',
      description:
        'If your child is already registered in a school, you can request a transfer to another school within your municipality. You can also apply for your child to attend a school in another municipality or an independent school. In general, families can choose between primary schools within the municipality. In general, municipalities offer a choice of primary schools. However, if it becomes necessary to limit the number of students in certain schools, students still retain the right to continue their schooling at the school where they are already enrolled.',
    },
    continuingEnrollmentSubLabel: {
      id: 'nps.application:application.type.continuing.enrollment.sub.label',
      defaultMessage:
        'Sé barnið þitt þegar skráð í skóla utan þess sveitarfélags þar sem það á lögheimili eða í sjálfstætt starfandi skóla, þá þarf foreldri að óska eftir áframhaldandi skólavist á hverju ári, með endurnýjun umsóknar.',
      description:
        'If your child is already enrolled in a school outside the municipality where they are legally registered, or in an independent school, the parent must request continuing enrollment each year by submitting a renewed application.',
    },
  }),

  childrenNGuardians: defineMessages({
    sectionTitle: {
      id: 'nps.application:childrenNGuardians.section.title',
      defaultMessage: 'Börn og forsjáraðilar',
      description: 'Children and guardians',
    },

    // Child information
    childInfoSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.child.info.sub.section.title',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    childInfoDescription: {
      id: 'nps.application:childrenNGuardians.child.info.description',
      defaultMessage:
        'Upplýsingar um barn eru sóttar í Þjóðskrá. Athugaðu hvort upplýsingarnar séu réttar áður en þú heldur áfram.',
      description:
        'Information about the child is retrieved from the National Registry. Check that the information is correct before proceeding.',
    },
    childInfoPreferredName: {
      id: 'nps.application:childrenNGuardians.child.info.preferred.name',
      defaultMessage: 'Valið nafn',
      description: 'Preferred name',
    },
    childInfoPronouns: {
      id: 'nps.application:childrenNGuardians.child.info.pronouns',
      defaultMessage: 'Valið persónufornafn',
      description: 'Preferred personal pronoun',
    },
    childInfoPronounsPlaceholder: {
      id: 'nps.application:childrenNGuardians.child.info.pronouns.placeholder',
      defaultMessage: 'Veldu persónufornafn',
      description: 'Select a personal pronoun',
    },
    usePronounAndPreferredName: {
      id: 'nps.application:childrenNGuardians.child.info.use.pronoun.and.preferred.name',
      defaultMessage:
        'Barnið kýs að vera ávarpað með öðru nafni og/eða persónufornafni en hann eða hún',
      description:
        'The child prefers to be addressed by a name and/or personal pronoun other than he or she',
    },
    preferredNameTooltip: {
      id: 'nps.application:childrenNGuardians.child.info.preferred.name.tooltip',
      defaultMessage:
        'Forsjáraðilar geta óskað eftir breytingu á skráðu kyni og nafni barns hjá Þjóðskrá eða barnið sjálft sé það orðið 15 ára. Ef sú breyting er ótímabært má breyta nafni barnsins hér og skrá það nafn sem barn hefur valið sér.',
      description:
        "Guardians can request a change to a child's registered gender and name with the National Registry, or the child themselves if they have reached the age of 15. If the change is premature, the child's name can be changed here and the name the child has chosen can be registered.",
    },

    // Guardians
    guardiansSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.guardians.sub.section.title',
      defaultMessage: 'Forsjáraðilar',
      description: 'Guardians',
    },
    otherGuardian: {
      id: 'nps.application:childrenNGuardians.otherGuardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 2',
      description: 'Information about guardian 2',
    },
    guardian: {
      id: 'nps.application:childrenNGuardians.guardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 1',
      description: 'Information about guardian 1',
    },
    guardiansDescription: {
      id: 'nps.application:childrenNGuardians.guardians.description',
      defaultMessage:
        'Upplýsingar um forsjáraðila eru sóttar úr Þjóðskrá og af Mínum síðum á Ísland.is. Athugaðu hvort símanúmer og netföng séu rétt skráð áður en þú heldur áfram.',
      description:
        'Information about guardians is retrieved from Registers Iceland and from My Pages on Ísland.is. Check that phone numbers and email addresses are entered correctly before proceeding.',
    },
    requiresInterpreter: {
      id: 'nps.application:childrenNGuardians.requires.interpreter',
      defaultMessage: 'Þarf forsjáraðili túlk?',
      description: 'Does the guardian need an interpreter?',
    },

    // Relatives
    relativesSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.relatives.sub.section.title',
      defaultMessage: 'Aðstandendur',
      description: 'Relatives',
    },
    relativesTitle: {
      id: 'nps.application:childrenNGuardians.relatives.title',
      defaultMessage: 'Aðstandendur barns',
      description: "The child's relatives",
    },
    relativesDescription: {
      id: 'nps.application:childrenNGuardians.relatives.description',
      defaultMessage:
        'Aðstandandi er aðili sem er náinn fjölskyldunni og barni og veitir stuðning þegar svo ber við. Skráðu að minnsta kosti einn aðstandanda sem má hafa samband við ef ekki næst í forsjáraðila barnsins. Þú getur bætt allt að fjórum aðilum. Vinsamlegast látið aðstandendur vita af skráningunni.',
      description:
        "A relative is a person who is close to the family and child and provides support when needed. Register at least one relative who can be contacted if the child's guardian cannot be reached. You can add up to four people. Please notify the relatives of the registration.",
    },
    relativesRegistrationTitle: {
      id: 'nps.application:childrenNGuardians.relatives.registration.title',
      defaultMessage: 'Skráning aðstandanda',
      description: 'Registration of a relative',
    },
    relativesAddRelative: {
      id: 'nps.application:childrenNGuardians.relatives.add.relative',
      defaultMessage: 'Bæta við aðstandanda',
      description: 'Add a relative',
    },
    relativesRegisterRelative: {
      id: 'nps.application:childrenNGuardians.relatives.register.relative',
      defaultMessage: 'Skrá aðstandanda',
      description: 'Register relative',
    },
    relativesDeleteRelative: {
      id: 'nps.application:childrenNGuardians.relatives.delete.relative',
      defaultMessage: 'Eyða aðstandanda',
      description: 'Remove relative',
    },
    relativesEditRelative: {
      id: 'nps.application:childrenNGuardians.relatives.edit.relative',
      defaultMessage: 'Breyta aðstandanda',
      description: 'Edit relative',
    },
  }),

  primarySchool: defineMessages({
    sectionTitle: {
      id: 'nps.application:primary.school.section.title',
      defaultMessage: 'Grunnskóli',
      description: 'Primary school',
    },

    // Reason for application
    reasonForApplicationSubSectionTitle: {
      id: 'nps.application:primary.school.reason.for.application.sub.section.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    reasonForApplicationDescription: {
      id: 'nps.application:primary.school.reason.for.application.description',
      defaultMessage:
        'Til að aðstoða okkur við að mæta þörfum fjölskyldunnar biðjum við þig að velja þá ástæðu sem best á við í þínu tilfelli.',
      description:
        'To help us meet the needs of your family, please select the reason that is most appropriate in your case.',
    },
    reasonForApplicationEnrollmentDescription: {
      id: 'nps.application:primary.school.reason.for.application.enrollment.description',
      defaultMessage:
        'Barn á alltaf rétt á skólavist í sínum hverfisskóla. Séu ástæður umsóknar aðrar en flutningur lögheimilis getur verið að skólinn sjái sér ekki fært að taka á móti barninu. Það fer eftir aðstæðum í skólanum hverju sinni, svo sem rými.',
      description:
        'A child always has the right to attend school in his district school. If the reasons for the application are other than a change of legal residence, the school may not be able to accept the child. It depends on the situation in the school each time, such as space.',
    },
    reasonForApplicationPlaceholder: {
      id: 'nps.application:primary.school.reason.for.application.placeholder',
      defaultMessage: 'Veldu ástæðu',
      description: 'Select reason',
    },

    // Counselling regarding application
    counsellingRegardingApplicationSubSectionTitle: {
      id: 'nps.application:primary.school.counselling.regarding.application.sub.section.title',
      defaultMessage: 'Ráðgjöf vegna umsóknar',
      description: 'Counselling regarding application',
    },
    counsellingRegardingApplicationDescription: {
      id: 'nps.application:primary.school.counselling.regarding.application.description',
      defaultMessage:
        'Stuðningsteymi eða eftir atvikum þjónustuteymi barns hefur það hlutverk að útfæra og skipuleggja þjónustu við barn og hafa samráð við forsjáraðila og barn um samfellu hennar og gæði. Vinsamlegast tilgreindu hvaðan þú sóttir ráðgjöf um þetta úrræði.',
      description:
        'The support team or, depending on the circumstances, the child’s service team has the task of implementing and organising services for the child and consulting with the guardians and the child regarding its continuity and quality. Please indicate where you received counselling on this resource.',
    },
    counsellingRegardingApplicationPlaceholder: {
      id: 'nps.application:primary.school.counselling.regarding.application.placeholder',
      defaultMessage: 'Veldu ráðgjöf',
      description: 'Choose counselling type',
    },
    counsellingRegardingApplicationHasVisitedSchool: {
      id: 'nps.application:primary.school.counselling.regarding.application.has.visited.school',
      defaultMessage:
        'Hefurðu heimsótt og kynnt þér starfsemi þess skóla sem þú sækir um?',
      description:
        'Have you visited and familiarised yourself with the operation of the school you are applying for?',
    },

    // Siblings
    siblingsSubSectionTitle: {
      id: 'nps.application:primary.school.siblings.sub.section.title',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    siblingsTitle: {
      id: 'nps.application:primary.school.siblings.title',
      defaultMessage: 'Systkini í sama grunnskóla',
      description: 'Siblings in the same primary school',
    },
    siblingsRegistrationTitle: {
      id: 'nps.application:primary.school.siblings.registration.title',
      defaultMessage: 'Skráning systkinis',
      description: 'Registration of a sibling',
    },
    siblingsAddRelative: {
      id: 'nps.application:primary.school.siblings.add.relative',
      defaultMessage: 'Bæta við systkini',
      description: 'Add a sibling',
    },
    siblingsRegisterRelative: {
      id: 'nps.application:primary.school.siblings.register.relative',
      defaultMessage: 'Skrá systkini',
      description: 'Register sibling',
    },
    siblingsDeleteRelative: {
      id: 'nps.application:primary.school.siblings.delete.relative',
      defaultMessage: 'Eyða systkini',
      description: 'Remove sibling',
    },

    // Current school
    currentSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.current.school.sub.section.title',
      defaultMessage: 'Upplýsingar um núverandi skóla',
      description: 'Information about current school',
    },
    currentSchool: {
      id: 'nps.application:primary.school.current.school',
      defaultMessage: 'Núverandi skóli',
      description: 'Current school',
    },
    grade: {
      id: 'nps.application:primary.school.grade',
      defaultMessage: 'Bekkur',
      description: 'Grade',
    },
    currentGrade: {
      id: 'nps.application:primary.school.current.grade',
      defaultMessage: '{grade}. bekkur',
      description: '{grade} grade',
    },

    // Current nursery
    currentNurserySubSectionTitle: {
      id: 'nps.application:primary.school.current.nursery.sub.section.title',
      defaultMessage: 'Upplýsingar um núverandi leikskóla',
      description: 'Information about current nursery',
    },
    nursery: {
      id: 'nps.application:primary.school.nursery',
      defaultMessage: 'Leikskóli',
      description: 'Nursery',
    },
    nurseryPlaceholder: {
      id: 'nps.application:primary.school.nursery.placeholder',
      defaultMessage: 'Veldu leikskóla',
      description: 'Select nursery',
    },

    // School page
    schoolSubSectionTitle: {
      id: 'nps.application:primary.school.school.sub.section.title',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    schoolSubSectionDescription: {
      id: 'nps.application:primary.school.school.sub.section.description',
      defaultMessage:
        'Börn eiga rétt á skólavist í því sveitarfélagi þar sem þau eru með skráð lögheimili. Langflest sveitarfélög úthluta barni skólavist í hverfisskóla eða sem næst þeirra heimili. Eftir sem áður er það réttur forsjáraðila að sækja um annan skóla fyrir barnið sitt, hvort sem er innan sveitarfélagsins, utan þess eða í sjálfstætt starfandi skóla. Ekki er þó víst að sá skóli geti tekið á móti barninu og fer það eftir þeim reglum sem sveitarfélagið setur og aðstæðum í nýjum skóla hverju sinni.',
      description:
        'Children have the right to attend school in the municipality where they are registered as legal residents. Most municipalities assign children to their district school or the one closest to their home. However, it is the right of the guardian to apply for another school for their child, whether within the municipality, outside it, or in an independent school. However, it is not certain that the school will be able to accept the child, and this depends on the rules set by the municipality and the circumstances in the new school each time.',
    },
    schoolApplyForPreferredSchoolLabel: {
      id: 'nps.application:primary.school.school.apply.for.preferred.school.label',
      defaultMessage: 'Staðfesta innritun í hverfisskóla',
      description: 'Confirm enrollment in the neighbourhood school',
    },
    schoolApplyForPreferredSchoolSubLabel: {
      id: 'nps.application:primary.school.school.apply.for.preferred.school.sub.label',
      defaultMessage: 'Hverfisskólinn ykkar er: {preferredSchoolName}',
      description: 'Your neighbourhood school is: {preferredSchoolName}',
    },
    schoolApplyForOtherSchoolLabel: {
      id: 'nps.application:primary.school.school.apply.for.other.school.label',
      defaultMessage: 'Hafna innritun í hverfisskóla',
      description: 'Decline enrollment in the neighbourhood school',
    },
    schoolApplyForOtherSchoolSubLabel: {
      id: 'nps.application:primary.school.school.apply.for.other.school.sub.label',
      defaultMessage:
        'Ef forsjáraðili velur að hafna innritun í hverfisskóla þá býðst honum sjálfkrafa sá möguleiki að sækja um annan skóla fyrir barnið sitt.',
      description:
        'If the guardian chooses to decline enrollment in the neighbourhood school, they are automatically offered the option to apply for another school for their child.',
    },

    // Apply to a new school
    newSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.new.school.sub.section.title',
      defaultMessage: 'Nýr skóli',
      description: 'New school',
    },
    newSchoolAlertMessage: {
      id: 'nps.application:primary.school.new.school.alert.message',
      defaultMessage:
        'Einungis þau börn sem stundað hafa skipulagðar íþróttaæfingar með þjálfara hjá íþróttafélagi síðastliðið ár, eiga kost á því að vera teknir inn á afreksíþróttabraut. Ef þú telur að barnið þitt uppfylli ekki þau skilyrði mælum við með því að skrá barnið þitt á akademíubraut.',
      description:
        'Only children who have participated in organised sports training with a coach at a sports club in the past year are eligible to be admitted to the elite sports course. If you believe that your child does not meet these criteria, we recommend registering your child for the academy course.',
    },
    newSchoolSpecialSchoolOrDepartmentAlertMessage: {
      id: 'nps.application:primary.school.new.school.special.school.or.department.alert.message',
      defaultMessage:
        'Þú hefur valið að sækja um sérúrræði fyrir barnið þitt. Sérúrræði eru fyrir börn með metnar sérþarfir sem talið er að ekki sé hægt að mæta með almennu námi í grunnskóla, hvort sem er með stuðningi í kennslustund eða sérkennslu.',
      description:
        'You have chosen to apply for special resources for your child. Special resources are for children with assessed special needs who are considered to be unable to attend general education in primary school, whether with support in the classroom or special education.',
    },
    alternativeSpecialEducationDepartmentTitle: {
      id: 'nps.application:primary.school.new.school.alternative.special.education.department.title',
      defaultMessage: 'Annað val',
      description: 'Second choice',
    },
    alternativeSpecialEducationDepartmentDescription: {
      id: 'nps.application:primary.school.new.school.alternative.special.education.department.description',
      defaultMessage:
        'Athugið að ekki er víst að hægt sé að verða við ósk foreldra um val á sérdeild. Fer það fer eftir fjölda lausra plássa, fjölda umsókna og aðstæðum í deildinni hverju sinni. Biðjum við þig því að merkja við aðra sérdeild sem kemur til greina fyrir barnið þitt.',
      description:
        'Please note, it may not be possible to comply with the parents’ wishes regarding their choice of special education department. This depends on the number of available places, the number of applications and the situation at the department at any given time. We therefore ask that you select an alternative special education department that is appropriate for your child.',
    },
    alternativeSpecialEducationDepartment: {
      id: 'nps.application:primary.school.new.school.alternative.special.education.department',
      defaultMessage: 'Sérdeild {index}',
      description: 'Special education department {index}',
    },
    alternativeSpecialEducationDepartmentPlaceholder: {
      id: 'nps.application:primary.school.new.school.alternative.special.education.department.placeholder',
      defaultMessage: 'Veldu sérdeild',
      description: 'Choose special education department',
    },
    addAlternativeSpecialEducationDepartmentButton: {
      id: 'nps.application:primary.school.new.school.add.alternative.special.education.department.button',
      defaultMessage: 'Bæta við sérdeild',
      description: 'Add special education department',
    },
    removeAlternativeSpecialEducationDepartmentButton: {
      id: 'nps.application:primary.school.new.school.remove.alternative.special.education.department.button',
      defaultMessage: 'Fjarlægja sérdeild',
      description: 'Remove special education department',
    },

    // Starting school
    startingSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.starting.school.sub.section.title',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
    },
    startingSchoolTitle: {
      id: 'nps.application:primary.school.starting.school.title',
      defaultMessage: 'Hvenær óskar þú eftir að barnið byrji í nýjum skóla?',
      description: 'When do you wish the child to start in a new school?',
    },
    startingSchoolDescription: {
      id: 'nps.application:primary.school.starting.school.description',
      defaultMessage:
        'Við viljum taka vel á móti skólabarninu. Til þess að getað undirbúið komu þess þá biðjum við þig að velja dagsetningu fyrir fyrsta skóladaginn.',
      description:
        'We want to properly welcome your child to the school. To prepare for their arrival, please select a date for the first school day.',
    },
    expectedStartDateTitle: {
      id: 'nps.application:primary.school.expected.start.date.title',
      defaultMessage: 'Áætlaður upphafsdagur',
      description: 'Expected start date',
    },
    expectedStartDatePlaceholder: {
      id: 'nps.application:primary.school.expected.start.date.placeholder',
      defaultMessage: 'Veldu áætlaðan upphafsdag',
      description: 'Select expected start date',
    },
    expectedEndDateDescription: {
      id: 'nps.application:primary.school.expected.end.date.description',
      defaultMessage: 'Vinsamlegast skráið áætlaðan lokadag',
      description: 'Please provide an expected end date',
    },
    expectedEndDateTitle: {
      id: 'nps.application:primary.school.expected.end.date.title',
      defaultMessage: 'Áætlaður lokadagur',
      description: 'Expected end date',
    },
    expectedEndDatePlaceholder: {
      id: 'nps.application:primary.school.expected.end.date.placeholder',
      defaultMessage: 'Veldu áætlaðan lokadag',
      description: 'Select expected end date',
    },
    temporaryStay: {
      id: 'nps.application:primary.school.temporary.stay',
      defaultMessage: 'Er skóladvölin tímabundin?',
      description: 'Is the school stay temporary?',
    },
  }),

  differentNeeds: defineMessages({
    sectionTitle: {
      id: 'nps.application:different.needs.section.title',
      defaultMessage: 'Ólíkar þarfir',
      description: 'Different needs',
    },

    // Language
    languageTitle: {
      id: 'nps.application:different.needs.language.title',
      defaultMessage: 'Tungumál barnsins',
      description: "The child's languages",
    },
    languageDescription: {
      id: 'nps.application:different.needs.language.description',
      defaultMessage:
        'Til að hægt sé að koma til móts við þarfir barnsins þarf skólinn að vita hvaða tungumál eru töluð í nærumhverfi þess. Veldu þau tungumál, eitt eða fleiri sem töluð eru dagsdaglega á heimilinu í samskiptum við eða í kringum barn.',
      description:
        "In order to meet the child's needs, the school needs to know what languages are spoken in its surroundings. Select one or more languages that are spoken daily in the home when communicating with or around a child.",
    },
    languageSubTitle: {
      id: 'nps.application:different.needs.language.sub.title',
      defaultMessage:
        'Hvað á best við í tilfelli barnsins og tungumála sem notuð eru í daglegu lífi fjölskyldunnar?',
      description:
        "What best describes the child's daily language environment?",
    },
    languageEnvironmentTitle: {
      id: 'nps.application:different.needs.language.environment.title',
      defaultMessage: 'Tungumálaumhverfi',
      description: 'Language environment',
    },
    languageEnvironmentPlaceholder: {
      id: 'nps.application:different.needs.language.environment.placeholder',
      defaultMessage: 'Veldu það sem best á við',
      description: 'Choose the most appropriate',
    },
    onlyIcelandicOption: {
      id: 'nps.application:different.needs.language.only.icelandic.option',
      defaultMessage: 'Aðeins töluð íslenska',
      description: 'Only Icelandic spoken',
    },
    icelandicAndForeignOption: {
      id: 'nps.application:different.needs.language.icelandic.and.foreign.option',
      defaultMessage: 'Töluð íslenska og annað/önnur tungumál',
      description: 'Icelandic and one or more languages spoken',
    },
    onlyForeignOption: {
      id: 'nps.application:different.needs.language.only.foreign.option',
      defaultMessage: 'Aðeins töluð önnur tungumál en íslenska',
      description: 'Only languages other than Icelandic spoken',
    },
    languagesDescription: {
      id: 'nps.application:different.needs.languages.description',
      defaultMessage:
        'Raðaðu tungumálunum eftir því hvaða tungumál er mest er notað. Það sem er mest notað er nr. 1 og svo koll af kolli.',
      description:
        'Arrange the languages according to which language is most frequently used. What is most used is number 1 and so on.',
    },
    languageSelectionTitle: {
      id: 'nps.application:different.needs.language.selection.title',
      defaultMessage: 'Tungumál {index}',
      description: 'Language {index}',
    },
    addLanguageButton: {
      id: 'nps.application:different.needs.language.add.button',
      defaultMessage: 'Bæta við tungumáli',
      description: 'Add language',
    },
    removeLanguageButton: {
      id: 'nps.application:different.needs.language.remove.button',
      defaultMessage: 'Fjarlægja tungumál',
      description: 'Remove language',
    },
    preferredLanguageTitle: {
      id: 'nps.application:different.needs.preferred.language.title',
      defaultMessage:
        'Á hvaða tungumáli sem þú hefur valið, finnst barninu sjálfu best að tjá sig á?',
      description:
        'Of the chosen languages, in which language does your child feel most comfortable expressing themselves?',
    },
    signLanguage: {
      id: 'nps.application:different.needs.sign.language',
      defaultMessage: 'Notar barnið táknmál?',
      description: 'Does the child use sign language?',
    },

    // Health protection
    healthProtectionSubSectionTitle: {
      id: 'nps.application:different.needs.health.protection.sub.section.title',
      defaultMessage: 'Heilsuvernd',
      description: 'Health protection',
    },
    healthProtectionSubSectionDescription: {
      id: 'nps.application:different.needs.health.protection.sub.section.description',
      defaultMessage:
        'Heilsuvernd skólabarna er hluti af heilsugæslunni og framhald af ung- og smábarnavernd. Til að skólahjúkrunarfræðingur geti sinnt heilsuvernd skólabarns, haft umsjón með umönnun þess þegar svo ber við og veitt starfsfólki skólans viðeigandi fræðslu og ráðgjöf um rétt viðbrögð, er mikilvægt að hann hafi nauðsynlegar upplýsingar um heilsu barnsins.',
      description:
        'Health protection for school children is part of the healthcare system and follows from child health care. For the school nurse to be able to provide health protection for the school child, manage their care when needed, and provide appropriate education and advice to school staff on the right responses, it is important that they have necessary information about the childs health.',
    },
    allergiesAndIntolerances: {
      id: 'nps.application:different.needs.health.protection.allergies.and.intolerances',
      defaultMessage:
        'Er barnið með ofnæmi eða óþol sem starfsfólk skóla þarf að vera meðvitað um?',
      description:
        'Does the child have any allergies or intolerances that school staff need to be aware of?',
    },
    hasFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.health.protection.has.food.allergies.or.intolerances',
      defaultMessage: 'Barnið er með fæðuofnæmi eða -óþol',
      description: 'The child has food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.health.protection.type.of.food.allergies.or.intolerances',
      defaultMessage: 'Tegund fæðuofnæmis eða -óþols',
      description: 'Type of food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerancesPlaceholder: {
      id: 'nps.application:different.needs.health.protection.type.of.food.allergies.or.intolerances.placeholder',
      defaultMessage: 'Veldu tegund fæðuofnæmis eða -óþols',
      description: 'Select type of food allergies or intolerances',
    },
    hasOtherAllergies: {
      id: 'nps.application:different.needs.health.protection.has.other.allergies',
      defaultMessage: 'Barnið er með annað ofnæmi',
      description: 'The child has other allergies',
    },
    typeOfOtherAllergies: {
      id: 'nps.application:different.needs.health.protection.type.of.other.allergies',
      defaultMessage: 'Tegund ofnæmis',
      description: 'Type of allergies',
    },
    typeOfOtherAllergiesPlaceholder: {
      id: 'nps.application:different.needs.health.protection.type.of.other.allergies.placeholder',
      defaultMessage: 'Veldu tegund ofnæmis',
      description: 'Select type of allergies',
    },
    allergiesCertificateAlertMessage: {
      id: 'nps.application:different.needs.health.protection.allergies.certificate.alert.message',
      defaultMessage:
        'Athugið að skóli getur óskað eftir vottorði til staðfestingar á ofnæmi.',
      description:
        'Please note that the school may request a certificate to confirm allergies.',
    },
    usesEpiPen: {
      id: 'nps.application:different.needs.health.protection.uses.epi.pen',
      defaultMessage:
        'Þarf barnið að hafa tiltækan adrenalínpenna (epi-pen) vegna ofnæmis?',
      description:
        'Does the child need to have an epi-pen available for allergies?',
    },
    hasConfirmedMedicalDiagnoses: {
      id: 'nps.application:different.needs.health.protection.has.confirmed.medical.diagnoses',
      defaultMessage:
        'Er barnið með staðfesta læknisfræðilega greiningu sem skólinn þarf að kunna að bregðast rétt við?',
      description:
        'Does the child have a confirmed medical diagnosis that the school needs to know how to respond to correctly?',
    },
    hasConfirmedMedicalDiagnosesDescription: {
      id: 'nps.application:different.needs.health.protection.has.confirmed.medical.diagnoses.description',
      defaultMessage:
        'Hér er átt við greiningar eins og flogaveiki, sykursýki eða blóðstorknunarsjúkdóm',
      description:
        'This refers to diagnoses such as epilepsy, diabetes, or blood clotting disorders',
    },
    requestsMedicationAdministration: {
      id: 'nps.application:different.needs.health.protection.requests.medication.administration',
      defaultMessage:
        'Er óskað eftir aðstoð við barn vegna lyfjagjafar á skólatíma?',
      description:
        'Is assistance requested for a child due to medication administration during school hours?',
    },
    requestsMedicationAdministrationTooltip: {
      id: 'nps.application:different.needs.health.protection.requests.medication.administration.tooltip',
      defaultMessage:
        'Í fæstum tilvikum geta börn borið ábyrgð á lyfjatöku sinni. Þar skiptir þó aldur og lyfjategund máli. Ábyrgðin er forráðamanna en hjúkrunarfræðingar og starfsmenn skóla aðstoða við lyfjatökuna. Meginreglan er sú að barn á aðeins að fá lyf á skólatíma sem forráðamenn hafa komið með í skólann og óskað eftir að barnið fái.',
      description:
        'In most cases, children cannot be responsible for taking their own medication. However, age and type of medication matter. The responsibility lies with the guardians, but nurses and school staff assist with medication administration. The main rule is that a child should only receive medication at school that the guardians have brought to the school and requested the child to take.',
    },
    schoolNurseAlertMessage: {
      id: 'nps.application:different.needs.health.protection.school.nurse.alert.message',
      defaultMessage:
        'Skólahjúkrunarfræðingur mun setja sig í samband við þig til að tryggja rétta skráningu upplýsinga og miðlun þeirra til starfsfólks skóla.',
      description:
        'The school nurse will contact you to ensure proper recording of information and its dissemination to school staff.',
    },

    // Support
    supportSubSectionTitle: {
      id: 'nps.application:different.needs.support.sub.section.title',
      defaultMessage: 'Stuðningur',
      description: 'Support',
    },
    supportDescription: {
      id: 'nps.application:different.needs.support.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi skóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í',
      description:
        'Children are as diverse as they are numerous. Some need support in order to feel better and make the best use of their strengths. Support for children in school is provided by the schools support services, with the aim of ensuring that every child receives the right assistance, at the right time, from the right professional. \n\nIf your child has a diagnosis of a disability, developmental delay, chronic illness, or serious condition that may impact their schooling, their current school is responsible for passing that information on to the school you are applying to.',
    },
    enrollmentSupportDescription: {
      id: 'nps.application:different.needs.enrollment.support.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi leikskóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        'Children are as different as they are many. Some children need support to feel better and make the most of their strengths. Support in school is provided by the school’s support services and aims to ensure that every child receives the right help, at the right time, from the right person. \n\nIf your child has been diagnosed with a disability, developmental delay, chronic illness, or serious medical condition that could affect their schooling, their current nursery is responsible for passing that information on to the school you are applying to.',
    },
    hasDiagnoses: {
      id: 'nps.application:different.needs.has.diagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi skóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current school?',
    },
    enrollmentHasDiagnoses: {
      id: 'nps.application:different.needs.enrollment.has.diagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi leikskóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current nursery?',
    },
    hasHadSupport: {
      id: 'nps.application:different.needs.has.had.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í skóla?',
      description:
        'Has the student previously received special education or support in school?',
    },
    enrollmentHasHadSupport: {
      id: 'nps.application:different.needs.enrollment.has.had.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í leikskóla?',
      description:
        'Has the student previously received special education or support in nursery?',
    },
    hasWelfareContact: {
      id: 'nps.application:different.needs.has.welfare.contact',
      defaultMessage: 'Hefur barnið verið með tengilið farsældar?',
      description: 'Has the child had a welfare contact person?',
    },
    hasWelfarePrimarySchoolContactDescription: {
      id: 'nps.application:different.needs.has.welfare.primary.school.contact.description',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan grunnskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the primary school who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    hasWelfareNurserySchoolContactDescription: {
      id: 'nps.application:different.needs.has.welfare.nursery.school.contact.description',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan leikskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the nursery who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    welfareContactName: {
      id: 'nps.application:different.needs.welfare.contact.name',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Contact name',
    },
    welfareContactEmail: {
      id: 'nps.application:different.needs.welfare.contact.email',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email',
    },
    hasIntegratedServices: {
      id: 'nps.application:different.needs.has.integrated.services',
      defaultMessage: 'Hefur barnið verið með samþætta þjónustu?',
      description: 'Has the child had integrated services?',
    },
    hasIntegratedServicesDescription: {
      id: 'nps.application:different.needs.has.integrated.services.description',
      defaultMessage:
        'Foreldri hefur óskað eftir og gefið leyfi fyrir því að aðilar sem koma að stuðningi við barnið tali saman og deili upplýsingum sem hjálpað geta barni sín á milli.',
      description:
        "The parent has requested and given permission for the parties involved in the child's support to communicate and share information that can help the child.",
    },
    hasCaseManager: {
      id: 'nps.application:different.needs.has.case.manager',
      defaultMessage: 'Hefur barnið verið með málastjóra?',
      description: 'Has the child had a case manager?',
    },
    hasCaseManagerDescription: {
      id: 'nps.application:different.needs.has.case.manager.description',
      defaultMessage:
        'Málastjóri er sá aðili á vegum sveitarfélagsins sem tilnefndur hefur verið til að stýra stuðningsteymi barnsins og styðja við fjölskylduna.',
      description:
        "A case manager is the person appointed by the municipality to lead the child's support team and support the family.",
    },
    caseManagerName: {
      id: 'nps.application:different.needs.case.manager.name',
      defaultMessage: 'Nafn málastjóra',
      description: 'Case manager name',
    },
    caseManagerEmail: {
      id: 'nps.application:different.needs.case.manager.email',
      defaultMessage: 'Netfang málastjóra',
      description: 'Case manager email address',
    },
    internationalSchoolSupportAlertMessage: {
      id: 'nps.application:different.needs.international.school.alert.message#markdown',
      defaultMessage:
        'If your application is accepted, the school will ask you to send report cards from the last two years, external standardized test results and special needs documentation.',
      description:
        'If your application is accepted, the school will ask you to send report cards from the last two years, external standardized test results and special needs documentation.',
    },
    supportAlertMessage: {
      id: 'nps.application:different.needs.support.alert.message#markdown',
      defaultMessage:
        'Við flutning barns milli leik- og/eða grunnskóla sjá stjórnendur skólanna til þess að persónuupplýsingum um barnið sem nauðsynlegar eru fyrir velferð og aðlögun þess í nýjum skóla, sé miðlað með tryggum og öruggum hætti. \n\nPersónuupplýsingar geta verið:\n\n1. Almennar upplýsingar um félagslega stöðu og þroska barna.\n\n2. Læknisfræðilegar, sálfræðilegar og sérkennslufræðilegar greiningar eða aðrar greiningar og sérúrræði fyrir barn.\n\n3. Sérkennsluumsóknir, námsáætlanir vegna sérúrræða, einstaklingsnámskrár og aðrar bakgrunnsupplýsingar sem að gagni geta komið fyrir velferð og aðlögun barns í skólanum.\n\n4. Prófeinkunnir og vitnisburðir barns, mætingar og/eða agabrot\n\n5. Hverskonar skrifleg eða stafræn gögn svo sem skýrslur, greinargerðir og umsagnir er varða velferð og skólagöngu barns.',
      description:
        "When a child transfers between nursery and/or primary schools, school administrators ensure that personal information about the child that is necessary for their well-being and adjustment to the new school is communicated in a secure and safe manner. \n\nPersonal data can be: \n\n1. General information about the social status and development of children. \n\n2. Medical, psychological, and special education assessments or other evaluations and specialized interventions for a child. \n\n3. Applications for special education, educational plans related to specialized support, individualized learning programs, and other background information that may be useful for the welfare and adaptation of a child in school.\n\n4. The child's exam results and testimonials, attendance, and/or disciplinary infractions.\n\n5. Any kind of written or digital data such as reports, statements, and evaluations concerning the welfare and schooling of the child.",
    },
    requestingMeeting: {
      id: 'nps.application:different.needs.requesting.meeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins getur þú óskað eftir samtali. Skólinn mun setja sig í samband við þig, þegar nær dregur fyrsta skóladegi',
      description:
        "If you believe that the primary school needs more information about the child's needs, you can request a meeting. The school will contact you when the first day of school approaches.",
    },
    requestingMeetingDescription: {
      id: 'nps.application:different.needs.requesting.meeting.description',
      defaultMessage: 'Óska eftir samtali við skóla',
      description: 'Request meeting with the school',
    },

    // Special Education Support
    specialEducationSupportDescription: {
      id: 'nps.application:different.needs.special.education.support.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur í skólanum og nýta styrkleika sína sem best í námi. Stuðningur við barn hefur það að markmiði að styðja við þroska þess, efla færni og þar með lífsgæði. Til að skólinn geti mætt námslegum þörfum barnsins er því mikilvægt að hann hafi upplýsingar um hvaða stuðning og þjónustu barnið hefur notið fram til þessa.',
      description:
        'Children are as different as they come. Some children need encouragement to do well in school and to make the most of their abilities. The purpose of child support is to support a child’s development, develop skills and thus improve their quality of life. In order for the school to meet the child’s educational needs, it is therefore important that it has information about the support and services that the child has received so far.',
    },
    specialEducationHasWelfareContact: {
      id: 'nps.application:different.needs.special.education.has.welfare.contact',
      defaultMessage: 'Er barnið með tengilið farsældar?',
      description: 'Does your child have a welfare contact person?',
    },
    specialEducationHasCaseManager: {
      id: 'nps.application:different.needs.special.education.has.case.manager',
      defaultMessage: 'Er barnið með málastjóra?',
      description: 'Does your child have a case manager?',
    },
    specialEducationHasIntegratedServices: {
      id: 'nps.application:different.needs.special.education.has.integrated.services',
      defaultMessage: 'Er barnið með samþætta þjónustu í þágu farsældar?',
      description: 'Does your child have integrated welfare services?',
    },
    hasAssessmentOfSupportNeeds: {
      id: 'nps.application:different.needs.has.assessment.of.support.needs',
      defaultMessage: 'Liggur fyrir staðlað mat á stuðningsþörf barns?',
      description:
        'Is there a standardised assessment of the child’s support needs?',
    },
    hasAssessmentOfSupportNeedsDescription: {
      id: 'nps.application:different.needs.has.assessment.of.support.needs.description',
      defaultMessage:
        'Sérfræðingar Ráðgjafar- og greiningarstöðvar sjá um framkvæmd SIS-mats fyrir börn á landinu öllu nema þau sem eru með lögheimili í Reykjavík. Í Reykjavík framkvæma sérfræðingar matið á þjónustumiðstöðvum, hjá Barnavernd Reykjavíkur, á heimili og/eða á öðrum vettvangi barns.',
      description:
        'Specialists from the Consulting and Analysis Centre are responsible for the implementation of the SIS-evaluation for children nationwide, except for those whose legal domicile is in Reykjavík. In Reykjavík, specialists carry out the assessment at service centres, at the offices of Reykjavík Child Protection Services, in the child’s home and/or different venues suitable for the child.',
    },
    isAssessmentOfSupportNeedsInProgress: {
      id: 'nps.application:different.needs.is.assessment.of.support.needs.in.progress',
      defaultMessage: 'Er mat á stuðningsþörf barns í ferli?',
      description:
        'Is an assessment of the child’s need for support in progress?',
    },
    supportNeedsAssessmentBy: {
      id: 'nps.application:different.needs.support.needs.assessment.by',
      defaultMessage: 'Hver framkvæmdi matið á stuðningsþörf barns?',
      description:
        'Who carried out the assessment of the child’s support needs?',
    },
    evaluationProvider: {
      id: 'nps.application:different.needs.evaluation.provider',
      defaultMessage: 'Matsaðili',
      description: 'Evaluation provider',
    },
    hasConfirmedDiagnosis: {
      id: 'nps.application:different.needs.has.confirmed.diagnosis',
      defaultMessage:
        'Liggur fyrir staðfest greining á vanda barns eða fötlun frá viðurkenndum greiningaraðila?',
      description:
        'Does the child have a confirmed diagnosis of a problem or disability from an authorised diagnostician?',
    },
    isDiagnosisInProgress: {
      id: 'nps.application:different.needs.is.diagnosis.in.progress',
      defaultMessage:
        'Er barn í greiningarferli hjá viðurkenndum greiningaraðila?',
      description:
        'Is the child in the process of diagnosis with an authorised diagnostician?',
    },
    atWhichDiagnostician: {
      id: 'nps.application:different.needs.at.which.diagnostician',
      defaultMessage: 'Hjá hvaða greiningaraðila?',
      description: 'At which diagnostician?',
    },
    diagnostician: {
      id: 'nps.application:different.needs.diagnostician',
      defaultMessage: 'Greiningaraðili',
      description: 'Diagnostician',
    },
    hasOtherSpecialists: {
      id: 'nps.application:different.needs.has.other.specialists',
      defaultMessage: 'Hafa aðrir fagaðilar komið að stuðningi við barnið?',
      description:
        'Have other specialists been involved in the child’s support?',
    },
    hasOtherSpecialistsDescription: {
      id: 'nps.application:different.needs.has.other.specialists.description',
      defaultMessage:
        'Með fagaðilum er átt við sérfræðinga, innan eða utan skólaþjónustu sveitarfélagsins, sem veitt hafa barninu eða foreldrum stuðning og sem þekkja því sérstaklega til stöðu þess.',
      description:
        'Specialists refer to professionals, within or outside the municipality’s school service, who have provided support to the child or their parents and who have a special knowledge of the child’s situation.',
    },
    atWhichSpecialist: {
      id: 'nps.application:different.needs.at.which.specialist',
      defaultMessage: 'Hjá hvaða fagaðila?',
      description: 'At which specialist?',
    },
    specialists: {
      id: 'nps.application:different.needs.specialists',
      defaultMessage: 'Fagaðilar',
      description: 'Specialists',
    },
    hasReceivedServicesFromMunicipality: {
      id: 'nps.application:different.needs.has.received.services.from.municipality',
      defaultMessage:
        'Hefur barnið eða fjölskyldan þegið þjónustu frá sveitarfélaginu þar sem lögheimilið er skráð?',
      description:
        'Has your child or the family received services from the municipality in which your legal domicile is registered?',
    },
    hasReceivedServicesFromMunicipalityDescription: {
      id: 'nps.application:different.needs.has.received.services.from.municipality.description',
      defaultMessage:
        'Með þjónustu er átt við úrræði sem þjónustumiðstöð, velferðarþjónusta eða barnavernd fer með.',
      description:
        'Services refer to resources provided by a service centre, welfare services or child protective services',
    },
    whichService: {
      id: 'nps.application:different.needs.which.service',
      defaultMessage: 'Hvaða þjónustu?',
      description: 'Which service?',
    },
    hasReceivedChildAndAdolescentPsychiatryServices: {
      id: 'nps.application:different.needs.has.received.child.and.adolescent.psychiatry.services',
      defaultMessage:
        'Hefur barnið fengið þjónustu hjá Barna- og unglingageðdeild?',
      description:
        'Has the child received services at the Child and Adolescent Psychiatry Department?',
    },
    whichChildAndAdolescentPsychiatryDepartment: {
      id: 'nps.application:different.needs.which.child.and.adolescent.psychiatry.department',
      defaultMessage: 'Hvaða barna- og unglingageðdeild?',
      description: 'Which Child and Adolescent Psychiatry Department?',
    },
    childAndAdolescentPsychiatryDepartment: {
      id: 'nps.application:different.needs.child.and.adolescent.psychiatry.department',
      defaultMessage: 'Barna og unglingageðdeild',
      description: 'Child and Adolescent Psychiatry Department',
    },
    childAndAdolescentPsychiatryServicesReceived: {
      id: 'nps.application:different.needs.child.and.adolescent.psychiatry.services.received',
      defaultMessage:
        'Hvernig þjónustu hefur barnið fengið hjá Barna- og unglingageðdeild?',
      description:
        'What kind of services has the child received at the Child and Adolescent Psychiatry Department?',
    },
    isOnWaitlistForServices: {
      id: 'nps.application:different.needs.is.on.waitlist.for.services',
      defaultMessage: 'Er barnið á biðlista eftir þjónustu?',
      description: 'Is the child currently on a waitlist for services?',
    },
    hasBeenReportedToChildProtectiveServices: {
      id: 'nps.application:different.needs.has.been.reported.to.child.protective.services',
      defaultMessage: 'Hafa mál barnsins verið tilkynnt til barnaverndar?',
      description:
        'Has the child’s case been reported to the child protective services?',
    },
    isCaseOpenWithChildProtectiveServices: {
      id: 'nps.application:different.needs.is.case.open.with.child.protective.services',
      defaultMessage: 'Er málið opið hjá barnavernd í dag?',
      description: 'Is the case currently open with child protective services?',
    },
    selectAllThatAppliesPlaceholder: {
      id: 'nps.application:different.needs.select.all.that.applies.placeholder',
      defaultMessage: 'Veldu allt það sem á við',
      description: 'Select all that applies',
    },
    selectWhatIsAppropriatePlaceholder: {
      id: 'nps.application:different.needs.select.what.is.appropriate.placeholder',
      defaultMessage: 'Veldu það sem á við',
      description: 'Select what is appropriate',
    },
    service: {
      id: 'nps.application:different.needs.service',
      defaultMessage: 'Þjónusta',
      description: 'Service',
    },

    // Terms
    termsSubSectionTitle: {
      id: 'nps.application:different.needs.terms.sub.section.title',
      defaultMessage: 'Skilmálar',
      description: 'Terms',
    },
    termsSubSectionDescription: {
      id: 'nps.application:different.needs.terms.description#markdown',
      defaultMessage:
        'Í umsókninni felst þríhliða samkomulag milli forsjáraðila, heimaskóla barns og þess skóla sem tekur tímabundið við barni. \n\nAllir aðilar skuldbinda sig til að vinna saman að velferð barns með það að markmiði að tryggja farsæla endurkomu þess í heimaskóla. Í því felst meðal annars að taka þátt í samstarfi um úrlausnir fyrir barnið, viðhalda virkum samskiptum milli allra aðila, fara eftir markmiðum og áætlun eftir bestu getu, og taka þátt í endurmati á stöðu mála.',
      description:
        'The application includes a tripartite agreement between the custodians, the child’s home school and the school that temporarily accepts the child. \n\nAll parties commit to working together on the welfare of the child, with the aim of ensuring a successful return to their home school. This includes participating in collaborative solutions for the child, maintaining active communication between all parties, following objectives and plans to the best of their ability, and participating in the reassessment of the situation.',
    },
    termsCheckbox: {
      id: 'nps.application:different.needs.terms.checkbox',
      defaultMessage:
        'Með því að haka hér við staðfesta forsjáraðilar sinn hluta samkomulagsins.',
      description:
        'By checking this box custodians confirm their part in the above agreement.',
    },

    // Child's circumstances
    childCircumstancesSubSectionTitle: {
      id: 'nps.application:different.needs.child.circumstances.sub.section.title',
      defaultMessage: 'Aðstæður barns',
      description: "Child's circumstances",
    },
    childCircumstancesSubSectionDescription: {
      id: 'nps.application:different.needs.child.circumstances.sub.section.description#markdown',
      defaultMessage:
        'Til að geta metið betur þörf barns fyrir úrræðið sem sótt er um kann að vera þörf á því að afla frekari upplýsinga á umsóknartímanum um aðstæður barnsins í nærumhverfi þess.\n\nUpplýsingar um aðstæður barns geta falið í sér viðkvæmar persónuupplýsingar, svo sem upplýsingar um heilsufar, og upplýsingar sem geta talist viðkvæms eðlis, svo sem upplýsingar um fjölskylduhagi eða félagslegan vanda barns og háttsemi.\n\nAllar athuganir eru gerðar í samráði við þjónustuteymi eða stuðningsteymi barns. Ef ræða þarf við sérfræðinga utan skólans verður forsjáraðila gefinn kostur á að hafa áhrif á val þeirra. Þá verða niðurstöður athuganna og álits kynntar forsjáraðila áður en endanleg ákvörðun er tekin.\n\nTil að uppfylla skyldur okkar samkvæmt lögum um persónuvernd og vinnslu persónuupplýsinga og reglugerð um stuðning við nemendur með sérþarfir í grunnskóla þurfum við að afla samþykkis foreldra áður en frekari upplýsinga er aflað.    \n\nBiðjum við þig að staðfesta að þú hafir kynnt þér efni þetta og veita samþykki þitt fyrir framangreindri vinnslu persónuupplýsinga í þeim tilgangi sem hér að neðan er lýst.',
      description:
        'In order to better assess a child’s need for the resources applied for, it may be necessary to gather more information during the application process regarding the child’s circumstances in his or her immediate environment.\n\nInformation on the child’s circumstances may include sensitive personal information, such as health information, and information that may be considered sensitive in nature, such as information on the child’s family history or social problems and behaviour.\n\nAll checks are carried out in consultation with the child’s service or support team. If experts outside the school are needed, the guardian will be given the opportunity to influence their choice. The results of the observations and opinions will be presented to the guardian before the final decision is made.\n\nIn order to comply with our legal obligations regarding data protection and the processing of personal information, as well as, regulations regarding the support of pupils with special needs in primary education, we need to obtain parental consent before obtaining any further information.\n\nWe ask you to confirm that you have familiarised yourself with this material and give your consent to the aforementioned processing of personal data for the purposes described below.',
    },
    onSiteObservation: {
      id: 'nps.application:different.needs.on.site.observation',
      defaultMessage:
        'Áður en afstaða er tekin til umsóknarinnar kann að vera þörf á því að meta frekar aðstæður barns með vettvangsathugun.',
      description:
        'Before a decision is made on the application, there may be a need to further assess the childs situation with an on-site observation.',
    },
    approveOnsiteObservation: {
      id: 'nps.application:different.needs.approve.onsite.observation',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, framkvæmi athugun á barni og aðstæðum þess í núverandi skóla og skrái niðurstöðurnar.',
      description:
        'I approve that a professional council or an authorized representative conducts an observation of the child and their situation in the current school and records the findings.',
    },
    onSiteObservationAdditionalInfo: {
      id: 'nps.application:different.needs.on.site.observation.additional.info',
      defaultMessage:
        'Einnig kann að vera þörf á því að afla frekari gagna frá sérfræðingum í þeim tilgangi að upplýsa betur um aðstæður barns í kjölfar vettvangsathugunar.',
      description:
        'There may also be a need to obtain further information from specialists in order to better understand the childs situation following the on-site observation.',
    },
    approveOnSiteObservationAdditionalInfo: {
      id: 'nps.application:different.needs.approve.on.site.observation.additional.info',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, afli eftir þörfum frekari upplýsinga um barnið mitt í kjölfar vettvangsathugunar.',
      description:
        'I approve that a professional council or an authorized representative obtains further information about my child as needed following the on-site observation.',
    },
    callInExpert: {
      id: 'nps.application:different.needs.call.in.expert',
      defaultMessage:
        'Þá kann að vera nauðsynlegt að kalla til sérfræðinga utan skólans í fötlun barns og námi og skólagöngu fatlaðra barna, eða eftir atvikum barna með tilfinninga- og/eða hegðunarvanda.',
      description:
        'It may then be necessary to call in experts outside the school regarding the childs disability and education, or as the case may be, children with emotional and/or behavioral difficulties.',
    },
    approveCallInExpert: {
      id: 'nps.application:different.needs.approve.call.in.expert',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, sæki ráðgjöf sérfræðinga utan skólans í námi og skólagöngu barnsins míns, fötlun eða eftir atvikum vanda þess.',
      description:
        'I approve that a professional council or an authorized representative seeks advice from experts outside the school regarding my childs education and schooling, disability, or as the case may be, their difficulties.',
    },
    childViews: {
      id: 'nps.application:different.needs.child.views',
      defaultMessage:
        'Loks er mikilvægt að kanna afstöðu barns og gefa því færi á að tjá sig um viðhorf sín til nýrra gagna sem fagráð kann að hafa safnað og mögulegrar skólavistar, með hliðstjón af aldri og þroska þess.',
      description:
        'Finally, it is important to explore the childs perspective and give them the opportunity to express their views on the new data that a professional council may have collected and possible school placement, taking into account their age and maturity.',
    },
    approveChildViews: {
      id: 'nps.application:different.needs.approve.child.views',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, afli upplýsinga um viðhorf barnsins sjálfs til nýrra gagna sem safnað hefur verið og mögulegrar skólavistar í þeim skóla sem sótt er um.',
      description:
        'I agree that the professional council, or a party acting on its behalf, may obtain information about the childs own attitude towards the new data that has been collected and possible school placement at the school applied for.',
    },

    // Payer
    payerSubSectionTitle: {
      id: 'nps.application:different.needs.payer.sub.section.title',
      defaultMessage: 'Greiðandi',
      description: 'Payer',
    },
    payerTitle: {
      id: 'nps.application:different.needs.payer.title',
      defaultMessage: 'Hver greiðir fyrir skólavist barnsins?',
      description: 'Who pays the child’s school fees',
    },
    payerDescription: {
      id: 'nps.application:different.needs.payer.description',
      defaultMessage:
        'Forsjáraðilar sem sækja um sjálfstætt starfandi skóla fyrir barn sitt, þurfa að gera ráð fyrir því að greiða gjöld sem eru sérstök fyrir þann skóla. Þetta geta verið skráningargjöld, foreldragjöld, efnisgjöld eða önnur gjöld sem eru óháð greiðslu sveitarfélaganna til skólanna sjálfra. Vinsamlegast skráðu hver verður greiðandi viðbótargjalda fyrir barnið þitt.',
      description:
        'Guardians applying for an independent school for their child, must expect to pay fees specific to that school. This refers to the payment of fees such as enrolment fees, parent association fees, materials fees or other fees that are independent of the payments the school receives from the municipality. Please register who will be the payer of the additional school fees for your child.',
    },
    payerOptionApplicant: {
      id: 'nps.application:different.needs.payer.option.applicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant',
    },
    payerOptionOther: {
      id: 'nps.application:different.needs.payer.option.other',
      defaultMessage: 'Annar',
      description: 'Other',
    },
    payerInformation: {
      id: 'nps.application:different.needs.payer.information',
      defaultMessage: 'Upplýsingar um greiðanda',
      description: 'Payer information',
    },
    payerInformationDescription: {
      id: 'nps.application:different.needs.payer.information.description',
      defaultMessage:
        'Greiðandi verður beðinn um að samþykkja greiðsluþátttöku áður en umsókn er send inn.',
      description:
        'The payer will be asked to confirm the payment participation before the application is submitted.',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'nps.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'nps.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    child: {
      id: 'nps.application:overview.child',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    submitButton: {
      id: 'nps.application:overview.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'nps.application:overview.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    guardians: {
      id: 'nps.application:overview.guardians',
      defaultMessage: 'Forsjáraðili {index}',
      description: 'Guardian {index}',
    },
    languageEnvironment: {
      id: 'nps.application:overview.language.environment',
      defaultMessage: 'Tungumálaumhverfi',
      description: 'Language environment',
    },
    preferredLanguage: {
      id: 'nps.application:overview.preferred.language',
      defaultMessage: 'Tungumálið sem barninu finnst best að tjá sig á',
      description: 'The language the child prefers to express themselves in',
    },
    schoolTitle: {
      id: 'nps.application:overview.school.title',
      defaultMessage: 'Upplýsingar um skóla',
      description: 'Information about school',
    },
    selectedSchool: {
      id: 'nps.application:overview.selected.school',
      defaultMessage: 'Valinn skóli',
      description: 'Selected school',
    },
    neighbourhoodSchool: {
      id: 'nps.application:overview.neigbourhood.school',
      defaultMessage: 'Hverfisskóli',
      description: 'Neighbourhood school',
    },
    foodAllergiesOrIntolerances: {
      id: 'nps.application:overview.food.allergies.or.intolerances',
      defaultMessage: 'Fæðuofnæmi eða -óþol',
      description: 'Food allergies or intolerances',
    },
    otherAllergies: {
      id: 'nps.application:overview.other.allergies',
      defaultMessage: 'Annað ofnæmi',
      description: 'Other allergies',
    },
    usesEpiPen: {
      id: 'nps.application:overview.uses.epi.pen',
      defaultMessage: 'Notar adrenalínpenna (epi-pen) vegna ofnæmis',
      description: 'Uses an epi-pen for allergies',
    },
    currentNursery: {
      id: 'nps.application:overview.current.nursery',
      defaultMessage: 'Núverandi leikskóli',
      description: 'Current nursery',
    },
    expectedStartDate: {
      id: 'nps.application:overview.expected.start.date',
      defaultMessage: 'Áætlaður upphafsdagur',
      description: 'Expected start date',
    },
    expectedEndDate: {
      id: 'nps.application:overview.expected.end.date',
      defaultMessage: 'Áætlaður lokadagur',
      description: 'Expected end date',
    },
  }),

  conclusion: defineMessages({
    sectionTitle: {
      id: 'nps.application:conclusion.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    expandableDescription: {
      id: 'nps.application:conclusion.expandable.description#markdown',
      defaultMessage:
        'Skólinn fær núna umsóknina til sín til umfjöllunar og mun svara þér um ákvörðun sína eins fljótt og auðið er með bréfi sem sent verður í stafræna pósthólfið þitt á [Ísland.is](https://island.is).\n\nÁður en ákvörðun er tekin kann að vera þörf á því að afla frekari gagna í þeim tilgangi að upplýsa betur um aðstæður barnsins þíns eða ástæður umsóknar. Mun þá sveitarfélagið þar sem þú ert með skráð lögheimili eða skólinn sem þú ert að sækja um skólavist í, setja sig í samband við þig.\n\nEf þú sóttir um sjálfstætt starfandi skóla, og skráðir annan aðila sem greiðanda gjalda fyrir skólavist, þá verður greiðandi beðinn um að staðfesta þátttöku sína áður en umsókn er send til skóla til úrvinnslu.\n\nAthugið að ekki er víst að hægt sé að verða við ósk forsjáraðila en það fer eftir fjölda lausra plássa, fjölda umsókna og aðstæðum í skólanum á hverjum tíma.\n\nEf umsókn um skólaskipti er samþykkt, verður þú og barnið þitt boðað til móttökuviðtals.',
      description:
        'The school will now receive your application for consideration and will reply to you as soon as possible with a message sent to your digital mailbox at [Ísland.is](https://island.is). \n\nBefore a decision is made, additional information may be needed to better understand your child’s situation or the reasons for the application. You will be contacted by the municipality where you are registered or by the school where you applied, if need be. \n\nIf you applied for an independent school, and you register another party as the payer for the school fees, the payer will be asked to confirm before the application is sent to the school for processing. \n\nPlease note that it may not be possible to comply with the guardian’s request, it will depend on the number of places available, the number of applications and the circumstances at the school at any given time. \n\nIf your application for a school transfer is accepted, you and your child will be invited to a reception interview.',
    },
    enrollmentExpandableDescription: {
      id: 'nps.application:conclusion.enrollment.expandable.description#markdown',
      defaultMessage:
        'Takk fyrir að staðfesta skólavistina.\n\nSkólinn mun senda þér upplýsingar um fyrsta skóladag þegar nær dregur. Fram að því hvetjum við þig til að skoða heimasíðu skólans.',
      description:
        'Thank you for confirming the school enrolment.\n\nThe school will send you information about the first day of school as it gets closer. Until then, we encourage you to look at the school’s website.',
    },
    specialEducationExpandableDescription: {
      id: 'nps.application:conclusion.special.education.expandable.description#markdown',
      defaultMessage:
        'Forsjáraðili hefur 14 daga til að skila nauðsynlegum fylgiskjölum með umsókn til skóla ef þau voru ekki send rafrænt með þessari umsókn, en án þeirra verður umsókn ekki tekin til umfjöllunar.\n\nSkólinn tekur ákvörðun um skólavist byggða á grundvelli tillagna fagráðs sem fjallar um allar umsóknir. Tilkynnir skólinn þér um ákvörðunina eins fljótt og auðið er með bréfi sem sent verður í stafræna pósthólfið þitt á [Ísland.is](https://island.is).\n\nÁður en afstaða er tekin kann þó að vera þörf á því að afla frekari gagna í þeim tilgangi að upplýsa betur um aðstæður barnsins þíns eða ástæður umsóknar. Mun þá sveitarfélagið þar sem þú ert með skráð lögheimili eða skólinn sem þú ert að sækja um skólavist í, setja sig í samband við þig.\n\nÍ þeim tilvikum sem aðilar deila forsjá er nauðsynlegt að samþykki beggja aðila fyrir umsókn liggi fyrir. Sé forsjá deilt verður þessi umsókn send fyrst til undirritunar hjá þeim aðila sem ekki er skráður fyrir umsókninni. Samþykki hans er forsenda þess að umsókn sé send áfram til úrvinnslu.\n\nEf þú sóttir um sjálfstætt starfandi skóla, og skráðir annan aðila sem greiðanda gjalda fyrir skólavist, þá verður greiðandi einnig beðinn um að staðfesta þátttöku sína áður en umsókn er send til skóla til úrvinnslu.\n\nAthugið að ekki er víst að hægt sé að verða við ósk þinni en það fer meðal annars eftir fjölda umsókna, fjölda lausra plássa og aðstæðum í hverjum skóla á hverjum tíma. Ef umsókn er synjað vegna þessa er foreldrum gefinn kostur á að halda umsókn sinni í skólanum virkri til umfjöllun síðar.\n\nEf umsókn um skólavist er samþykkt, verður þú og barnið þitt boðað til móttökuviðtals.',
      description:
        'The guardian has 14 days to return the necessary documents with the application to the school if they were not sent electronically with the application, without them the application will not be considered.\n\nThe school makes a decision regarding school enrolment based on the proposal of a professional council, which considers all applications. The school will notify you of their decision as soon as possible with a message sent to your digital mailbox at Ísland.is.\n\nBefore a decision is made, additional information may be needed to better understand your child’s situation or the reasons for the application. You will be contacted by the municipality where you are registered or by the school where you applied, if need be.\n\nIn cases where the parties share custody, it is necessary that both parties consent to the application. If custody is shared, this application will first be sent to be signed by the person who is not registered for the application. Their approval is a prerequisite for the application to be forwarded for processing.\n\nIf you applied for an independent school, and you register another party as the payer for the school fees, the payer will be asked to confirm before the application is sent to the school for processing.\n\nPlease note that it may not be possible to comply with your request, it will depend on the number of places available, the number of applications and the circumstances at the school at any given time. If the application is rejected due to these reasons, the parents are given the option to keep their application active at the school for later consideration.\n\nIf your application for school enrolment is accepted, you and your child will be invited to a reception interview.',
    },
  }),
}

export const assigneeMessages: MessageDir = {
  shared: defineMessages({
    childName: {
      id: 'nps.application:assignee.shared.child.name',
      defaultMessage: 'Nafn barns',
      description: 'Child’s name',
    },
    approve: {
      id: 'nps.application:assignee.shared.approve',
      defaultMessage: 'Samþykkja',
      description: 'Approve',
    },
    reject: {
      id: 'nps.application:assignee.shared.reject',
      defaultMessage: 'Hafna',
      description: 'Reject',
    },
    thanksDescription: {
      id: 'nps.application:assignee.shared.thanks.description',
      defaultMessage: 'Takk fyrir! Afstaða þín er skráð.',
      description: 'Thank you! Your position has been registered.',
    },
    editApplication: {
      id: 'nps.application:assignee.shared.edit.application',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
  }),

  otherGuardian: defineMessages({
    title: {
      id: 'nps.application:assignee.other.guardian.title',
      defaultMessage: 'Undirritun beggja forsjáraðila',
      description: 'Signature of both guardians',
    },
    approvalDescription: {
      id: 'nps.application:assignee.other.guardian.approval.description',
      defaultMessage:
        'Óskað hefur verið eftir undirritun þinni vegna umsóknar fyrir barnið þitt í eftirfarandi skóla',
      description:
        'Your signature has been requested on an application for your child’s enrolment in the following school',
    },
    rejectedDescription: {
      id: 'nps.application:assignee.other.guardian.rejected.description',
      defaultMessage:
        'Forsjáraðili hefur hafnað því að undirrita umsókn fyrir barnið ykkar í eftirfarandi skóla',
      description:
        'The guardian has refused to sign your child’s application for the following school',
    },
    name: {
      id: 'nps.application:assignee.other.guardian.name',
      defaultMessage: 'Nafn forsjáraðila',
      description: 'Name of guardian',
    },
    alertMessage: {
      id: 'nps.application:assignee.other.guardian.alert.message',
      defaultMessage:
        'Ekki er hægt að senda inn umsókn nema að undirritun beggja forsjáraðila liggi fyrir.',
      description:
        'Unable to submit application without the signatures of both guardians',
    },
  }),

  payer: defineMessages({
    title: {
      id: 'nps.application:assignee.payer.title',
      defaultMessage: 'Greiðandi gjalds fyrir skólavist',
      description: 'Payer of school fees',
    },
    approvalDescription: {
      id: 'nps.application:assignee.payer.approval.description',
      defaultMessage:
        'Þú hefur verið skráð/ur sem greiðandi gjalds fyrir skólavist barns í sjálfstætt starfandi skóla.',
      description:
        'You have been registered as the payer of schools fees for a child’s enrolment in an independent school.',
    },
    rejectedDescription: {
      id: 'nps.application:assignee.payer.rejected.description',
      defaultMessage:
        'Umbeðinn greiðandi hefur hafnað beiðni þinni um greiðslu skólagjalda.',
      description:
        'The requested payer has rejected your request for the payment of school fees',
    },
    name: {
      id: 'nps.application:assignee.payer.name',
      defaultMessage: 'Nafn greiðanda',
      description: 'Payer name',
    },
    alertMessage: {
      id: 'nps.application:assignee.payer.alert.message',
      defaultMessage:
        'Vinsamlegast farðu inn í umsóknina og veldu annan greiðanda',
      description: 'Please revisit the application and choose another payer',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'nps.application:error.phone.number',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  nationalId: {
    id: 'nps.application:error.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'National id must be valid',
  },
  relativesRequired: {
    id: 'nps.application:error.relatives.required',
    defaultMessage:
      'Nauðsynlegt er að bæta við að minnsta kosti einum aðstandanda.',
    description: 'You must add at least one relative',
  },
  siblingsRequired: {
    id: 'nps.application:error.siblings.required',
    defaultMessage: 'Nauðsynlegt er að bæta við að minnsta kosti einu systkini',
    description: 'You must add at least one sibling',
  },
  languagesRequired: {
    id: 'nps.application:error.languages.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt tungumál',
    description: 'At least one language must be selected',
  },
  languageRequired: {
    id: 'nps.application:error.language.required',
    defaultMessage: 'Það þarf að velja tungumál',
    description: 'Language must be selected',
  },
  twoLanguagesRequired: {
    id: 'nps.application:error.two.languages.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti tvö tungumál',
    description: 'At least two language must be selected',
  },
  expectedEndDateRequired: {
    id: 'nps.application:error.expected.end.date.required',
    defaultMessage: 'Það þarf að velja áætlaðan lokadag',
    description: 'You must select an expected end date',
  },
  noChildrenFoundTitle: {
    id: 'nps.application:error.no.children.found.title',
    defaultMessage: 'Því miður ert þú ekki með skráð barn á grunnskólaaldri',
    description:
      'Unfortunately, you do not have a child registered at primary school age',
  },
  noChildrenFoundMessage: {
    id: 'nps.application:error.no.children.found.message#markdown',
    defaultMessage:
      'Eingöngu sá sem er með lögheimilisforsjá hefur heimild til að sækja um fyrir barn. \n\nÞjóðskrá skráir hver eða hverjir teljast foreldrar barns og hver fari með forsjárskyldur þess. Upplýsingar um skráningu forsjár og lögheimilisforeldris má nálgast hér: [Foreldrar og forsjá | Þjóðskrá (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nUpplýsingum um tengsl á milli barna og foreldra auk forsjáraðila eru einnig aðgengilegar á [Mínum síðum á Ísland.is](https://island.is/minarsidur)',
    description:
      'Only the person who has legal custody has the authority to apply for a child.\n\nThe National Registry records who or which individuals are considered to be the parents of a child and who has custody responsibilities. Information on registering custody and legal guardianship can be found here: [Parents and Custody | National Registry (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nInformation about the relationship between children and parents, as well as custody authorities, is also available on [My Pages on Ísland.is](https://island.is/minarsidur)',
  },
  expectedEndDateMessage: {
    id: 'nps.application:expected.end.date.less.than.start.date',
    defaultMessage: 'Lokadagur má ekki vera fyrir byrjunardag',
    description: 'End date cannot be before start date',
  },
  foodAllergiesOrIntolerancesRequired: {
    id: 'nps.application:error.food.allergies.or.intolerances.required',
    defaultMessage:
      'Það þarf að velja að minnsta kosti eitt fæðuofnæmi eða -óþol',
    description: 'At least one food allergy or intolerance must be selected',
  },
  otherAllergiesRequired: {
    id: 'nps.application:error.other.allergies.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt ofnæmi',
    description: 'At least one allergy must be selected',
  },
})

export const statesMessages = defineMessages({
  applicationReceivedTag: {
    id: 'nps.application:application.received.tag',
    defaultMessage: 'Móttekin',
    description: 'Received',
  },
})

export const pendingActionMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'nps.application:pending.action.application.approved.description',
    defaultMessage: 'Umsókn í grunnskóla samþykkt',
    description: 'The application for primary school has been approved',
  },
  applicationRejectedDescription: {
    id: 'nps.application:pending.action.application.rejected.description',
    defaultMessage: 'Umsókn í grunnskóla hefur verið hafnað',
    description: 'The application for primary school has been rejected',
  },
  otherGuardianApprovalAssigneeDescription: {
    id: 'nps.application:pending.action.other.guardian.approval.assignee.description',
    defaultMessage:
      'Óskað hefur verið eftir undirritun þinni vegna umsóknar fyrir barnið þitt í skóla.',
    description:
      'Your signature has been requested on an application for your child’s enrolment in school.',
  },
  otherGuardianApprovalApplicantDescription: {
    id: 'nps.application:pending.action.other.guardian.approval.applicant.description',
    defaultMessage: 'Umsókn þín er í bið eftir samþykki frá forsjáraðila.',
    description: 'Your application is pending approval from guardian.',
  },
  otherGuardianRejectedTitle: {
    id: 'nps.application:pending.action.other.guardian.rejected.title',
    defaultMessage: 'Forsjáraðili hefur hafnað umsókn',
    description: 'The guardian has rejected the application',
  },
  otherGuardianRejectedDescription: {
    id: 'nps.application:pending.action.other.guardian.rejected.description',
    defaultMessage:
      'Forsjáraðili hefur hafnað umsókn, vinsamlegast gerðu breytingar á umsókn.',
    description:
      'The application has been rejected by a guardian, please make changes to the application.',
  },
  payerApprovalAssigneeDescription: {
    id: 'nps.application:pending.action.payer.approval.assignee.description',
    defaultMessage:
      'Þú hefur verið skráð/ur sem greiðandi fyrir skólavist barns.',
    description:
      'You have been registered as the payer for a child’s school fees.',
  },
  payerApprovalApplicantDescription: {
    id: 'nps.application:pending.action.payer.approval.applicant.description',
    defaultMessage: 'Umsókn þín er í bið eftir samþykki frá skráðum greiðanda.',
    description:
      'Your application is pending approval from the registered payer.',
  },
  payerRejectedTitle: {
    id: 'nps.application:pending.action.payer.rejected.title',
    defaultMessage: 'Skráður greiðandi hefur hafnað umsókn',
    description: 'The registered payer has rejected the application',
  },
  payerRejectedDescription: {
    id: 'nps.application:pending.action.payer.rejected.description',
    defaultMessage:
      'Skráður greiðandi hefur hafnað umsókn, vinsamlegast gerðu breytingar á umsókn.',
    description:
      'The registered payer has rejected the application, please make changes to the application.',
  },
})

export const historyMessages = defineMessages({
  otherGuardianApprovalApproved: {
    id: 'nps.application:history.other.guardian.approval.approved',
    defaultMessage: 'Forsjáraðili samþykkti umsókn',
    description: 'The guardian approved the application',
  },
  otherGuardianApprovalRejected: {
    id: 'nps.application:history.other.guardian.approval.rejected',
    defaultMessage: 'Forsjáraðili hafnaði umsókn',
    description: 'The guardian rejected the application',
  },
  payerApprovalApproved: {
    id: 'nps.application:history.payer.approval.approved',
    defaultMessage: 'Skráður greiðandi samþykkti umsókn',
    description: 'The registered payer approved the application',
  },
  payerApprovalRejected: {
    id: 'nps.application:history.payer.approval.rejected',
    defaultMessage: 'Skráður greiðandi hafnaði umsókn',
    description: 'The registered payer rejected the application',
  },
  applicationEdited: {
    id: 'nps.application:history.application.edited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
})
