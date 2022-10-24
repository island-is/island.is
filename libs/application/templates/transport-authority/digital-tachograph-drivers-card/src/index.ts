import template from './lib/DigitalTachographDriversCardTemplate'

import { DigitalTachographDriversCard } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type DigitalTachographDriversCardAnswers = DigitalTachographDriversCard

export default template
