import { Box } from '@island.is/island-ui/core'
import { AccessDenied } from '@island.is/portals/core'
import { useLoaderData } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

export const BulkMileageWrapper = ({ children }: Props) => {
  const isAllowedBulkMileageUpload: boolean = useLoaderData() as boolean

  if (!isAllowedBulkMileageUpload) {
    return (
      <Box paddingY={1}>
        <AccessDenied />
      </Box>
    )
  }

  return children
}
