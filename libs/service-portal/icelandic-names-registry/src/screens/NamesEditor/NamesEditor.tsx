import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

import Editor from '../../components/Editor/Editor'

const NamesEditor: ServicePortalModuleComponent = () => {
  return (
    <Box marginBottom={[2, 3, 5]}>
      <Editor />
    </Box>
  )
}

export default NamesEditor
