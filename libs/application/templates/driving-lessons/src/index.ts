import DrivingLessonsTemplate from './lib/DrivingLessonsTemplate'
import { ExampleSucceeds } from '@island.is/application/data-providers'

export const getDataProviders = () => Promise.resolve({ ExampleSucceeds })
export default DrivingLessonsTemplate
