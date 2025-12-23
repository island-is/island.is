import React from 'react'
import { Text, Box, LinkV2 } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './ApplicationSideNavItems.css'
import cn from 'classnames'

import {
  ApplicationFilters,
  ApplicationFiltersEnum,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

interface Props {
  roles?: StaffRole[]
  applicationFilters: ApplicationFilters
}

const ApplicationSideNavItems = ({ roles, applicationFilters }: Props) => {
  const router = useRouter()

  if (roles === undefined || roles.includes(StaffRole.EMPLOYEE) === false) {
    return null
  }

  return (
    <>
      {navigationItems.map((item, index) => {
        return (
          <div key={'NavigationLinks-' + index}>
            {item.group && <p className={styles.group}>{item.group}</p>}
            <LinkV2
              href={item.link}
              aria-label={item.label}
              className={cn({
                [`${styles.link}`]: true,
                [`${styles.activeLink}`]: router.pathname === item.link,
                [`${styles.linkHoverEffect}`]: router.pathname !== item.link,
              })}
            >
              <Box display="flex" justifyContent="spaceBetween">
                <Text fontWeight="semiBold">{item.label}</Text>
                <Text fontWeight="semiBold" color="dark300">
                  {item.applicationState
                    .map((state: ApplicationFiltersEnum) => {
                      if (applicationFilters) {
                        return applicationFilters[state]
                      }
                    })
                    .reduce((acc: number, b?: number) => acc + (b || 0), 0)}
                </Text>
              </Box>
            </LinkV2>
          </div>
        )
      })}
    </>
  )
}

export default ApplicationSideNavItems
