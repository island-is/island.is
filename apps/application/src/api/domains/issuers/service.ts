import Issuer from './model'

export const getIssuer = (ssn: string) => Issuer.findOne({ where: { ssn } })

export const createIssuer = (ssn: string) => Issuer.create({ ssn })
