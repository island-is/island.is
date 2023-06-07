import template from './lib/DigitalTachographCompanyCardTemplate'
import { DigitalTachographCompanyCard } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type DigitalTachographCompanyCardAnswers = DigitalTachographCompanyCard

export default template
