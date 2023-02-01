import {
  Box,
  Logo,
  Button,
  Inline,
  GridColumn,
  GridRow,
  Divider,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import * as styles from './Menu.css'
import React from 'react'
import { MenuLogo } from '../svg'
import { menuItems } from './MenuItems'
type MenuProps = {
  showIcon: boolean
}
export const Menu = ({ showIcon = true }: MenuProps) => {
  const router = useRouter()
  return (
    <nav className={styles.menu}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '4/12', '6/12']}>
          <Inline>
            <Box>
              <Logo iconOnly width={26} />
            </Box>
            <Box
              style={{
                transform: 'rotate(90deg)',
                width: 56,
                display: 'inline-table',
                verticalAlign: 'bottom',
              }}
              marginX={1}
            >
              <Divider />
            </Box>
            {showIcon && (
              <Box onClick={() => router.push('/')}>
                <MenuLogo />
              </Box>
            )}
          </Inline>
        </GridColumn>
        <GridColumn span={['0', '0', '0', '6/12', '4/12']} hiddenBelow={'lg'}>
          <Inline align={'right'} space={2}>
            {menuItems.map((item, index) => {
              return (
                <Button
                  key={index}
                  variant="utility"
                  size="medium"
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </Button>
              )
            })}
          </Inline>
        </GridColumn>
        <GridColumn span={['0', '0', '0', '2/12', '2/12']} hiddenBelow={'lg'}>
          <Inline justifyContent={'center'}>
            <Button size="small">Innskráning</Button>
          </Inline>
        </GridColumn>
      </GridRow>
    </nav>
  )
}
export default Menu
