// InfoCard.tsx
import React, { FC, PropsWithChildren } from 'react'

import { Box, Icon, IconMapIcon } from '@island.is/island-ui/core'

import * as styles from './InfoCard.css'

interface InfoCardProps {
  icon?: IconMapIcon
}

const InfoCard: FC<PropsWithChildren<InfoCardProps>> = ({ icon, children }) => {
  return (
    <Box
      className={styles.infoCardContainer}
      padding={[2, 2, 3, 3]}
      data-testid="infoCard"
    >
      {React.Children.map(children, (child, index) => (
        <Box
          className={`${styles.infoCardSection} ${
            index < React.Children.count(children) - 1
              ? styles.borderedSection
              : ''
          }`}
        >
          {child}
        </Box>
      ))}
      {icon && (
        <Box position="absolute" top={[2, 2, 3, 3]} right={[2, 2, 3, 3]}>
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        </Box>
      )}
    </Box>
  )
}

export default InfoCard
