import { UserInputError } from 'apollo-server-express'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { authorize } from '../auth'
import * as userService from './service'
import { CreateUserApplicationInput } from '../../types'
import { environment } from '../../environments'

const { production } = environment

const onlyOnDev = () => {
  if (production) {
    throw new Error('This feature is not enabled on production.')
  }
}

class UserResolver {
  @authorize()
  public async getUserApplication(
    _1,
    _2,
    { user, dataSources: { applicationApi } },
  ) {
    onlyOnDev()

    const application = await userService.getApplication(
      user.ssn,
      applicationApi,
    )
    if (!application) {
      return null
    }
    return {
      id: application.id,
      mobileNumber: application.data.mobileNumber,
      countryCode: application.data.countryCode,
    }
  }

  @authorize()
  public async createUserApplication(
    _1,
    { input }: { input: CreateUserApplicationInput },
    { user, dataSources: { applicationApi } },
  ) {
    onlyOnDev()

    // TODO check if user is eligible for ferdagjof (age, etc.)

    const mobile = user.mobile || input.mobile
    if (!mobile) {
      throw new UserInputError('Mobile number is required')
    }
    const phone = parsePhoneNumberFromString(mobile, 'IS')
    if (!phone.isValid()) {
      throw new UserInputError('Mobile number is invalid')
    }
    const application = await userService.createApplication(
      user.ssn,
      phone.nationalNumber.toString(),
      `+${phone.countryCallingCode.toString()}`,
      applicationApi,
    )
    return {
      application: {
        id: application.id,
        mobileNumber: application.data.mobileNumber,
        countryCode: application.data.countryCode,
      },
    }
  }
}

const resolver = new UserResolver()
export default {
  Query: {
    userApplication: resolver.getUserApplication,
  },
  Mutation: {
    createUserApplication: resolver.createUserApplication,
  },
}
