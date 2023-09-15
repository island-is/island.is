import React from 'react'
import {
  GridContainer,
  Box,
  GridColumn,
  GridRow,
  Text,
  ContentBlock,
  Button,
  Hidden,
  BulletList,
  Bullet,
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

  const minarsidurLink = '/minarsidur/'

  const trackAndNavigateNew = (e: { preventDefault: () => void }) => {
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

  const nyjarSidurText = n(
    'nyjuSidurText',
    'Nýjar Mínar síður hafa verið uppfærðar með því markmiði að auka þægindi, aðgengi og gagnsæi einstaklinga og fyrirtækja að upplýsingum hjá ríkinu.',
  )

  const nyjarSidurSubText = n(
    'nyjuSidurSubText',
    'Eldri Mínar síður (hlekkur á á https://innskraning.island.is/?id=minarsidur.island.is) eru fyrir einstaklinga sem eru ekki með rafræn skilríki. Rafræn skilríki eru öruggari og munu taka alfarið við Íslykli í komandi framtíð.',
  )

  const nyjarSidurBullets = n('nyjuSidurBullets', [
    'Einstaklingar skrá sig inn með rafrænum skilríkjum.',
    'Einstaklingar með prókúru fyrirtækis skrá sig inn með sínum rafrænu skilríkjum en hægt er að skipta yfir á fyrirtæki eða önnur umboð.',
    'Ef fyrirtækið birtist ekki þarf að athuga skráningu prókúrhafa hjá Skattinum. ',
  ])

  return (
    <ContentBlock>
      <Box paddingX={[0, 4, 4, 12]} paddingY={[2, 2, 10]} id="main-content">
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={[3, 0]}
            >
              <Text as="h2" variant="h1" marginBottom="p3" marginTop="p1">
                {n(
                  'nyjuSidurTitle',
                  'Mínar síður fyrir einstaklinga og fyrirtæki',
                )}
              </Text>
              {nyjarSidurText && (
                <Text as="p" variant="default" marginBottom={4}>
                  {nyjarSidurText}
                </Text>
              )}
              <Box marginBottom={3}>
                {nyjarSidurBullets?.length > 0 && (
                  <BulletList type="ul" space={2}>
                    {nyjarSidurBullets.map((x, index) => {
                      return <Bullet key={index}>{x}</Bullet>
                    })}
                  </BulletList>
                )}
              </Box>

              <div>
                <a
                  tabIndex={-1}
                  className={styles.btnLink}
                  href={minarsidurLink}
                  onClick={trackAndNavigateNew}
                >
                  <Button as="span">{n('nyjuSidurLink', 'Innskráning')}</Button>
                </a>
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <Hidden below="md">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <SvgLogin />
                </Box>
              </Hidden>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '6/12', '6/12']}>
              {nyjarSidurSubText && (
                <>
                  <a
                    href={n(
                      'gomluSidurUrl',
                      '//innskraning.island.is/?id=minarsidur.island.is',
                    )}
                    color="blue400"
                    onClick={() => webLoginButtonSelect('Old')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="text"
                      size="small"
                      icon="open"
                      iconType="outline"
                    >
                      {n('gomluSidurTitle', 'Gömlu Mínar síður')}
                    </Button>
                  </a>
                  <Text as="span" variant="small">
                    {' '}
                    {n(
                      'gomluSidurText',
                      'eru fyrir einstaklinga sem eru ekki með rafræn skilríki. Rafræn skilríki eru öruggari og munu taka alfarið við Íslykli í komandi framtíð.',
                    )}
                  </Text>
                </>
              )}
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </ContentBlock>
  )
}

LoginPage.getProps = async ({ apolloClient, locale }) => {
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
