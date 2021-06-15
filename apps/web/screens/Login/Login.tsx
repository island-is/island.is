import React from 'react'
import {
  GridContainer,
  Box,
  GridColumn,
  GridRow,
  Link,
  Text,
  Icon,
  BulletList,
  Bullet,
  ContentBlock,
  Tag,
} from '@island.is/island-ui/core'
import * as styles from './Login.treat'
import { LoginPageTexts } from '../../components/Login/LoginTexts.types'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { GET_NAMESPACE_QUERY } from '../queries'

interface LoginProps {
  namespace: LoginPageTexts
}

const LoginPage: Screen<LoginProps> = ({ namespace }) => {
  const n = useNamespace(namespace)

  const oldListItems: string[] = n('gomluSidurList', [
    'Sjá Pósthólf',
    'Þínar Upplýsingar',
    'Fjármál',
    'Starfsleyfi kennara',
    'Samræmd könnunarpróf',
  ])

  const newListItems: string[] = n('nyjuSidurList', [
    'Sjá Pósthólf',
    'Þínar Upplýsingar',
    'Fjármál',
    'Starfsleyfi kennara',
    'Samræmd könnunarpróf',
  ])

  const oldListItemsArray = Array.isArray(oldListItems) ? oldListItems : []
  const newListItemsArray = Array.isArray(newListItems) ? newListItems : []
  return (
    <ContentBlock>
      <Box paddingX={[0, 4, 4, 12]} paddingY={[2, 2, 10]} id="main-content">
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Text as="h1" variant="h1" marginBottom="p3">
                {n('gomluSidurTitle', 'Gömlu mínar síður')}
              </Text>
              <Text as="p" variant="intro" marginBottom="p5">
                {n(
                  'gomluSidurText',
                  'Gömlu mínar síður á ísland.is. Hér er hægt að nálgast gömlu útgáfuna af mínum síðum með öllum þeim möguleikum sem þar eru í boði.',
                )}
              </Text>
              <Link
                href="//minarsidur.island.is/"
                color="blue400"
                underline="normal"
                underlineVisibility="always"
                newTab
              >
                {n('gomluSidurLink', 'Fara á gömlu mínar síður')}{' '}
                <Icon icon="open" type="outline" />
              </Link>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Box
                flexDirection="column"
                display="flex"
                alignItems={['flexStart', 'flexStart', 'center']}
                height="full"
              >
                {oldListItemsArray.length > 0 ? (
                  <div>
                    <Text as="h3" variant="h3" marginBottom="p3">
                      {n('gomluSidurListTitle', 'Á gömlu mínum síðum')}
                    </Text>
                    <BulletList type="ul">
                      {oldListItemsArray.map((li) => (
                        <Bullet key={li}>{li}</Bullet>
                      ))}
                    </BulletList>
                  </div>
                ) : null}
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow marginTop="containerGutter">
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Tag disabled>{n('nyjuSidurTag', 'Beta útgáfa')}</Tag>
              <Text as="h2" variant="h1" marginBottom="p3" marginTop="p1">
                {n('nyjuSidurTitle', 'Ný útgáfa af mínum síðum á island.is')}
              </Text>
              <Text as="p" variant="intro" marginBottom="p5">
                {n(
                  'nyjuSidurText',
                  'Ný útgáfa minna síðna á ísland.is. Hér er um að ræða beta útgáfu að nýjum mínum síðum, ekki eru allir möguleikar sem eru á gömlu mínum síðum í boði hér ennþá.',
                )}
              </Text>
              <a className={styles.link} href="/minarsidur">
                {n('nyjuSidurLink', 'Fara á nýju mínar síður')}
              </a>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Box
                flexDirection="column"
                display="flex"
                alignItems={['flexStart', 'flexStart', 'center']}
                height="full"
              >
                {newListItemsArray.length > 0 ? (
                  <div>
                    <Text as="h3" variant="h3" marginBottom="p3">
                      {n('nyjuSidurListTitle', 'Á nýjum mínum síðum')}
                    </Text>
                    <BulletList type="ul">
                      {newListItemsArray.map((li) => (
                        <Bullet key={li}>{li}</Bullet>
                      ))}
                    </BulletList>
                  </div>
                ) : null}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </ContentBlock>
  )
}

LoginPage.getInitialProps = async ({ apolloClient, locale }) => {
  const [namespace] = await Promise.all([
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Innskraning',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        JSON.parse(variables?.data?.getNamespace?.fields || '[]'),
      ),
  ])

  return {
    namespace,
  }
}

export default withMainLayout(LoginPage)
