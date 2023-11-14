import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'ta.tvo.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  errorDataProvider: {
    id: 'ta.tvo.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  couldNotUpdateApplication: {
    id: 'ta.tvo.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'ta.tvo.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  failedToFetchData: {
    id: 'ta.tvo.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'ta.tvo.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
  residenceInIcelandLastChangeDateMissing: {
    id: 'ta.tvo.application:error.residenceInIcelandLastChangeDateMissing',
    defaultMessage:
      'Náði ekki að sækja dagsetningu fyrstu lögheimilisskráningu',
    description: 'Not able to fetch residence last change date',
  },
  noResidenceConditionPossible: {
    id: 'ta.tvo.application:error.noResidenceConditionPossible',
    defaultMessage: 'Notandi uppfyllir ekki nein búsetuskilyrði',
    description: 'User does not fulfill any residence conditions',
  },
})
