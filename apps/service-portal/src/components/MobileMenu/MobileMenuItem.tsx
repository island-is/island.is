import { Box, GridColumn, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { getMobileMenuFigure } from './figuresMapper'
import * as styles from './MobileMenu.css'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'

interface MobileMenuItem {
  item: ServicePortalNavigationItem
  onClick?: () => void
  itemName: string
}

const MobileMenuItem: FC<React.PropsWithChildren<MobileMenuItem>> = ({
  item,
  itemName,
}) => {
  const figure = getMobileMenuFigure(item.path)

  return (
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
  )
}

const MobileMenuItemWrapper: FC<React.PropsWithChildren<MobileMenuItem>> = (
  props,
) => {
  return (
    <GridColumn span={['1/2', '1/4']}>
      {props.item.external ? (
        <a
          href={props.item.path}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.link}
        >
          <MobileMenuItem {...props} />
        </a>
      ) : (
        <Link
          to={props.item.path || ''}
          className={styles.link}
          onClick={props.onClick}
        >
          <MobileMenuItem {...props} />
        </Link>
      )}
    </GridColumn>
  )
}

export default MobileMenuItemWrapper
