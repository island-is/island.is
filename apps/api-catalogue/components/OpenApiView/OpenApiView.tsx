import React from 'react';
import * as styles from './OpenApiView.treat';
import cn from 'classnames';
import { OpenApi } from '@island.is/api/schema'
import { RedocStandalone } from 'redoc'

export interface ServiceCardProps {
    spec: OpenApi
}

export const OpenApiView = (props: ServiceCardProps) => {
    const openApiObject = JSON.parse(JSON.stringify(props.spec));
    /*
      openApiObject.info['x-links'] = {
        documentation: "https://docs.my-service.island.is",
        responsibleParty: "https://my-service.island.is/responsible",
        bugReport: "https://github.com/island-is/handbook/issues/new?assignees=&labels=&template=bug_report.md",
        featureRequest: "https://github.com/island-is/handbook/issues/new?assignees=&labels=&template=feature_request.md"
      }*/

    const showLink = (key: string, value: string) => {
        let name;
        //  
        switch (key) {
            case 'documentation'   : name = 'Documentation';         break;
            case 'responsibleParty': name = 'Responsible party';     break;
            case 'bugReport'       : name = 'Reporting a bug';       break;
            case 'featureRequest'  : name = 'Make a feature request'; break;
            default:
                name = key;
        }

        return (
            <a href={value}>{name}</a>
        )
    }
    return (
        <div >
            {('x-links' in openApiObject.info) &&
                <div>
                    <h4>Additional links</h4>
                    <div className={cn(styles.x_linksContainer)}>
                        <div className={cn(styles.x_links)}>
                            {Object.keys(openApiObject.info['x-links']).map((key, index) =>

                                <div className={cn(styles.x_link)} key={key}>
                                    {showLink(key, openApiObject.info['x-links'][key])}
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            }

            <RedocStandalone spec={openApiObject} />
        </div>
    )
}