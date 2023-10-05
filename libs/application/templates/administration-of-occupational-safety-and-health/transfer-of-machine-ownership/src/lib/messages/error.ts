import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'aosah.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  requiredValidVehicle: {
    id: 'aosah.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'aosah.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  noInsuranceSelected: {
    id: 'aosah.application:error.nothingSelected',
    defaultMessage: 'Vinsamlega veldu tryggingarfélag',
    description: 'If no insurance is selected',
  },
  couldNotUpdateApplication: {
    id: 'aosah.application:error.couldNotUpdateApplication',
    defaultMessage: 'Ekki tókst að uppfæra umsókn, vinsamlegast reynið aftur',
    description: 'Could not update the application answers',
  },
  fillInValidInput: {
    id: 'aosah.application:error.fillInValidInput',
    defaultMessage: 'Vinsamlegast fylltu inn gilt gildi',
    description: 'Need to fill in valid input',
  },
  minAgeNotFulfilled: {
    id: 'aosah.application:error.minAgeNotFulfilled',
    defaultMessage:
      'Lágmarksaldur til að taka þátt í tilkynnu um eigendaskipti er 18 ára',
    description: 'Min age not fulfilled error',
  },
  failedToFetchData: {
    id: 'aosah.application:error.failedToFetchData',
    defaultMessage: 'Ekki tókst að sækja gögn',
    description: 'Failed to fetch data error',
  },
  submitApplicationError: {
    id: 'aosah.application:error.submitApplicationError',
    defaultMessage: 'Villa kom upp við að skila inn umsókn',
    description: 'Failed to submit application',
  },
})
