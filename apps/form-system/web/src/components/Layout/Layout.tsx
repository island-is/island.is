import { PropsWithChildren } from 'react'
import { m } from '@island.is/form-system/ui'
import {
  AlertMessage,
  Box,
  GridContainer,
  Header,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useHeaderInfo } from '../../context/HeaderInfoProvider'
import { UserMenu } from '@island.is/shared/components'

export const Layout = ({ children }: PropsWithChildren) => {
  const { info } = useHeaderInfo()
  const { formatMessage } = useLocale()

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
        {info.isTest && (
          <Box marginBottom={[3, 4]}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.testApplicationBanner)}
            />
          </Box>
        )}
        {children}
      </GridContainer>
    </Box>
  )
}
