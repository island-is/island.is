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
      'Við munum sækja skráningu þína úr ökuskírteinaskrá til að athuga hvort þú hafi sannarlega ökukennararéttindi.',
    description: 'Data provider subtitle',
  },

  /* Students Overview Table Section */
  studentsOverviewTitle: {
    id: 'dir.application:studentsOverviewTitle',
    defaultMessage: 'Mínir ökunemar',
    description: 'Students overview page title',
  },
  studentsOverviewSearchPlaceholder: {
    id: 'dir.application:studentsOverviewSearchPlaceholder',
    defaultMessage: 'Leitaðu að nafni eða kennitölu',
    description: 'Students overview search placeholder',
  },
  studentsOverviewRegisterHoursForOtherStudent: {
    id: 'dir.application:studentsOverviewRegisterHoursForOtherStudent',
    defaultMessage: 'Skrá tíma á aðra ökunema en mína',
    description: 'Students overview button',
  },
  studentsOverviewTableHeaderCol1: {
    id: 'dir.application:studentsOverviewTableHeaderCol1',
    defaultMessage: 'Nemandi',
    description: 'Table header 1',
  },
  studentsOverviewTableHeaderCol2: {
    id: 'dir.application:studentsOverviewTableHeaderCol2',
    defaultMessage: 'Kennitala',
    description: 'Table header 2',
  },
  studentsOverviewTableHeaderCol3: {
    id: 'dir.application:studentsOverviewTableHeaderCol3',
    defaultMessage: 'Kennslustundir',
    description: 'Table header 3',
  },
  studentsOverviewRegisterHoursCancelButton: {
    id: 'dir.application:studentsOverviewRegisterHoursCancelButton',
    defaultMessage: 'Hætta við',
    description: 'Cancel button',
  },
  studentsOverviewRegisterHoursButton: {
    id: 'dir.application:studentsOverviewRegisterHoursButton',
    defaultMessage: 'Skrá ökutíma',
    description: 'Register button',
  },
  studentsOverviewOtherStudentIdModalTitle: {
    id: 'dir.application:studentsOverviewOtherStudentIdModalTitle',
    defaultMessage: 'Upplýsingar um ökunema',
    description: 'Modal title',
  },
  studentsOverviewOtherStudentIdModalDescription: {
    id: 'dir.application:studentsOverviewOtherStudentIdDecription',
    defaultMessage: 'Sláðu inn kennitölu nemanda',
    description: 'Modal description',
  },
  studentsOverviewOtherStudentInputLabel: {
    id: 'dir.application:studentsOverviewOtherStudentIdModalDecription',
    defaultMessage: 'Kennitala umsækjanda',
    description: 'Input id',
  },
  studentsOverviewNoStudentFound: {
    id: 'dir.application:studentsOverviewNoStudentFound',
    defaultMessage: 'Enginn nemandi fannst',
    description: 'No students',
  },

  /* View Single Student Section */
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
  viewStudentCompleteSchools: {
    id: 'dir.application:viewStudentCompleteSchools',
    defaultMessage: 'Ökuskólum lokið',
    description: 'Student complete schools',
  },
  viewStudentExamsComplete: {
    id: 'dir.application:viewStudentExamsComplete',
    defaultMessage: 'Skriflegum prófum lokið',
    description: 'Student complete exams',
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
  viewStudentSelectRegisterButton: {
    id: 'dir.application:viewStudentSelectRegisterButton',
    defaultMessage: 'Vista',
    description: 'Register button',
  },
  viewStudentDeleteRegistration: {
    id: 'dir.application:viewStudentDeleteRegistration',
    defaultMessage: 'Eyða skráningu',
    description: 'Delete registration button',
  },
  viewStudentEditRegistration: {
    id: 'dir.application:viewStudentEditRegistration',
    defaultMessage: 'Breyta skráningu',
    description: 'Edit registration button',
  },
  viewStudentTableHeaderCol1: {
    id: 'dir.application:viewStudentTableHeaderCol1',
    defaultMessage: 'Dagsetning',
    description: 'Table header col 1',
  },
  viewStudentTableHeaderCol2: {
    id: 'dir.application:viewStudentTableHeaderCol2',
    defaultMessage: 'Ökukennari',
    description: 'Table header col 2',
  },
  viewStudentTableHeaderCol3: {
    id: 'dir.application:viewStudentTableHeaderCol3',
    defaultMessage: 'Mínútur skráðar',
    description: 'Table header col 3',
  },
  viewStudentGoBackToOverviewButton: {
    id: 'dir.application:viewStudentGoBackToOverviewButton',
    defaultMessage: 'Til baka',
    description: 'Go back button',
  },
})
