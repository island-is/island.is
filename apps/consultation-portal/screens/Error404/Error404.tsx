import { Bullet, BulletList, LinkV2, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import { Layout } from '../../components'
import { ErrorScreen } from '../Error/Error'
import localization from './Error404.json'

export const Error404 = () => {
  const loc = localization.Error404
  return (
    <Layout seo={{ title: '404' }}>
      <ErrorScreen statusCode={404} title={loc.title}>
        <Text variant="h5" paddingBottom={3}>
          {loc.notFoundText}
        </Text>
        <div>
          <Text>{`${loc.text}:`}</Text>
          <BulletList>
            <Bullet>{loc.bulletOne}</Bullet>
            <Bullet>{loc.bulletTwo}</Bullet>
            <Bullet>{loc.bulletThree}</Bullet>
            <Bullet>{loc.bulletFour}</Bullet>
          </BulletList>{' '}
          <Text>
            {loc.textAfterBullets}
            <Link href="https://island.is/samradsgatt" legacyBehavior>
              {loc.linkText}
            </Link>
            <br />
            {loc.textAfterBreak}
            <LinkV2 href="mailto:samradsgatt@stjornarradid.is">
              {loc.email}
            </LinkV2>
          </Text>
        </div>
      </ErrorScreen>
    </Layout>
  )
}
export default Error404
