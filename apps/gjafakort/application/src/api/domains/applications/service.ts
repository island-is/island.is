import Application from './model'

export const getApplicationByIssuerAndType = (
  issuerSSN: string,
  type: string,
) =>
  Application.findOne({
    where: { type, issuerSSN },
  })

export const getApplicationById = (applicationId: string) =>
  Application.findOne({
    where: { id: applicationId },
  })

export const createApplication = (
  issuerSSN: string,
  type: string,
  state: string,
  data: object,
) => Application.create({ issuerSSN, type, state, data })

export const updateApplication = (
  application: Application,
  state: string,
  data: object,
) => {
  const mergedData = { ...application.data, ...data }
  return application.update({ state, data: mergedData })
}
