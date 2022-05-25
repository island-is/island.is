import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Link,
  Text,
  Icon,
  ContentBlock,
  Button,
  Hidden,
} from '@island.is/island-ui/core'
import { SvgLogin, GridContainer } from '@island.is/web/components'
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
              <Text as="h2" variant="h1" marginBottom="p3" marginTop="p1">
                {n('nyjuSidurTitle', 'Mínar síður Ísland.is')}
              </Text>
              <Text as="p" variant="default" marginBottom="p5">
                {n(
                  'nyjuSidurText',
                  'Gefnar hafa verið út nýjar Mínar síður sem eru hannaðar með þarfir notanda að leiðarljósi og aukið öryggi í innskráningu. Þessi nýja útgáfa er fyrsta skrefið í átt að betri þjónustu og aðgengi notenda að gögnum frá hinu opinbera.',
                )}
              </Text>
              <Text as="p" variant="default" marginBottom={5}>
                {n(
                  'nyjuSidurSubText',
                  'Eldri útgáfa af Mínum síðum er enn aðgengileg fyrir notendur Íslykils.',
                )}
              </Text>
              <div>
                <a
                  tabIndex={-1}
                  className={styles.btnLink}
                  href={minarsidurLink}
                  onClick={trackAndNavigateNew}
                >
                  <Button as="span">{n('nyjuSidurLink', 'Innskráning')}</Button>
                </a>
                <Link
                  href="//minarsidur.island.is/"
                  color="blue400"
                  onClick={() => webLoginButtonSelect('Old')}
                  newTab
                >
                  <Button variant="text" icon="open" iconType="outline">
                    {n('gomluSidurLink', 'Innskráning með Íslykli')}
                  </Button>
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
