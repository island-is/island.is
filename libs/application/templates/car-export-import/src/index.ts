import template from './lib/template'

export default template
export const getFields = () => import('./fields/')
export type { VehicleWithMileage, VehiclesResponse } from './lib/types'
export { SERVER_SIDE_VEHICLE_THRESHOLD } from './lib/types'
