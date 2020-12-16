import React, { FC, useEffect } from 'react'
import { OpenApi } from '@island.is/api-catalogue/types'

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
}

interface Window {
  Redoc: any
}

declare const window: Window

const showLink = (key: string, value: string) => {
  let name: string
  switch (key) {
    case 'documentation':
      name = 'Documentation'
      break
    case 'responsibleParty':
      name = 'Responsible party'
      break
    case 'bugReport':
      name = 'Reporting a bug'
      break
    case 'featureRequest':
      name = 'Make a feature request'
      break
    default:
      name = key
  }

  return <a href={value}>{name}</a>
}

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
    <div>
      {'x-links' in spec.info && (
        <div>
          <h4>Additional links</h4>
          <div>
            <div>
              {Object.keys(spec?.info['x-links']).map((key) => (
                <div key={key}>{showLink(key, spec.info['x-links'][key])}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div id="redoc-container" />
    </div>
  )
}
