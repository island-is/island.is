import template from './lib/DigitalTachographDriversCardTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { DigitalTachographDriversCard } from './lib/dataSchema'
export type DigitalTachographDriversCardAnswers = DigitalTachographDriversCard

export default template
