import template from './lib/DigitalTachographWorkshopCardTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { DigitalTachographWorkshopCard } from './lib/dataSchema'
export type DigitalTachographWorkshopCardAnswers = DigitalTachographWorkshopCard

export default template
