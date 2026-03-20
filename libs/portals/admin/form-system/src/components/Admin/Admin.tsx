import { Box, GridRow, Text } from '@island.is/island-ui/core'
import { OrganizationSelect } from '../OrganizationSelect'
import { useContext } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Permissions } from './components/Permissions/Permissions'

export const Admin = () => {
  const { isAdmin } = useContext(FormsContext)
  const { formatMessage } = useIntl()

  return (
    <>
      <GridRow>
        <Box
          marginTop={4}
          marginBottom={8}
          marginRight={1}
          marginLeft={2}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <Box justifyContent="spaceBetween" display="flex" width="full">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              columnGap={4}
            >
              {isAdmin && (
                <Text variant="h4">{formatMessage(m.permissions)}</Text>
              )}
            </Box>
            {isAdmin && <OrganizationSelect />}
          </Box>
        </Box>
      </GridRow>
      {isAdmin && <Permissions />}
    </>
  )
}
