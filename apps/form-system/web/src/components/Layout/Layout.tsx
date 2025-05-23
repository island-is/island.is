import React, { FC } from 'react'
import { Box, GridContainer, Header } from '@island.is/island-ui/core'
import { useHeaderInfo } from '../../context/HeaderInfoProvider'
import { UserMenu } from '@island.is/shared/components'

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { info } = useHeaderInfo()

  return (
    <Box>
      <GridContainer>
        <Header
          info={
            info.applicationName && info.organisationName
              ? {
                  title: info.organisationName,
                  description: info.applicationName,
                }
              : undefined
          }
          headerItems={<UserMenu showDropdownLanguage small />}
        />
        {children}
      </GridContainer>
    </Box>
  )
}
