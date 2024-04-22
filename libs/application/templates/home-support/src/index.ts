import HomeSupportTemplate from './lib/HomeSupportTemplate'
import { HomeSupport } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export type HomeSupportAnswers = HomeSupport

export default HomeSupportTemplate
