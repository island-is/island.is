import template from './lib/AnonymityInVehicleRegistryTemplate'
import { AnonymityInVehicleRegistry } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')

export type AnonymityInVehicleRegistryAnswers = AnonymityInVehicleRegistry

export default template
