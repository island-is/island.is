import Issuer from './model'

export const getIssuer = (ssn: string): Issuer =>
  Issuer.findOne({ where: { ssn } })

export const createIssuer = (ssn: string): Issuer => Issuer.create({ ssn })
