import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'dir.application:applicationTitle',
    defaultMessage: 'Skráningar ökukennara',
    description: 'Application for P-Sign',
  },
  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'dir.application:applicationDataCollectionTitle',
    defaultMessage: 'Upplýsingasöfnun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'dir.application:dataCollectionSubtitle',
    defaultMessage:
      'Upplýsingar um núverandi ökuréttindi verða sóttar í Ökuskírteinaskrá',
    description: 'Subtitle for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'dir.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég staðfesti ofangreint og samþykki upplýsingaöflun',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionTeachersRightsTitle: {
    id: 'dir.application:dataCollectionTeachersRightsTitle',
    defaultMessage: 'Staðfesting á réttindum',
    description: 'Data provider title',
  },
  dataCollectionTeachersRightsSubtitle: {
    id: 'dir.application:dataCollectionTeachersRightsSubtitle',
    defaultMessage:
      'Við munum sækja skráningu þína úr ökuskírteinaskrá til að athuga hvort þú hafir sannarlega ökukennararéttindi.',
    description: 'Data provider subtitle',
  },

  /* Students Overview Table Section */
  studentsOverviewSideTitle: {
    id: 'dir.application:studentsOverviewSideTitle',
    defaultMessage: 'Skráningar',
    description: 'Students overview page sidebar title',
  },
  studentsOverviewTitle: {
    id: 'dir.application:studentsOverviewTitle',
    defaultMessage: 'Mínir ökunemar',
    description: 'Students overview page title',
  },
  studentsOverviewSearchLabel: {
    id: 'dir.application:studentsOverviewSearchLabel',
    defaultMessage: 'Leita að ökunema',
    description: 'Students overview search placeholder',
  },
  studentsOverviewSearchPlaceholder: {
    id: 'dir.application:studentsOverviewSearchPlaceholder',
    defaultMessage: 'Slá inn nafn eða kennitölu',
    description: 'Students overview search placeholder',
  },
  studentsOverviewRegisterHoursForOtherStudent: {
    id: 'dir.application:studentsOverviewRegisterHoursForOtherStudent',
    defaultMessage: 'Skrá tíma á aðra ökunema en mína',
    description: 'Students overview button',
  },
  studentsOverviewTableHeaderCol1: {
    id: 'dir.application:studentsOverviewTableHeaderCol1',
    defaultMessage: 'Ökunemi',
    description: 'Table header 1',
  },
  studentsOverviewTableHeaderCol2: {
    id: 'dir.application:studentsOverviewTableHeaderCol2',
    defaultMessage: 'Kennitala',
    description: 'Table header 2',
  },
  studentsOverviewTableHeaderCol3: {
    id: 'dir.application:studentsOverviewTableHeaderCol3',
    defaultMessage: 'Tímar',
    description: 'Table header 3',
  },
  studentsOverviewRegisterHoursCancelButton: {
    id: 'dir.application:studentsOverviewRegisterHoursCancelButton',
    defaultMessage: 'Hætta við',
    description: 'Cancel button',
  },
  studentsOverviewRegisterHoursButton: {
    id: 'dir.application:studentsOverviewRegisterHoursButton',
    defaultMessage: 'Skrá',
    description: 'Register button',
  },
  studentsOverviewOtherStudentIdModalTitle: {
    id: 'dir.application:studentsOverviewOtherStudentIdModalTitle',
    defaultMessage: 'Upplýsingar um ökunema',
    description: 'Modal title',
  },
  studentsOverviewOtherStudentIdModalDescription: {
    id: 'dir.application:studentsOverviewOtherStudentIdDecription',
    defaultMessage: 'Sláðu inn kennitölu ökunema',
    description: 'Modal description',
  },
  studentsOverviewOtherStudentInputLabel: {
    id: 'dir.application:studentsOverviewOtherStudentIdModalDecription',
    defaultMessage: 'Kennitala ökunema',
    description: 'Input id',
  },
  studentsOverviewOtherStudentRegisterButton: {
    id: 'dir.application:studentsOverviewOtherStudentRegisterButton',
    defaultMessage: 'Skrá ökutima',
    description: 'Button ',
  },
  studentsOverviewNoStudentFound: {
    id: 'dir.application:studentsOverviewNoStudentFound',
    defaultMessage: 'Enginn ökunemi fannst',
    description: 'No students',
  },
  studentsOverviewNoStudentFoundInModal: {
    id: 'dir.application:studentsOverviewNoStudentFoundInModal',
    defaultMessage: 'Enginn ökunemi skráður á eftirfarandi kennitölu',
    description: 'No students error in modal',
  },
  studentsOverviewBTab: {
    id: 'dir.application:studentsOverviewBTab',
    defaultMessage: 'Almenn ökuréttindi',
    description: 'Tab title for B license',
  },
  studentsOverviewBETab: {
    id: 'dir.application:studentsOverviewBETab',
    defaultMessage: 'Kerruréttindi',
    description: 'Tab title for BE license',
  },

  /* View Single Student Section */
  viewStudentTitle: {
    id: 'dir.application:viewStudentTitle',
    defaultMessage: 'Ökunámsbók',
    description: 'Registration page title',
  },
  viewBEStudentTitle: {
    id: 'dir.application:viewBEStudentTitle',
    defaultMessage: 'Ökunámsbók - Kerruréttindi BE',
    description: 'Registration page title',
  },
  viewStudentName: {
    id: 'dir.application:viewStudentName',
    defaultMessage: 'Ökunemi',
    description: 'Student name',
  },
  viewStudentNationalId: {
    id: 'dir.application:viewStudentNationalId',
    defaultMessage: 'Kennitala',
    description: 'Student national id',
  },
  viewStudentCompleteHours: {
    id: 'dir.application:viewStudentCompleteHours',
    defaultMessage: 'Kennslustundum lokið',
    description: 'Student complete hours',
  },
  viewStudentPracticeDrivingButton: {
    id: 'dir.application:viewStudentPracticeDrivingButton',
    defaultMessage: 'Veita æfingarakstursleyfi',
    description: 'Student complete hours',
  },
  studentMayPracticeAlertTitle: {
    id: 'dir.application:studentMayPracticeAlertTitle',
    defaultMessage: 'Æfingaakstur staðfestur',
    description: '',
  },
  studentMayPracticeAlertMessage: {
    id: 'dir.application:studentMayPracticeAlertMessage',
    defaultMessage: 'Auka texti ef þarf',
    description: '',
  },
  viewStudentRegisterDrivingLesson: {
    id: 'dir.application:viewStudentRegisterDrivingLesson',
    defaultMessage: 'Skrá ökutíma',
    description: 'Register mintutes',
  },
  viewStudentRegisterMinutes: {
    id: 'dir.application:viewStudentRegisterMinutes',
    defaultMessage: 'Mínútufjöldi',
    description: 'Register mintutes',
  },
  viewStudentInputMinutes: {
    id: 'dir.application:viewStudentInputMinutes',
    defaultMessage: 'Slá inn fjölda',
    description: 'Register mintutes',
  },
  viewStudentSelectDateLabel: {
    id: 'dir.application:viewStudentSelectDateLabel',
    defaultMessage: 'Dagsetning',
    description: 'Datepicker label',
  },
  viewStudentSelectDatePlaceholder: {
    id: 'dir.application:viewStudentSelectDatePlaceholder',
    defaultMessage: 'Veldu dagsetningu',
    description: 'Datepicker placeholder',
  },
  viewStudentDeleteRegistration: {
    id: 'dir.application:viewStudentDeleteRegistration',
    defaultMessage: 'Eyða skráningu',
    description: 'Delete registration button',
  },
  saveEditRegistration: {
    id: 'dir.application:saveEditRegistration',
    defaultMessage: 'Breyta',
    description: '',
  },
  saveStudentRegistration: {
    id: 'dir.application:saveStudentRegistration',
    defaultMessage: 'Vista skráða ökutíma',
    description: '',
  },
  viewStudentEditRegistration: {
    id: 'dir.application:viewStudentEditRegistration',
    defaultMessage: 'Breyta',
    description: 'Edit registration button',
  },
  stopEditingRegistration: {
    id: 'dir.application:stopEditingRegistration',
    defaultMessage: 'Hætta',
    description: '',
  },
  viewStudentTableHeaderCol1: {
    id: 'dir.application:viewStudentTableHeaderCol1',
    defaultMessage: 'Dags.',
    description: 'Table header col 1',
  },
  viewStudentTableHeaderCol2: {
    id: 'dir.application:viewStudentTableHeaderCol2',
    defaultMessage: 'Kennari',
    description: 'Table header col 2',
  },
  viewStudentTableHeaderCol3: {
    id: 'dir.application:viewStudentTableHeaderCol3',
    defaultMessage: 'Mínútur',
    description: 'Table header col 3',
  },
  schoolsTitle: {
    id: 'dir.application:schoolsTitle',
    defaultMessage: 'Ökuskólar',
    description: '',
  },
  schoolDate: {
    id: 'dir.application:schoolDate',
    defaultMessage: 'Dags.',
    description: '',
  },
  school: {
    id: 'dir.application:school',
    defaultMessage: 'Skóli',
    description: '',
  },
  schoolStatus: {
    id: 'dir.application:schoolStatus',
    defaultMessage: 'Staða',
    description: '',
  },
  completedTests: {
    id: 'dir.application:completedTests',
    defaultMessage: 'Próf',
    description: '',
  },
  completedTestDate: {
    id: 'dir.application:completedTestDate',
    defaultMessage: 'Dags.',
    description: '',
  },
  completedTestType: {
    id: 'dir.application:completedTestType',
    defaultMessage: 'Tegund',
    description: '',
  },
  completedTestResult: {
    id: 'dir.application:completedTestResult',
    defaultMessage: 'Staða',
    description: '',
  },
  statusPass: {
    id: 'dir.application:statusPass',
    defaultMessage: 'Lokið',
    description: '',
  },
  statusFail: {
    id: 'dir.application:statusFail',
    defaultMessage: 'Fallið',
    description: '',
  },
  viewStudentGoBackToOverviewButton: {
    id: 'dir.application:viewStudentGoBackToOverviewButton',
    defaultMessage: 'Til baka',
    description: 'Go back button',
  },
  viewStudentInputMinutesLabel: {
    id: 'dir.application:viewStudentInputMinutesLabel',
    defaultMessage: 'Slá inn mínútur',
    description: 'Input field label',
  },
  errorOnGettingStudentTitle: {
    id: 'dir.application:errorOnGettingStudentTitle',
    defaultMessage: 'Ökunemi fannst ekki eða er ekki með virka ökunámsbók.',
    description: 'Error on input minutes',
  },
  errorOnInputMinutes: {
    id: 'dir.application:errorOnInputMinutes',
    defaultMessage: 'Max mínútufjöldi er 1000',
    description: 'Error on input minutes',
  },
  errorOnMissingDate: {
    id: 'dir.application:errorOnMissingDate',
    defaultMessage: 'Veldu dagsetningu',
    description: 'Error on missing date',
  },
  errorOnRegisterLesson: {
    id: 'dir.application:errorOnRegisterLesson',
    defaultMessage: 'Ekki tókst að skrá ökutíma. Vínsamlegast reyndu aftur.',
    description: 'Error on register lesson',
  },
  errorOnEditLesson: {
    id: 'dir.application:errorOnEditLesson',
    defaultMessage: 'Ekki tókst að breyta ökutíma. Vínsamlegast reyndu aftur.',
    description: 'Error on edit lesson',
  },
  errorOnDeleteLesson: {
    id: 'dir.application:errorOnDeleteLesson',
    defaultMessage: 'Ekki tókst að eyða skráningu. Vínsamlegast reyndu aftur.',
    description: 'Error on delete lesson',
  },
  errorOnAllowPracticeDriving: {
    id: 'dir.application:errorOnAllowPracticeDriving',
    defaultMessage:
      'Ekki tókst að leyfa æfingarakstur. Vínsamlegast reyndu aftur.',
    description: 'Error on edit lesson',
  },
  successOnRegisterLesson: {
    id: 'dir.application:successOnRegisterLesson',
    defaultMessage: 'Skráning tókst!',
    description: 'Error on register lesson',
  },
  successOnEditLesson: {
    id: 'dir.application:successOnEditLesson',
    defaultMessage: 'Breyting tókst!',
    description: 'Success message on edit lesson',
  },
  successOnDeleteLesson: {
    id: 'dir.application:successOnDeleteLesson',
    defaultMessage: 'Tókst að eyða út skráningu!',
    description: 'Success message on delete lesson',
  },
  successOnAllowPracticeDriving: {
    id: 'dir.application:successOnAllowPracticeDriving',
    defaultMessage: 'Tókst að veita æfingarakstursleyfi!',
    description: 'Success message on delete lesson',
  },
})
