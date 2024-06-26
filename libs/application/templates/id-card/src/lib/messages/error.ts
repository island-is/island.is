import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'id.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  errorDataProvider: {
    id: 'id.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  couldNotUpdateApplication: {
    id: 'id.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'id.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  failedToFetchData: {
    id: 'id.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'id.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
  invalidValue: {
    id: 'id.application:error.invalidValue',
    defaultMessage: 'Ógilt gildi.',
    description: 'Error message when a value is invalid.',
  },
  invalidAgeTitle: {
    id: 'id.application:error.invalidAgeTitle',
    defaultMessage: 'Þú hefur ekki náð tilskyldum aldri fyrir þessa umsókn',
    description: 'Error message when a value is invalid.',
  },
  invalidAgeDescription: {
    id: 'id.application:error.invalidAgeDescription',
    defaultMessage: 'Tilskyldur aldur fyrir þessa umsókn er 13 ára.',
    description: 'Error message when a value is invalid.',
  },
})
