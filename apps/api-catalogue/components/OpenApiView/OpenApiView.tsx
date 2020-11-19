import React, { FC, useEffect } from 'react'
import * as styles from './OpenApiView.treat'
import cn from 'classnames'
import { OpenApi } from '@island.is/api-catalogue/types'

export interface OpenApiProps {
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

export const OpenApiView: FC<OpenApiProps> = ({ spec }: OpenApiProps) => {
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
          <div className={cn(styles.xLinksContainer)}>
            <div className={cn(styles.xLinks)}>
              {Object.keys(spec.info['x-links']).map((key, index) => (
                <div className={cn(styles.xLink)} key={key}>
                  {showLink(key, spec.info['x-links'][key])}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div id="redoc-container" />
    </div>
  )
}
