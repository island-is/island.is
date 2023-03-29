import { Bullet, BulletList, LinkV2, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import { ErrorScreen } from '../screens/Error/Error'

export const Errorpage = () => {
  const seo = {
    title: '404',
  }
  return (
    <Layout seo={seo}>
      <ErrorScreen statusCode={404} title="Afsakið hlé.">
        <Text variant="h5" paddingBottom={3}>
          Síða eða skjal fannst ekki.
        </Text>

        <Text>
          Eftirfarandi ástæður geta verið fyrir því að síða/skjal fannst ekki:
          <BulletList>
            <Bullet>Upplýsingar hafa verið fjarlægðar</Bullet>
            <Bullet>Vefslóð er ekki rétt skrifuð</Bullet>
            <Bullet>Síðan er ekki lengur til</Bullet>
            <Bullet>Villa er á síðunni</Bullet>
          </BulletList>{' '}
          Þú getur einnig prófað að leita að efninu á forsíðu{' '}
          <Link href="https://island.is/samradsgatt">samráðsgáttarinnar</Link>
          <br />
          Teljir þú að síða eða skjal eigi sannarlega að birtast má endilega
          senda ábendingu á netfangið{' '}
          <LinkV2 href="mailto:samradsgatt@stjornarradid.is">
            samradsgatt@stjornarradid.is
          </LinkV2>
        </Text>
      </ErrorScreen>
    </Layout>
  )
}
export default Errorpage
