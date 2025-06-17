import { Box, Text } from '@island.is/island-ui/core'
import { InfoCardGrid } from '@island.is/portals/my-pages/core'
import React from 'react'
import { HealthPaths } from '../../../lib/paths'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'

const Appointments: React.FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      {/* If no appointments, hide */}
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.myAppointments)}
      </Text>
      {/* TEMP  */}
      <InfoCardGrid
        size="small"
        variant="appointment"
        empty={{
          title: 'Engir tímar',
          description: 'Engar tímabókanir framundan.',
        }}
        cards={[
          {
            title: 'Mæðravernd',
            description: 'Tími hjá: Sigríður Gunnarsdóttir',
            appointment: {
              date: 'Fimmtudaginn, 03.04.2025',
              time: '11:40',
              location: {
                label: 'Heilsugæslan við Ásbrú',
                href: HealthPaths.HealthCenter,
              },
            },
          },
          {
            title: 'Mæðravernd',
            description: 'Tími hjá: Sigríður Gunnarsdóttir',
            appointment: {
              date: 'Fimmtudaginn, 03.04.2025',
              time: '11:40',
              location: {
                label: 'Heilsugæslan við Ásbrú',
                href: HealthPaths.HealthCenter,
              },
            },
          },
        ]}
      />
    </Box>
  )
}

export default Appointments
