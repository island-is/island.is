import template from './lib/AnonymityInVehicleRegistryTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { AnonymityInVehicleRegistry } from './lib/dataSchema'
export type AnonymityInVehicleRegistryAnswers = AnonymityInVehicleRegistry

export default template
