import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'doi.cs.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  errorDataProvider: {
    id: 'doi.cs.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  couldNotUpdateApplication: {
    id: 'doi.cs.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'doi.cs.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  failedToFetchData: {
    id: 'doi.cs.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'doi.cs.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
  residenceInIcelandLastChangeDateMissing: {
    id: 'doi.cs.application:error.residenceInIcelandLastChangeDateMissing',
    defaultMessage:
      'Náði ekki að sækja dagsetningu fyrstu lögheimilisskráningu',
    description: 'Not able to fetch residence last change date',
  },
  noResidenceConditionPossible: {
    id: 'doi.cs.application:error.noResidenceConditionPossible',
    defaultMessage: 'Notandi uppfyllir ekki nein búsetuskilyrði',
    description: 'User does not fulfill any residence conditions',
  },
  notOldEnough: {
    id: 'doi.cs.application:error.notOldEnough',
    defaultMessage: 'Umsækjandi er ekki orðinn 18 ára',
    description: 'Applicant is not old enough',
  },
})
