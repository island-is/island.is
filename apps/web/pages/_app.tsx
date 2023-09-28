import '@island.is/api/mocks'
import { globalStyles } from '@island.is/island-ui/core'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import App from 'next/app'

globalStyles()

export default App

// export const MyApp = () => (
//   <FeatureFlagProvider sdkKey="YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA">
//     <App />
//   </FeatureFlagProvider>
// )

// export default MyApp
