import { ExampleSucceeds } from '@island.is/application/data-providers'

import PassportTemplate from './lib/PassportTemplate'

export const getDataProviders = () => Promise.resolve({ ExampleSucceeds })
export default PassportTemplate
