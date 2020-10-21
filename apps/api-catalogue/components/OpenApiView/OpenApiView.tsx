import React from 'react'
import * as styles from './OpenApiView.treat'
import cn from 'classnames'
import { OpenApi } from '@island.is/api-catalogue/types'
import { RedocStandalone } from 'redoc'

export interface ServiceCardProps {
  spec: OpenApi
}

export const OpenApiView = (props: ServiceCardProps) => {
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
  return (
    <div>
      {'x-links' in props.spec.info && (
        <div>
          <h4>Additional links</h4>
          <div className={cn(styles.xLinksContainer)}>
            <div className={cn(styles.xLinks)}>
              {Object.keys(props.spec.info['x-links']).map((key, index) => (
                <div className={cn(styles.xLink)} key={key}>
                  {showLink(key, props.spec.info['x-links'][key])}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <RedocStandalone spec={props.spec} />
    </div>
  )
}
