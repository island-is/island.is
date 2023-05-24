import { Text } from '@island.is/island-ui/core'
import { Layout } from '../../components'
import { ErrorScreen } from '../../screens/Error/Error'
import localization from './Error500.json'

export const Error500 = () => {
  const loc = localization.Error500
  return (
    <Layout seo={{ title: '500' }}>
      <ErrorScreen statusCode={500} title={loc.title}>
        <Text>{loc.text}</Text>
      </ErrorScreen>
    </Layout>
  )
}
export default Error500
