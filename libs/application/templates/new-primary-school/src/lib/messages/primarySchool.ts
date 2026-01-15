import { defineMessages } from 'react-intl'

export const primarySchoolMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'nps.application:primarySchool.shared.sectionTitle',
      defaultMessage: 'Grunnskóli',
      description: 'Primary school',
    },
  }),
  reasonForApplication: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.reasonForApplication.subSectionTitle',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    description: {
      id: 'nps.application:primarySchool.reasonForApplication.description',
      defaultMessage:
        'Til að aðstoða okkur við að mæta þörfum fjölskyldunnar biðjum við þig að velja þá ástæðu sem best á við í þínu tilfelli.',
      description:
        'To help us meet the needs of your family, please select the reason that is most appropriate in your case.',
    },
    enrollmentDescription: {
      id: 'nps.application:primarySchool.reasonForApplication.enrollmentDescription',
      defaultMessage:
        'Barn á alltaf rétt á skólavist í sínum hverfisskóla. Séu ástæður umsóknar aðrar en flutningur lögheimilis getur verið að skólinn sjái sér ekki fært að taka á móti barninu. Það fer eftir aðstæðum í skólanum hverju sinni, svo sem rými.',
      description:
        'A child always has the right to attend school in his district school. If the reasons for the application are other than a change of legal residence, the school may not be able to accept the child. It depends on the situation in the school each time, such as space.',
    },
    placeholder: {
      id: 'nps.application:primarySchool.reasonForApplication.placeholder',
      defaultMessage: 'Veldu ástæðu',
      description: 'Select reason',
    },
  }),
  counsellingRegardingApplication: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.counsellingRegardingApplication.subSectionTitle',
      defaultMessage: 'Ráðgjöf vegna umsóknar',
      description: 'Counselling regarding application',
    },
    description: {
      id: 'nps.application:primarySchool.counsellingRegardingApplication.description',
      defaultMessage:
        'Stuðningsteymi eða eftir atvikum þjónustuteymi barns hefur það hlutverk að útfæra og skipuleggja þjónustu við barn og hafa samráð við forsjáraðila og barn um samfellu hennar og gæði. Vinsamlegast tilgreindu hvaðan þú sóttir ráðgjöf um þetta úrræði.',
      description:
        'The support team or, depending on the circumstances, the child’s service team has the task of implementing and organising services for the child and consulting with the guardians and the child regarding its continuity and quality. Please indicate where you received counselling on this resource.',
    },
    placeholder: {
      id: 'nps.application:primarySchool.counsellingRegardingApplication.placeholder',
      defaultMessage: 'Veldu ráðgjöf',
      description: 'Choose counselling type',
    },
    hasVisitedSchool: {
      id: 'nps.application:primarySchool.counsellingRegardingApplication.hasVisitedSchool',
      defaultMessage:
        'Hefurðu heimsótt og kynnt þér starfsemi þess skóla sem þú sækir um?',
      description:
        'Have you visited and familiarised yourself with the operation of the school you are applying for?',
    },
  }),
  siblings: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.siblings.subSectionTitle',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    title: {
      id: 'nps.application:primarySchool.siblings.title',
      defaultMessage: 'Systkini í sama grunnskóla',
      description: 'Siblings in the same primary school',
    },
    registrationTitle: {
      id: 'nps.application:primarySchool.siblings.registrationTitle',
      defaultMessage: 'Skráning systkinis',
      description: 'Registration of a sibling',
    },
    addSibling: {
      id: 'nps.application:primarySchool.siblings.addSibling',
      defaultMessage: 'Bæta við systkini',
      description: 'Add a sibling',
    },
    registerSibling: {
      id: 'nps.application:primarySchool.siblings.registerSibling',
      defaultMessage: 'Skrá systkini',
      description: 'Register sibling',
    },
    deleteSibling: {
      id: 'nps.application:primarySchool.siblings.deleteSibling',
      defaultMessage: 'Eyða systkini',
      description: 'Remove sibling',
    },
    editSibling: {
      id: 'nps.application:primarySchool.siblings.editSibling',
      defaultMessage: 'Breyta systkini',
      description: 'Edit sibling',
    },
  }),
  currentSchool: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.currentSchool.subSectionTitle',
      defaultMessage: 'Upplýsingar um núverandi skóla',
      description: 'Information about current school',
    },
    currentSchool: {
      id: 'nps.application:primarySchool.currentSchool.currentSchool',
      defaultMessage: 'Núverandi skóli',
      description: 'Current school',
    },
    grade: {
      id: 'nps.application:primarySchool.currentSchool.grade',
      defaultMessage: 'Bekkur',
      description: 'Grade',
    },
    currentGrade: {
      id: 'nps.application:primarySchool.currentSchool.currentGrade',
      defaultMessage: '{grade}. bekkur',
      description: '{grade} grade',
    },
  }),
  currentNursery: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.currentNursery.subSectionTitle',
      defaultMessage: 'Upplýsingar um núverandi leikskóla',
      description: 'Information about current nursery',
    },
    description: {
      id: 'nps.application:primarySchool.currentNursery.description',
      defaultMessage:
        'Við undirbúning fyrir móttöku barns í grunnskóla er gagnlegt að vita úr hvaða leikskóla barnið kemur. Athugið að engar upplýsingar eru fluttar með sjálfvirkum hætti milli leikskóla og grunnskóla.',
      description:
        'When preparing for the admission of a child to primary school, it is useful to know from which nursery the child comes. Please note that no information is transferred automatically between nursery and primary school.',
    },
    nursery: {
      id: 'nps.application:primarySchool.currentNursery.nursery',
      defaultMessage: 'Leikskóli',
      description: 'Nursery',
    },
    nurseryPlaceholder: {
      id: 'nps.application:primarySchool.currentNursery.nurseryPlaceholder',
      defaultMessage: 'Veldu leikskóla',
      description: 'Select nursery',
    },
    hasCurrentNursery: {
      id: 'nps.application:primarySchool.currentNursery.hasCurrentNursery',
      defaultMessage: 'Er barnið þitt í leikskóla á Íslandi?',
      description: 'Does your child attend a nursery in Iceland?',
    },
    alertMessage: {
      id: 'nps.application:primarySchool.currentNursery.alertMessage',
      defaultMessage:
        'Í skólanámskrá hvers leikskóla er tilgreint hvaða upplýsingar skulu almennt fylgja barni á milli skólastiga og rétt forsjáraðila í þeim efnum. Nánar má svo lesa um öflun, meðferð og vörslu upplýsinga um börn í leikskólum og miðlun upplýsinga milli leik- og grunnskóla í reglugerð nr. 896/2009.',
      description:
        'The curriculum of each nursery specifies which information should generally accompany a child between school levels and the rights of the guardian in that regard. You can read more about the collection, usage and storage of information about children in nurseries and the sharing of information between nurseries and primary schools in regulation no. 896/2009.',
    },
  }),
  school: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.school.subSectionTitle',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    description: {
      id: 'nps.application:primarySchool.school.description',
      defaultMessage:
        'Börn eiga rétt á skólavist í því sveitarfélagi þar sem þau eru með skráð lögheimili. Langflest sveitarfélög úthluta barni skólavist í hverfisskóla eða sem næst þeirra heimili. Eftir sem áður er það réttur forsjáraðila að sækja um annan skóla fyrir barnið sitt, hvort sem er innan sveitarfélagsins, utan þess eða í sjálfstætt starfandi skóla. Ekki er þó víst að sá skóli geti tekið á móti barninu og fer það eftir þeim reglum sem sveitarfélagið setur og aðstæðum í nýjum skóla hverju sinni.',
      description:
        'Children have the right to attend school in the municipality where they are registered as legal residents. Most municipalities assign children to their district school or the one closest to their home. However, it is the right of the guardian to apply for another school for their child, whether within the municipality, outside it, or in an independent school. However, it is not certain that the school will be able to accept the child, and this depends on the rules set by the municipality and the circumstances in the new school each time.',
    },
    applyForPreferredSchoolLabel: {
      id: 'nps.application:primarySchool.school.applyForPreferredSchoolLabel',
      defaultMessage: 'Staðfesta innritun í hverfisskóla',
      description: 'Confirm enrollment in the neighbourhood school',
    },
    applyForPreferredSchoolSubLabel: {
      id: 'nps.application:primarySchool.school.applyForPreferredSchoolSubLabel',
      defaultMessage: 'Hverfisskólinn ykkar er: {preferredSchoolName}',
      description: 'Your neighbourhood school is: {preferredSchoolName}',
    },
    applyForOtherSchoolLabel: {
      id: 'nps.application:primarySchool.school.applyForOtherSchoolLabel',
      defaultMessage: 'Hafna innritun í hverfisskóla',
      description: 'Decline enrollment in the neighbourhood school',
    },
    applyForOtherSchoolSubLabel: {
      id: 'nps.application:primarySchool.school.applyForOtherSchoolSubLabel',
      defaultMessage:
        'Ef forsjáraðili velur að hafna innritun í hverfisskóla þá býðst honum sjálfkrafa sá möguleiki að sækja um annan skóla fyrir barnið sitt.',
      description:
        'If the guardian chooses to decline enrollment in the neighbourhood school, they are automatically offered the option to apply for another school for their child.',
    },
  }),
  newSchool: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.newSchool.subSectionTitle',
      defaultMessage: 'Nýr skóli',
      description: 'New school',
    },
    alertMessage: {
      id: 'nps.application:primarySchool.newSchool.alertMessage',
      defaultMessage:
        'Einungis þau börn sem stundað hafa skipulagðar íþróttaæfingar með þjálfara hjá íþróttafélagi síðastliðið ár, eiga kost á því að vera teknir inn á afreksíþróttabraut. Ef þú telur að barnið þitt uppfylli ekki þau skilyrði mælum við með því að skrá barnið þitt á akademíubraut.',
      description:
        'Only children who have participated in organised sports training with a coach at a sports club in the past year are eligible to be admitted to the elite sports course. If you believe that your child does not meet these criteria, we recommend registering your child for the academy course.',
    },
    specialSchoolOrDepartmentAlertMessage: {
      id: 'nps.application:primarySchool.newSchool.specialSchoolOrDepartmentAlertMessage',
      defaultMessage:
        'Þú hefur valið að sækja um sérúrræði fyrir barnið þitt. Sérúrræði eru fyrir börn með metnar sérþarfir sem talið er að ekki sé hægt að mæta með almennu námi í grunnskóla, hvort sem er með stuðningi í kennslustund eða sérkennslu.',
      description:
        'You have chosen to apply for special resources for your child. Special resources are for children with assessed special needs who are considered to be unable to attend general education in primary school, whether with support in the classroom or special education.',
    },
    alternativeSpecialEducationDepartmentTitle: {
      id: 'nps.application:primarySchool.newSchool.alternativeSpecialEducationDepartmentTitle',
      defaultMessage: 'Annað val',
      description: 'Second choice',
    },
    alternativeSpecialEducationDepartmentDescription: {
      id: 'nps.application:primarySchool.newSchool.alternativeSpecialEducationDepartmentDescription',
      defaultMessage:
        'Athugið að ekki er víst að hægt sé að verða við ósk foreldra um val á sérdeild. Fer það fer eftir fjölda lausra plássa, fjölda umsókna og aðstæðum í deildinni hverju sinni. Biðjum við þig því að merkja við aðra sérdeild sem kemur til greina fyrir barnið þitt.',
      description:
        'Please note, it may not be possible to comply with the parents’ wishes regarding their choice of special education department. This depends on the number of available places, the number of applications and the situation at the department at any given time. We therefore ask that you select an alternative special education department that is appropriate for your child.',
    },
    alternativeSpecialEducationDepartment: {
      id: 'nps.application:primarySchool.newSchool.alternativeSpecialEducationDepartment',
      defaultMessage: 'Sérdeild {index}',
      description: 'Special education department {index}',
    },
    alternativeSpecialEducationDepartmentPlaceholder: {
      id: 'nps.application:primarySchool.newSchool.alternativeSpecialEducationDepartmentPlaceholder',
      defaultMessage: 'Veldu sérdeild',
      description: 'Choose special education department',
    },
    addAlternativeSpecialEducationDepartmentButton: {
      id: 'nps.application:primarySchool.newSchool.addAlternativeSpecialEducationDepartmentButton',
      defaultMessage: 'Bæta við sérdeild',
      description: 'Add special education department',
    },
    removeAlternativeSpecialEducationDepartmentButton: {
      id: 'nps.application:primarySchool.newSchool.removeAlternativeSpecialEducationDepartmentButton',
      defaultMessage: 'Fjarlægja sérdeild',
      description: 'Remove special education department',
    },
  }),
  startingSchool: defineMessages({
    subSectionTitle: {
      id: 'nps.application:primarySchool.startingSchool.subSectionTitle',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
    },
    title: {
      id: 'nps.application:primarySchool.startingSchool.title',
      defaultMessage: 'Hvenær óskar þú eftir að barnið byrji í nýjum skóla?',
      description: 'When do you wish the child to start in a new school?',
    },
    description: {
      id: 'nps.application:primarySchool.startingSchool.description',
      defaultMessage:
        'Við viljum taka vel á móti skólabarninu. Til þess að getað undirbúið komu þess þá biðjum við þig að velja dagsetningu fyrir fyrsta skóladaginn.',
      description:
        'We want to properly welcome your child to the school. To prepare for their arrival, please select a date for the first school day.',
    },
    expectedStartDateTitle: {
      id: 'nps.application:primarySchool.startingSchool.expectedStartDateTitle',
      defaultMessage: 'Áætlaður upphafsdagur',
      description: 'Expected start date',
    },
    expectedStartDatePlaceholder: {
      id: 'nps.application:primarySchool.startingSchool.expectedStartDatePlaceholder',
      defaultMessage: 'Veldu áætlaðan upphafsdag',
      description: 'Select expected start date',
    },
    expectedEndDateTitle: {
      id: 'nps.application:primarySchool.startingSchool.expectedEndDateTitle',
      defaultMessage: 'Áætlaður lokadagur',
      description: 'Expected end date',
    },
    expectedEndDateDescription: {
      id: 'nps.application:primarySchool.startingSchool.expectedEndDateDescription',
      defaultMessage: 'Vinsamlegast skráið áætlaðan lokadag',
      description: 'Please provide an expected end date',
    },
    expectedEndDatePlaceholder: {
      id: 'nps.application:primarySchool.startingSchool.expectedEndDatePlaceholder',
      defaultMessage: 'Veldu áætlaðan lokadag',
      description: 'Select expected end date',
    },
    temporaryStay: {
      id: 'nps.application:primarySchool.startingSchool.temporaryStay',
      defaultMessage: 'Er skóladvölin tímabundin?',
      description: 'Is the school stay temporary?',
    },
  }),
}
