import { useMemo } from 'react'

import { Box, Inline, Text } from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import * as styles from './DirectorateOfHealthDashboardHeader.css'

const BACKGROUND_URL =
  'https://images.ctfassets.net/8k0h54kbe6bj/1FB32FjyMGC1PfpDfB2Kj1/257dc1108da254359f8988dfef536936/Pattern_PP_Pattern_Circle_Blue_1.png'

interface DirectorateOfHealthDashboardHeaderProps {
  projectPage: ProjectPage
}

export const DirectorateOfHealthDashboardHeader: React.FC<
  React.PropsWithChildren<DirectorateOfHealthDashboardHeaderProps>
> = ({ projectPage }) => {
  const namespace = useMemo(() => {
    return JSON.parse(projectPage?.namespace?.fields ?? '{}')
  }, [projectPage?.namespace?.fields])
  const { activeLocale } = useI18n()

  const n = useNamespace(namespace)

  return (
    <Box
      display="flex"
      justifyContent="flexEnd"
      paddingTop={6}
      paddingBottom={4}
      paddingRight={5}
      className={styles.background}
      style={{
        background: n(
          'directorageOfHealthDashboardBackgroundUrl',
          `url("${BACKGROUND_URL}")`,
        ),
      }}
    >
      <Inline alignY="center" space={[1, 2, 3]} flexWrap="nowrap">
        <Box textAlign="center">
          <Text variant="h2" as="h1" color="white">
            {n(
              'directorateOfHealthDashboardTitle',
              activeLocale === 'is'
                ? 'Mælaborð embætti landlæknis'
                : 'Directorate of health dashboard',
            )}
          </Text>
        </Box>
        <img
          className={styles.logo}
          src={n(
            'directorateOfHealthLogo',
            'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/9fc63716a739a008d064ebb50b4c964a/skjaldamerkid.svg',
          )}
          alt="directorate-of-health-logo"
        />
      </Inline>
    </Box>
  )
}
