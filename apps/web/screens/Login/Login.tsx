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
  Button,
  Tag,
  Hidden,
} from '@island.is/island-ui/core'
import { SvgLogin } from '@island.is/web/components'
import { LoginPageTexts } from '@island.is/web/components'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { Query, QueryGetNamespaceArgs } from '@island.is/api/schema'
import { webLoginButtonSelect } from '@island.is/plausible'
import { GET_NAMESPACE_QUERY } from '../queries'
import * as styles from './Login.css'

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

  const newListItemsArray = Array.isArray(newListItems) ? newListItems : []
  const oldListItemsArray = Array.isArray(oldListItems) ? oldListItems : []

  const oldHalf = Math.ceil(oldListItemsArray.length / 2)
  const oldFirstHalf = oldListItemsArray.slice(0, oldHalf)
  const oldSecondHalf = oldListItemsArray.slice(
    oldHalf,
    oldListItemsArray.length,
  )

  const minarsidurLink = '/minarsidur/postholf'

  const trackAndNavigateNew = (e) => {
    e.preventDefault()

    // If the plausible script is not loaded (For example in case of adBlocker) the user will be navigated directly to /minarsidur.
    if (window?.plausible) {
      // In case the script is there, but the event is not firing (different adBlock settings) then the user is navigated without Plausible callback.
      const id = window.setTimeout(() => {
        window.location.assign(minarsidurLink)
      }, 500)

      // The plausible custom event.
      webLoginButtonSelect('New', () => {
        window.clearTimeout(id)
        window.location.assign(minarsidurLink)
      })
    } else {
      window.location.assign(minarsidurLink)
    }
  }

  return (
    <ContentBlock>
      <Box paddingX={[0, 4, 4, 12]} paddingY={[2, 2, 10]} id="main-content">
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Tag disabled>{n('nyjuSidurTag', 'Beta útgáfa')}</Tag>
              <Text as="h2" variant="h1" marginBottom="p3" marginTop="p1">
                {n('nyjuSidurTitle', 'Ný útgáfa af mínum síðum á island.is')}
              </Text>
              <Text as="p" variant="default" marginBottom="p5">
                {n(
                  'nyjuSidurText',
                  'Ný útgáfa minna síðna á ísland.is. Hér er um að ræða beta útgáfu að nýjum mínum síðum, ekki eru allir möguleikar sem eru á gömlu mínum síðum í boði hér ennþá.',
                )}
              </Text>
              <div>
                <a
                  tabIndex={-1}
                  className={styles.btnLink}
                  href={minarsidurLink}
                  onClick={trackAndNavigateNew}
                >
                  <Button as="span">
                    {n('nyjuSidurLink', 'Fara á nýju mínar síður')}
                  </Button>
                </a>
                <Link
                  href="//minarsidur.island.is/"
                  color="blue400"
                  underline="normal"
                  underlineVisibility="always"
                  onClick={() => webLoginButtonSelect('Old')}
                  newTab
                  className={styles.link}
                >
                  {n('gomluSidurLink', 'Fara á gömlu mínar síður')}{' '}
                  <Icon icon="open" type="outline" />
                </Link>
              </div>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 4, 5]}
            >
              <Hidden below="md">
                <Box
                  display="flex"
                  justifyContent="flexEnd"
                  alignItems="flexStart"
                >
                  <SvgLogin />
                </Box>
              </Hidden>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '5/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Box flexDirection="column" display="flex">
                {newListItemsArray.length > 0 ? (
                  <Box marginTop={[1, 0]}>
                    <Text as="h3" variant="h3" marginBottom="p3">
                      {n('nyjuSidurListTitle', 'Á nýjum mínum síðum')}
                    </Text>
                    <BulletList type="ul">
                      {newListItemsArray.map((li) => (
                        <Bullet key={li}>{li}</Bullet>
                      ))}
                    </BulletList>
                  </Box>
                ) : null}
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '7/12']}
              paddingBottom={[3, 3, 4]}
            >
              <Box flexDirection="column" display="flex">
                {oldListItemsArray.length > 0 ? (
                  <Box marginTop={[1, 0]}>
                    <Text as="h3" variant="h3" marginBottom="p3">
                      {n('gomluSidurListTitle', 'Á gömlu mínum síðum')}
                    </Text>
                    <GridContainer>
                      <GridRow>
                        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                          <BulletList type="ul">
                            {oldFirstHalf.map((li) => (
                              <Bullet key={li}>{li}</Bullet>
                            ))}
                          </BulletList>
                        </GridColumn>
                        <GridColumn
                          paddingTop={[1, 1, 1, 0]}
                          span={['12/12', '12/12', '12/12', '7/12']}
                        >
                          <BulletList type="ul">
                            {oldSecondHalf.map((li) => (
                              <Bullet key={li}>{li}</Bullet>
                            ))}
                          </BulletList>
                        </GridColumn>
                      </GridRow>
                    </GridContainer>
                  </Box>
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
