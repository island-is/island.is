import { Box, Button, GridRow } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { SubmissionUrls } from './SubmissionUrls'

export const Urls = () => {
  const { formatMessage } = useIntl()
  const [activeComponent, setActiveComponent] = useState<
    'submissionUrls' | 'validationUrls'
  >('submissionUrls')
  const activeColor = 'blueberry'

  return (
    <>
      <GridRow>
        <Box
          marginTop={8}
          marginBottom={2}
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
                  activeComponent === 'submissionUrls' ? activeColor : 'default'
                }
                onClick={() => setActiveComponent('submissionUrls')}
              >
                {formatMessage(m.submitUrls)}
              </Button>
              {/* <Button
                size="default"
                variant="text"
                colorScheme={
                  activeComponent === 'validationUrls' ? activeColor : 'default'
                }
                onClick={() => setActiveComponent('validationUrls')}
              >
                {formatMessage(m.validationUrls)}
              </Button> */}
            </Box>
          </Box>
        </Box>
      </GridRow>
      {activeComponent === 'submissionUrls' && <SubmissionUrls />}
      {/* {activeComponent === 'validationUrls' && <p>Reglukerfi</p>} */}
    </>
  )
}
