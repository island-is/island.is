import template from './lib/DigitalTachographCompanyCardTemplate'
import { DigitalTachographCompanyCard } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')

export type DigitalTachographCompanyCardAnswers = DigitalTachographCompanyCard

export default template
