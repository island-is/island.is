import { User } from '@island.is/auth-nest-tools'
import {
  Application,
  ApplicationState,
  Employment,
  FamilyStatus,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { uuid } from 'uuidv4'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: Application
  error: Error
}

type GivenWhenThen = (
  id: string,
  application: Application,
  user: User,
) => Promise<Then>

describe('ApplicationController - Get by id', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const { applicationController, applicationModel } =
      await createTestingApplicationModule()

    mockApplicationModel = applicationModel

    givenWhenThen = async (
      id: string,
      application: Application,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .getById(id, application, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('application', () => {
    const id = uuid()
    const user = {} as User
    const application: Application = {
      id: '',
      created: '',
      modified: '',
      nationalId: '',
      name: '',
      email: '',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      student: false,
      employment: Employment.WORKING,
      hasIncome: false,
      usePersonalTaxCredit: false,
      state: ApplicationState.NEW,
      familyStatus: FamilyStatus.COHABITATION,
      directTaxPayments: [],
      hasFetchedDirectTaxPayment: null,
      spouseHasFetchedDirectTaxPayment: null,
      municipalityCode: '',
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(id, application, user)
    })

    it('should return application', () => {
      expect(then.result).toEqual(application)
    })
  })
})
