import JointCustodyAgreementTemplate from './lib/JointCustodyAgreementTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './types'

export default JointCustodyAgreementTemplate
