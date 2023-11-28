import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'

import { answerValidators } from './answerValidators'
import { errorMessages } from './messages'

const createBaseApplication = (): Application => ({
  id: '',
  modified: new Date(),
  state: '',
  typeId: ApplicationTypes.EXAMPLE,
  status: ApplicationStatus.IN_PROGRESS,
  assignees: [],
  applicant: '0101307789',
  applicantActors: [],
  created: new Date(),
  externalData: {},
  answers: {
    vehicles: {
      selectedVehicles: [],
    },
  },
})

describe('answerValidators', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  it('should return an error if no vehicles are selected', () => {
    const newAnswers = {
      selectedVehicles: [],
    }

    expect(answerValidators['vehicles'](newAnswers, application)).toStrictEqual(
      {
        message: errorMessages.mustSelectACar,
        path: 'vehicles',
        values: undefined,
      },
    )
  })
})
