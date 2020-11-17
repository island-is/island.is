import DocumentProviderOnboardingTemplate from './lib/DocumentProviderOnboardingTemplate'

import makeServer from './mirage-server'

makeServer()
export const getFields = () => import('./fields/')

export default DocumentProviderOnboardingTemplate
