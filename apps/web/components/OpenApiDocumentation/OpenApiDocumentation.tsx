import React, { FC, useEffect } from 'react'
import { OpenApi } from '@island.is/api-catalogue/types'
import {
  ArrowLink,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

////////////////////////////////////////////////////////////////////////////////
//
// To use this component the parent component must include the following script:
//
//  <script
//    id="redoc" type="text/javascript"
//    src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"
//  >
//  </script>
////////////////////////////////////////////////////////////////////////////////

export interface OpenApiDocumentationProps {
  spec: OpenApi
  linkTitle?: string
  documentationLinkText?: string
  responsiblePartyLinkText?: string
  bugReportLinkText?: string
  featureRequestLinkText?: string
}

interface Window {
  Redoc: any
}

declare const window: Window

export const OpenApiDocumentation: FC<OpenApiDocumentationProps> = ({
  spec,
  linkTitle = 'Additional links',
  documentationLinkText = 'Documentation',
  responsiblePartyLinkText = 'Responsible party',
  bugReportLinkText = 'Report a bug',
  featureRequestLinkText = 'Make a feature request',
}: OpenApiDocumentationProps) => {

  const GetDefaultLinkText = (key: string) => {
    let text: string
    switch (key) {
      case 'documentation':
        text = documentationLinkText
        break
      case 'responsibleParty':
        text = responsiblePartyLinkText
        break
      case 'bugReport':
        text = bugReportLinkText
        break
      case 'featureRequest':
        text = featureRequestLinkText
        break
      default:
        text = key
    }

    return text
  }

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
    <Box width="full">
      {spec !== undefined && spec !== null && 'x-links' in spec.info && (
        <Box width="full">
          <Text variant="h4" as="h4">
            {linkTitle}
          </Text>
          <GridRow align="spaceBetween">
            {Object.keys(spec?.info['x-links']).map((key) => (
              <GridColumn key={key}>
                <ArrowLink href={spec.info['x-links'][key]}>
                  {GetDefaultLinkText(key)}
                </ArrowLink>
              </GridColumn>
            ))}
          </GridRow>
        </Box>
      )}
      <Box id="redoc-container" paddingTop="containerGutter" />
    </Box>
  )
}
