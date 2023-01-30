import React from 'react'
import { Box } from '@island.is/island-ui/core'
import Editor from '../../components/Editor/Editor'
import { PortalModuleComponent } from '@island.is/portals/core'

const NamesEditor: PortalModuleComponent = () => {
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Editor />
    </Box>
  )
}

export default NamesEditor
