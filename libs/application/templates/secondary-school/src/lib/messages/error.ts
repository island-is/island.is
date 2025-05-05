import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'ss.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  errorValidateCanCreateTitle: {
    id: 'ss.application:error.errorValidateCanCreateTitle',
    defaultMessage: 'Ekki er hægt að opna nýja umsókn',
    description: 'Error validate can create title',
  },
  errorValidateCanCreateDescription: {
    id: 'ss.application:error.errorValidateCanCreateDescription',
    defaultMessage:
      'Þú ert með aðra opna umsókn í gangi, vinsamlegast eyðið henni áður en opnað er nýja umsókn',
    description: 'Error validate can create description',
  },
  errorNoSchoolOpenForAdmissionTitle: {
    id: 'ss.application:error.errorNoSchoolOpenForAdmissionTitle',
    defaultMessage: 'Ekki er hægt að opna nýja umsókn ',
    description: 'Error no school open for admission title',
  },
  errorNoSchoolOpenForAdmissionDescription: {
    id: 'ss.application:error.errorNoSchoolOpenForAdmissionDescription',
    defaultMessage: 'Það er enginn skóli með opið fyrir umsóknir eins og er',
    description: 'Error no school open for admission description',
  },
  errorPastRegistrationDateTitle: {
    id: 'ss.application:error.errorPastRegistrationDateTitle',
    defaultMessage: 'Athugið',
    description: 'Error past registration date title',
  },
  errorPastRegistrationDateDescription: {
    id: 'ss.application:error.errorPastRegistrationDateDescription',
    defaultMessage:
      'Ekki er hægt að senda inn umsókn, þar sem umsóknartímabilinu hefur lokið',
    description: 'Error past registration date title',
  },
  errorSubmitApplicationTitle: {
    id: 'ss.application:error.errorSubmitApplicationTitle',
    defaultMessage: 'Ekki er tókst að senda inn umsókn',
    description: 'Error submit application title',
  },
  errorSubmitApplicationDescription: {
    id: 'ss.application:error.errorSubmitApplicationDescription',
    defaultMessage:
      'Ekki tókst að senda inn umsókn, vinsamlegast reyndu síðar..',
    description: 'Error submit application description',
  },
  errorSameAsApplicant: {
    id: 'ss.application:error.errorSameAsApplicant',
    defaultMessage: 'Má ekki vera sá sami og umsækjandi',
    description: 'Error same as applicant',
  },
  errorSchoolDuplicate: {
    id: 'ss.application:error.errorSchoolDuplicate',
    defaultMessage: 'Ekki má velja sama skóla',
    description: 'Error school duplicate',
  },
  errorProgramDuplicate: {
    id: 'ss.application:error.errorProgramDuplicate',
    defaultMessage: 'Ekki má velja sömu braut',
    description: 'Error program duplicate',
  },
})
