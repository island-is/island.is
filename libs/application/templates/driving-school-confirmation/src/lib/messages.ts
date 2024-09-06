import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'dsc.application:applicationTitle',
    defaultMessage: 'Skráningar ökuskóla',
    description: 'Application for Driving School Confirmation',
  },
  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'dsc.application:applicationDataCollectionTitle',
    defaultMessage: 'Forsendur skráningar ökuskóla',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'dsc.application:dataCollectionSubtitle',
    defaultMessage:
      'Upplýsingar um hvort réttindi til skráningar ökuskóla verða sóttar til Samgöngustofu',
    description: 'Subtitle for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'dsc.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionConfirmationRightsTitle: {
    id: 'dsc.application:dataCollectionConfirmationRightsTitle',
    defaultMessage: 'Staðfesting á skráningarréttindum',
    description: 'Data provider title',
  },
  dataCollectionConfirmationRightsSubtitle: {
    id: 'dsc.application:dataCollectionConfirmationRightsSubtitle',
    defaultMessage:
      'Við munum sækja skráningu þína frá Samgöngustofu til að athuga hvort þú hafir sannarlega réttindi til skráningar ökuskóla',
    description: 'Data provider subtitle',
  },
  dataCollectionNoRightsError: {
    id: 'dsc.application:dataCollectionNoRightsError',
    defaultMessage:
      'Þú hefur ekki skráningarréttindi ökuskóla. Vinsamlega hafðu samband við næsta sýslumannsembætti ef þú telur um villu vera að ræða',
    description: 'Data provider no teaching rights error',
  },

  /* Student Info Section */
  studentInfoTitle: {
    id: 'dsc.application:studentInfoTitle',
    defaultMessage: 'Upplýsingar um ökunema',
    description: 'Student info section title',
  },
  studentInfoSubtitle: {
    id: 'dsc.application:studentInfoSubtitle',
    defaultMessage:
      'Vinsamlega skráðu inn upplýsingar um ökunema. Athugaðu að þú ert að skrá fyrir: ',
    description: 'Student info section subtitle',
  },
  studentInfoNationalId: {
    id: 'dsc.application:studentInfoNationalId',
    defaultMessage: 'Kennitala umsækjanda',
    description: 'Student info national id',
  },
  studentInfoEmail: {
    id: 'dsc.application:studentInfoEmail',
    defaultMessage: 'Netfang umsækjanda',
    description: 'Student info email',
  },

  /* Confirmation Section */
  confirmationSectionTitle: {
    id: 'dsc.application:confirmationSectionTitle',
    defaultMessage: 'Staðfesta ökuskóla',
    description: 'Confirmation section title',
  },
  confirmationSectionName: {
    id: 'dsc.application:confirmationSectionName',
    defaultMessage: 'Ökunemi',
    description: 'Student name',
  },
  confirmationSectionNationalId: {
    id: 'dsc.application:confirmationSectionNationalId',
    defaultMessage: 'Kennitala',
    description: 'Student national id',
  },
  confirmationSectionCompleteHours: {
    id: 'dsc.application:confirmationSectionCompleteHours',
    defaultMessage: 'Kennslustundum lokið',
    description: 'Student complete hours',
  },
  confirmationSectionCompleteSchools: {
    id: 'dsc.application:confirmationSectionCompleteSchools',
    defaultMessage: 'Ökuskólum lokið',
    description: 'Student complete schools',
  },
  confirmationSectionExamsComplete: {
    id: 'dsc.application:confirmationSectionExamsComplete',
    defaultMessage: 'Skriflegum prófum lokið',
    description: 'Student complete exams',
  },
  confirmationSectionSelectDateLabel: {
    id: 'dsc.application:confirmationSectionSelectDateLabel',
    defaultMessage: 'Veldu dagsetningu',
    description: 'Datepicker label',
  },
  confirmationSectionSelectDatePlaceholder: {
    id: 'dsc.application:confirmationSectionSelectDatePlaceholder',
    defaultMessage: 'Áfanga lauk',
    description: 'Datepicker placeholder',
  },
  confirmationSectionSelectSchool: {
    id: 'dsc.application:confirmationSectionSelectSchool',
    defaultMessage: 'Veldu skóla',
    description: 'Select school title',
  },
  confirmationComplete: {
    id: 'dsc.application:confirmationComplete',
    defaultMessage: 'Skráning móttekin',
    description: 'Confirmation complete alert message',
  },
  confirmation: {
    id: 'dsc.application:confirmation',
    defaultMessage: 'Skráning',
    description: 'Title for school thats been confirmed',
  },
  school: {
    id: 'dsc.application:school',
    defaultMessage: 'Ökuskóli',
    description: 'school',
  },
  confirmSchoolButton: {
    id: 'dsc.application:confirmSchoolButton',
    defaultMessage: 'Staðfesta skráningu',
    description: 'school',
  },
  newConfirmSchoolButton: {
    id: 'dsc.application:newConfirmSchoolButton',
    defaultMessage: 'Ný skráning',
    description: 'new school confirmation',
  },

  /* Errors */
  noStudentInfoFoundMessage: {
    id: 'dsc.application:noStudentInfoFoundMessage',
    defaultMessage:
      'Tókst ekki að sækja upplýsingar um ökunema. Vinsamlegast reynið aftur síðar',
    description: 'No student found alert message',
  },
  noStudentFoundForGivenNationalIdMessage: {
    id: 'dsc.application:noStudentFoundForGivenNationalIdMessage',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description: 'No name for given national Id',
  },
  invalidNationalIdValue: {
    id: 'dsc.application:error.invalidNationalIdValue',
    defaultMessage: 'Kennitala er ekki á réttu sniðmáti',
    description: 'Error message when a value is invalid.',
  },
})
