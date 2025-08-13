import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoCard } from '@island.is/portals/my-pages/core'
import React from 'react'
import { vehicleMessage } from '../lib/messages'
import { MEDIUM_CO2_JUNE_2025 } from '../utils/constants'

interface VehicleCO2Props {
  co2: string
}

const VehicleCO2: React.FC<VehicleCO2Props> = ({ co2 }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2}>
      {
        <InfoCard
          size="large"
          title={formatMessage(vehicleMessage.co2Label)}
          description=""
          detail={[
            {
              label: formatMessage(vehicleMessage.myCo2),
              value: co2,
              subValue: 'CO2',
            },
            {
              label: formatMessage(vehicleMessage.mediumCo2),
              tooltip: formatMessage(vehicleMessage.mediumCo2Tooltip),
              value: MEDIUM_CO2_JUNE_2025,
              subValue: 'CO2',
            },
          ]}
          img="./assets/images/movingTruck.svg"
        />
      }
    </Box>
  )
}

export default VehicleCO2
