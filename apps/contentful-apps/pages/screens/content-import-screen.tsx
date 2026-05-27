import { useState } from 'react'
import { Box, Tab, TabList, Tabs } from '@contentful/f36-components'

import { GridContainer } from '@island.is/island-ui/core'

import { ContentExportScreen } from '../../components/content-import/ContentExportScreen'
import { ContentImportScreen } from '../../components/content-import/ContentImportScreen'

enum ScreenState {
  IMPORT = 'import',
  EXPORT = 'export',
}

const Screen = () => {
  const [selectedScreen, setSelectedScreen] = useState<ScreenState>(
    ScreenState.IMPORT,
  )
  return (
    <Box paddingLeft="spacingXl" paddingRight="spacingXl" paddingTop="spacingM">
      <Box paddingBottom="spacingXl">
        <GridContainer>
          <Tabs
            onTabChange={(tab) => setSelectedScreen(tab as ScreenState)}
            defaultTab={ScreenState.IMPORT}
          >
            <TabList>
              <Tab panelId={ScreenState.IMPORT}>Import</Tab>
              <Tab panelId={ScreenState.EXPORT}>Export</Tab>
            </TabList>
          </Tabs>
        </GridContainer>
      </Box>
      {selectedScreen === ScreenState.IMPORT && <ContentImportScreen />}
      {selectedScreen === ScreenState.EXPORT && <ContentExportScreen />}
    </Box>
  )
}

export default Screen
