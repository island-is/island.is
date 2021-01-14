import React, { FC, useEffect } from 'react'
import { OpenApi } from '@island.is/api-catalogue/types'
import { Box } from '@island.is/island-ui/core'

///////////////////////////////////////////////////////////////////////////////
//
// To use this component, the parent component or page must add the the redoc
// script.  It can be done like this:
//    useScript(
//      'https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js',
//      true,
//      'redoc'
//    )
///////////////////////////////////////////////////////////////////////////////

export interface OpenApiDocumentationProps {
  spec: OpenApi
}

interface Window {
  Redoc: any
}

declare const window: Window

export const OpenApiDocumentation: FC<OpenApiDocumentationProps> = ({
  spec,
}: OpenApiDocumentationProps) => {
  useEffect(() => {
    window.Redoc.init(
      spec,
      {
        noAutoAuth: true,
        showExtensions: true,
      },
      document.getElementById('redoc-container'),
    )
  }, [spec])

  return (
    <Box width="full" paddingTop="containerGutter">
      <Box id="redoc-container" background="white" />
    </Box>
  )
}
