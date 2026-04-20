import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import { useLoaderData } from 'react-router-dom'
import { vehicleMessage as m } from '../lib/messages'

interface Props {
  children: React.ReactNode
}

export const BulkMileageWrapper = ({ children }: Props) => {
  const isAllowedBulkMileageUpload: boolean = useLoaderData() as boolean
  const { formatMessage } = useLocale()

  if (!isAllowedBulkMileageUpload) {
    return (
      <Box paddingY={1}>
        <Problem
          size="large"
          noBorder={false}
          tag={formatMessage(coreMessages.accessDenied)}
          title={formatMessage(coreMessages.accessDenied)}
          message={formatMessage(m.notAllowedBulkMileage)}
          imgSrc="./assets/images/movingTruck.svg"
        />
      </Box>
    )
  }

  return children
}
