import { Box, Button, GridRow } from '@island.is/island-ui/core'
import { OrganizationSelect } from '../OrganizationSelect'
import { useContext, useState } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Permissions } from './components/Permissions/Permissions'
import { SubmitUrls } from './components/SubmitUrls/SubmitUrls'

export const Admin = () => {
  const { isAdmin, submitUrls } = useContext(FormsContext)
  const { formatMessage } = useIntl()
  const [activeComponent, setActiveComponent] = useState<
    'submitUrls' | 'validationUrls' | 'permissions'
  >('submitUrls')
  const activeColor = 'blueberry'

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
                variant="text"
                colorScheme={
                  activeComponent === 'submitUrls' ? activeColor : 'default'
                }
                onClick={() => setActiveComponent('submitUrls')}
              >
                {formatMessage(m.submitUrls)}
              </Button>
              <Button
                size="default"
                variant="text"
                colorScheme={
                  activeComponent === 'validationUrls' ? activeColor : 'default'
                }
                onClick={() => setActiveComponent('validationUrls')}
              >
                {formatMessage(m.validationUrls)}
              </Button>
              {isAdmin && (
                <Button
                  size="default"
                  variant="text"
                  colorScheme={
                    activeComponent === 'permissions' ? activeColor : 'default'
                  }
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
      {activeComponent === 'submitUrls' && (
        <SubmitUrls submitUrls={submitUrls} />
      )}
      {activeComponent === 'validationUrls' && <p>Reglukerfi</p>}
      {activeComponent === 'permissions' && isAdmin && <Permissions />}
    </>
  )
}
