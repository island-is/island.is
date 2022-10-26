import template from './lib/DigitalTachographCompanyCardTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { DigitalTachographCompanyCard } from './lib/dataSchema'
export type DigitalTachographCompanyCardAnswers = DigitalTachographCompanyCard

export default template
