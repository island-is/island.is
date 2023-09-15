import template from './lib/DigitalTachographWorkshopCardTemplate'
import { DigitalTachographWorkshopCard } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type DigitalTachographWorkshopCardAnswers = DigitalTachographWorkshopCard

export default template
