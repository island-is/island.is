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

const validateMobile = (mobile: string) => {
  if (!mobile) {
    throw new UserInputError('Mobile number is required')
  }
  const phone = parsePhoneNumberFromString(mobile, 'IS')
  if (!phone.isValid()) {
    throw new UserInputError('Mobile number is invalid')
  }
  return {
    mobileNumber: phone.nationalNumber.toString(),
    countryCode: `+${phone.countryCallingCode.toString()}`,
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
    const { mobileNumber, countryCode } = validateMobile(mobile)
    const application = await userService.createApplication(
      user.ssn,
      mobileNumber,
      countryCode,
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

  @authorize()
  public async getGiftCards(_1, args, { user, dataSources: { yayApi } }) {
    onlyOnDev()

    const mobile = user.mobile || args.mobile
    const { mobileNumber, countryCode } = validateMobile(mobile)
    const giftCards = await yayApi.getGiftCards(mobileNumber, countryCode)
    return giftCards.map((giftCard) => ({
      giftCardId: giftCard.giftCardId,
      amount: giftCard.amount,
      applicationId: giftCard.identifier,
    }))
  }

  @authorize()
  public async getGiftCardCode(_1, args, { user, dataSources: { yayApi } }) {
    onlyOnDev()

    const mobile = user.mobile || args.mobile
    const { mobileNumber, countryCode } = validateMobile(mobile)
    const giftCardCode = await yayApi.getGiftCardCode(
      args.giftCardId,
      mobileNumber,
      countryCode,
    )
    return {
      code: giftCardCode.code,
      expiryDate: giftCardCode.expiryDate,
      pollingUrl: giftCardCode.pollingUrl,
    }
  }
}

const resolver = new UserResolver()
export default {
  Query: {
    giftCardCode: resolver.getGiftCardCode,
    giftCards: resolver.getGiftCards,
    userApplication: resolver.getUserApplication,
  },
  Mutation: {
    createUserApplication: resolver.createUserApplication,
  },
}
