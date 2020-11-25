import PassportTemplate from './lib/PassportTemplate'
import { ExampleSucceeds } from '@island.is/application/data-providers'

export const getDataProviders = () => Promise.resolve({ ExampleSucceeds })
export default PassportTemplate
