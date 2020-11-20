import { Box, GridColumn, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { getMobileMenuFigure } from './figuresMapper'
import * as styles from './MobileMenu.treat'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'

interface MobileMenuItem {
  item: ServicePortalNavigationItem
  index: number
  onClick?: () => void
  itemName: string
}

const MobileMenuItem: FC<MobileMenuItem> = ({
  item,
  index,
  onClick,
  itemName,
}) => {
  const figure = getMobileMenuFigure(item.path)

  return (
    <GridColumn span={['1/2', '1/4']}>
      <Link to={item.path || ''} className={styles.link} onClick={onClick}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="full"
          background="white"
          padding={2}
          borderRadius="large"
          textAlign="center"
          className={styles.figureCard}
        >
          <Box
            className={styles.figure}
            style={{ backgroundImage: `url(${figure})` }}
            marginBottom={2}
          />
          <Text variant="eyebrow" color="blueberry400">
            {itemName}
          </Text>
        </Box>
      </Link>
    </GridColumn>
  )
}

export default MobileMenuItem
