import { Text } from '@island.is/island-ui/core'
import { Layout } from '../..'
import { CustomError } from '../../../components'
import localization from './Error500.json'

export const Error500 = () => {
  const loc = localization.Error500
  return (
    <Layout seo={{ title: '500' }}>
      <CustomError statusCode={500} title={loc.title}>
        <Text>{loc.text}</Text>
      </CustomError>
    </Layout>
  )
}
export default Error500
