import { useMemo } from 'react'
import { Box, Inline, Text } from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './FiskistofaDashboardHeader.css'

interface FiskistofaDashboardHeaderProps {
  projectPage: ProjectPage
}

export const FiskistofaDashboardHeader: React.FC<FiskistofaDashboardHeaderProps> = ({
  projectPage,
}) => {
  const namespace = useMemo(() => {
    return JSON.parse(projectPage?.namespace?.fields ?? '{}')
  }, [projectPage?.namespace?.fields])

  const n = useNamespace(namespace)

  return (
    <Box
      display="flex"
      justifyContent="flexEnd"
      paddingTop={3}
      paddingRight={3}
    >
      <Inline alignY="center" space={[1, 2, 3]} flexWrap="nowrap">
        <Text variant="h3" as="h1">
          <span className={styles.title}>
            {n('fiskistofaDashboard', 'Mælaborð Fiskistofu')}
          </span>
        </Text>
        <img
          className={styles.logo}
          src={n(
            'logo',
            'https://images.ctfassets.net/8k0h54kbe6bj/3W68zG8kVqVY7DU1qHxVEA/4d403503b05488cc8385578a92ef399e/fiskist-merki_2x.png',
          )}
          alt="fiskistofa-header"
        />
      </Inline>
    </Box>
  )
}
