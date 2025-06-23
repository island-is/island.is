import { Box, Button, GridRow } from '@island.is/island-ui/core'
import { OrganizationSelect } from '../OrganizationSelect'
import { useContext, useState } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Permissions } from './components/Permissions/Permissions'

export const Admin = () => {
  const { isAdmin } = useContext(FormsContext)
  const { formatMessage } = useIntl()
  const [activeComponent, setActiveComponent] = useState<
    'urls' | 'permissions'
  >('urls')

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
              <Button
                size="default"
                variant="ghost"
                onClick={() => setActiveComponent('urls')}
              >
                {formatMessage(m.urls)}
              </Button>
              {isAdmin && (
                <Button
                  size="default"
                  variant="ghost"
                  onClick={() => setActiveComponent('permissions')}
                >
                  {formatMessage(m.permissions)}
                </Button>
              )}
            </Box>
            <OrganizationSelect />
          </Box>
        </Box>
      </GridRow>
      {activeComponent === 'urls' && <p>slóðir</p>}
      {activeComponent === 'permissions' && isAdmin && <Permissions />}
    </>
  )
}
