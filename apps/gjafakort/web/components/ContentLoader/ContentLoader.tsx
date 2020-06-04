import React from 'react'

import { Box } from '@island.is/island-ui/core'

import { Loader } from '..'
import { FormLayout } from '../FormLayout'

function ContentLoader() {
  return (
    <FormLayout>
      <Box textAlign="center">
        <Loader />
      </Box>
    </FormLayout>
  )
}

export default ContentLoader
