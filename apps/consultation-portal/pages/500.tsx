import { Text } from '@island.is/island-ui/core'
import Layout from '../components/Layout/Layout'
import { ErrorScreen } from '../screens/Error/Error'

export const Errorpage = () => {
  const seo = {
    title: '500',
  }
  return (
    <Layout seo={seo}>
      <ErrorScreen statusCode={500} title="Afsakið hlé">
        <Text>
          Eitthvað fór úrskeiðis. Villan hefur verið skráð og unnið verður að
          viðgerð eins fljótt og auðið er.
        </Text>
      </ErrorScreen>
    </Layout>
  )
}
export default Errorpage
