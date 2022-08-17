import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import {
  GridContainer,
  Logo,
  Icon,
  Box,
  Text,
  Link,
} from '@island.is/island-ui/core'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import * as styles from './OrganizationIslandFooter.css'

export const OrganizationIslandFooter = () => {
  const { activeLocale } = useI18n()
  const { data } = useQuery<Query, QueryGetNamespaceArgs>(GET_NAMESPACE_QUERY, {
    variables: {
      input: { lang: activeLocale, namespace: 'OrganizationIslandFooter' },
    },
  })

  const namespace = useMemo(
    () => JSON.parse(data?.getNamespace?.fields ?? '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespaceStrict(namespace)

  return (
    <footer>
      <Box background="blue100" width="full" padding={5}>
        <GridContainer className={styles.contentContainer}>
          <Box className={styles.leftContent}>
            <Logo iconOnly={true} />
            <Text color="blue600">
              <Link href={n('digitalIcelandLink', '/s/stafraent-island')}>
                {n('digitalIceland', 'Stafrænt Ísland')}
              </Link>
            </Text>
            <Text color="blue600">
              <Link href={n('servicesLink', '/flokkur')}>
                {n('services', 'Þjónustuflokkar')}
              </Link>
            </Text>
          </Box>

          <Box className={styles.rightContent}>
            <Text color="blue600" variant="small">
              <Link href={n('organizationsLink', '/s')}>
                {n('organizations', 'Stofnanir')}
              </Link>
            </Text>
            <Text color="blue600" variant="small">
              <Link
                href={n(
                  'privacyPolicyLink',
                  '/personuverndarstefna-stafraent-islands',
                )}
              >
                {n('privacyPolicy', 'Persónuverndarstefna')}
              </Link>
            </Text>
            <Box className={styles.languageToggleContainer}>
              <Icon color="blue400" icon="globe" className={styles.globeIcon} />
              <Text color="blue600" variant="small">
                <Link
                  href={n(
                    'oppositeLanguageLink',
                    activeLocale === 'en' ? '/' : '/en',
                  )}
                >
                  {n(
                    'oppositeLanguage',
                    activeLocale === 'en' ? 'Íslenska' : 'English',
                  )}
                </Link>
              </Text>
            </Box>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default OrganizationIslandFooter
