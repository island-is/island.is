import { defineMessages } from 'react-intl'

export const error = defineMessages({
  nameByNationalId: {
    id: 'ta.tvo.application:error.nameByNationalId',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description:
      'Error message if there was no name associated with given national id',
  },
  requiredValidVehicle: {
    id: 'ta.tvo.application:error.requiredValidVehicle',
    defaultMessage: 'Ökutæki þarf að vera gilt',
    description: 'Error message if the vehicle chosen is invalid or not chosen',
  },
  errorDataProvider: {
    id: 'ta.tvo.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  noInsuranceSelected: {
    id: 'ta.tvo.application:error.nothingSelected',
    defaultMessage: 'Vinsamlega veldu tryggingarfélag',
    description: 'If no insurance is selected',
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
})
