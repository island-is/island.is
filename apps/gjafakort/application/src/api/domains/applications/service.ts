import merge from 'lodash/merge'
import isArray from 'lodash/isArray'
import Application from './model'

export const getApplicationByIssuerAndType = (
  issuerSSN: string,
  type: string,
): Application =>
  Application.findOne({
    where: { type, issuerSSN },
  })

export const getApplicationById = (applicationId: string): Application =>
  Application.findOne({
    where: { id: applicationId },
  })

export const createApplication = (
  issuerSSN: string,
  type: string,
  state: string,
  data: object,
): Application => Application.create({ issuerSSN, type, state, data })

export const updateApplication = (
  application: Application,
  state: string,
  data: object,
): Application => {
  const mergedData = merge(application.data, data, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue)
    }
  })
  return application.update({ state, data: mergedData })
}
