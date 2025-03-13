import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'aosh.sr.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  requiredValidMachine: {
    id: 'aosh.sr.application:error.requiredValidMachine',
    defaultMessage: 'Tæki þarf að vera gilt',
    description: 'Error message if the machine chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'aosh.sr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  couldNotUpdateApplication: {
    id: 'aosh.sr.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'aosh.sr.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  minAgeNotFulfilled: {
    id: 'aosh.sr.application:error.minAgeNotFulfilled',
    defaultMessage:
      'Lágmarksaldur til að taka þátt í tilkynnu um eigendaskipti er 18 ára',
    description: 'Min age not fulfilled error',
  },
  failedToFetchData: {
    id: 'aosh.sr.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'aosh.sr.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
  errorGetFromAOSH: {
    id: 'aosh.sr.application:error.errorGetFromAOSH',
    defaultMessage: 'Ekki tókst að sækja gögn frá Vinnueftirlitinu',
    description: 'Failed to fetch data from AOSH',
  },
})
