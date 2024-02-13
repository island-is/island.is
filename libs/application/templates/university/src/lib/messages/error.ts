import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'uni.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  errorDataProvider: {
    id: 'uni.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  couldNotUpdateApplication: {
    id: 'uni.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'uni.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  failedToFetchData: {
    id: 'uni.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'uni.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
})
