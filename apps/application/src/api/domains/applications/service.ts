import Application from './model'
import { States } from './consts'

export const getApplicationByIssuerAndType = (
  issuerSSN: string,
  type: string,
) =>
  Application.findOne({
    where: { type, issuerSSN },
  })

export const createApplication = (
  issuerSSN: string,
  type: string,
  data: object,
) => Application.create({ issuerSSN, data, type, state: States.NEW })
