import { useMemo } from 'react'

import { Box, Hidden, Inline, Text } from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './FiskistofaDashboardHeader.css'

interface FiskistofaDashboardHeaderProps {
  projectPage: ProjectPage
}

export const FiskistofaDashboardHeader: React.FC<
  React.PropsWithChildren<FiskistofaDashboardHeaderProps>
> = ({ projectPage }) => {
  const namespace = useMemo(() => {
    return JSON.parse(projectPage?.namespace?.fields || '{}')
  }, [projectPage?.namespace?.fields])

  const n = useNamespace(namespace)

  return (
    <Box
      display="flex"
      justifyContent="flexEnd"
      paddingTop={6}
      paddingBottom={4}
      paddingRight={5}
      className={styles.background}
    >
      <Hidden below="lg">
        <img
          src={n(
            'fiskistofaDashboardHeaderLeftCloudImageSrc',
            'https://images.ctfassets.net/8k0h54kbe6bj/6CPPbNLGhvT5S5i19PJ3C3/2e26e1442bda877b663934f6a701727d/Skyfiskistofa__1_.png',
          )}
          className={styles.leftCloud}
          alt=""
        />
        <img
          src={n(
            'fiskistofaDashboardHeaderCenterCloudImageSrc',
            'https://images.ctfassets.net/8k0h54kbe6bj/3ggGNwYiW6oI8zm7CmRfrL/e417f57aab38df0a1208a42272da9c05/Skyfiskistofa2.png',
          )}
          className={styles.centerCloud}
          alt=""
        />
        <img
          src={n(
            'fiskistofaDashboardHeaderRightCloudImageSrc',
            'https://images.ctfassets.net/8k0h54kbe6bj/F0pl5X923mpOQmdEmrBRa/fd5333dc9ffa9d38fa1181e5758b32fb/skyfiskistofa3.png',
          )}
          className={styles.rightCloud}
          alt=""
        />
      </Hidden>
      <Inline alignY="center" space={[1, 2, 3]} flexWrap="nowrap">
        <Box textAlign="center">
          <Text variant="h2" as="h1">
            <span className={styles.title}>
              {n('fiskistofaDashboard', 'Mælaborð Fiskistofu')}
            </span>
          </Text>
        </Box>
        <img
          className={styles.logo}
          src={n(
            'logo',
            'https://images.ctfassets.net/8k0h54kbe6bj/2Ar2rGJETbegBE39jxEAmt/386c0a4877789a6d9eade785cb24163a/fiskistofa-logo-gagnasidur.svg',
          )}
          alt="fiskistofa-header"
        />
      </Inline>
    </Box>
  )
}
