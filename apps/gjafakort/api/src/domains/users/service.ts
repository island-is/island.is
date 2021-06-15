import { logger } from '@island.is/logging'
import { UserApplication } from '@island.is/gjafakort/types'
import { ApplicationStates } from '@island.is/gjafakort/consts'
import cache from '../../extensions/cache'
import {
  ApplicationAPI,
  getVersionConfiguration,
  NovaAPI,
} from '../../services'

export const getApplication = async (
  userSSN: string,
  applicationApi: ApplicationAPI,
) => {
  const { type: applicationType } = await getVersionConfiguration()

  return applicationApi.getApplicationByType<UserApplication>(
    applicationType,
    userSSN,
  )
}

export const getApplications = async (applicationApi: ApplicationAPI) => {
  const { type: applicationType } = await getVersionConfiguration()

  return applicationApi.getApplications<UserApplication>(applicationType)
}

export const getApplicationCount = async (applicationApi: ApplicationAPI) => {
  const { type: applicationType } = await getVersionConfiguration()

  return applicationApi.getApplicationCount<UserApplication>(applicationType)
}

export const createApplication = async (
  userSSN: string,
  mobileNumber: string,
  countryCode: string,
  applicationApi: ApplicationAPI,
) => {
  const { type: applicationType } = await getVersionConfiguration()

  return applicationApi.createApplication<UserApplication>({
    applicationType,
    issuerSSN: userSSN,
    authorSSN: userSSN,
    state: ApplicationStates.APPROVED,
    data: { mobileNumber, countryCode, verified: true },
  })
}

export const updateApplication = (
  applicationId: string,
  userSSN: string,
  verified: boolean,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.updateApplication<UserApplication>({
    id: applicationId,
    authorSSN: userSSN,
    data: { verified },
  })
}

const getConfirmCacheKey = (ssn: string, mobile: string) =>
  `confirm.mobile.${ssn}.${mobile}`

export const sendConfirmCode = async (
  userSSN: string,
  mobileNumber: string,
  novaApi: NovaAPI,
) => {
  const confirmCodeLength = 6
  const confirmCode = Math.round(
    Math.random() * 10 ** confirmCodeLength,
  ).toString()

  const maxSmsAllowed = 20
  const smsSentCacheKey = `confirm.sms.sent.${userSSN}`
  const smsSent = parseInt(await cache.get(smsSentCacheKey), 10)
  if (smsSent > maxSmsAllowed) {
    throw new Error('User has exceeded the limit of sms sent')
  }

  const confirmCacheKey = getConfirmCacheKey(userSSN, mobileNumber)
  const ttlTenMinutes = 60 * 10
  await cache.set(confirmCacheKey, confirmCode)
  await cache.expire(confirmCacheKey, ttlTenMinutes)

  try {
    await novaApi.sendSms(mobileNumber, confirmCode)

    const ttlOneDay = 60 * 60 * 24
    await cache.set(smsSentCacheKey, (smsSent ? smsSent + 1 : 1).toString())
    await cache.expire(smsSentCacheKey, ttlOneDay)
  } catch (err) {
    logger.error(err)
    throw new Error('Failed sending sms')
  }
}

export const verifyConfirmCode = async (
  userSSN: string,
  mobileNumber: string,
  confirmCode: string,
): Promise<boolean> => {
  const cacheKey = getConfirmCacheKey(userSSN, mobileNumber)
  const expectedConfirmCode = await cache.get(cacheKey)
  if (!expectedConfirmCode || expectedConfirmCode !== confirmCode) {
    return false
  }
  return true
}
