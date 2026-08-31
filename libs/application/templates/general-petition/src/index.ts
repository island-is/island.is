import GeneralPetitionTemplate from './lib/GeneralPetitionTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/messages'

export default GeneralPetitionTemplate
