import Issuer from './model'

export const getIssuer = (ssn: string): Promise<Issuer> =>
  Issuer.findOne({ where: { ssn } })

export const createIssuer = (ssn: string): Promise<Issuer> =>
  Issuer.create({ ssn })
