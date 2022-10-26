import { Box } from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useMemo } from 'react'

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

  return <Box display="flex" justifyContent="flexEnd"></Box>
}
