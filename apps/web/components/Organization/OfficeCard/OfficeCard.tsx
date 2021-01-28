import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './OfficeCard.treat'

interface OfficeCardProps {
  name: string
  address: string
  city: string
  openingHours: string
}

export const OfficeCard: React.FC<OfficeCardProps> = ({
  name,
  address,
  city,
  openingHours,
}) => {
  return (
    <Box
      borderRadius="large"
      overflow="hidden"
      background="blue100"
      boxShadow="subtle"
      border="standard"
      borderColor="blue200"
      marginBottom={[1, 1, 1]}
      marginTop={[1, 1, 1]}
      paddingX={[3, 3, 3]}
      paddingY={[3, 3, 3]}
    >
      <h1 className={styles.title}>{name}</h1>
      <p style={{ fontWeight: 300, marginTop: 14 }}>{address}</p>
      <div style={{ paddingTop: 18, fontWeight: 'bold' }}>Opnunartími</div>
      {openingHours.split('\n').map((line) => (
        <p style={{ fontWeight: 300, marginTop: 14 }}>{line}</p>
      ))}
    </Box>
  )
}
