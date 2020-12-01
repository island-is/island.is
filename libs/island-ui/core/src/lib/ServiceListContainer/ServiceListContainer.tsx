import React from 'react'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { ApiService } from '@island.is/api/schema'
import { CategoryCard } from '../../lib/CategoryCard/CategoryCard'
import { ResponsiveProp } from '../../utils/responsiveProp'
import * as styles from '../Grid/GridColumn/GridColumn.treat'
import {
  PricingCategory,
  DataCategory,
  TypeCategory,
  AccessCategory,
} from '@island.is/api-catalogue/consts'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
}

type CategoryKeys = 'FREE' | 'PAID' | 'OPEN' | 'PUBLIC' | 
  'OFFICIAL' | 'PERSONAL' | 'HEALTH' | 'FINANCIAL' |
  'REST' | 'SOAP' | 'GRAPHQL' | 'XROAD' | 'APIGW'

export type TagDisplayNames = {
  [key in CategoryKeys]: string;
}

export interface ServiceListContainerProps {
  baseUrl?: string
  services: ApiService[]
  span?: ResponsiveProp<styles.GridColumns>
  tagDisplayNames?: TagDisplayNames
  children?: JSX.Element | JSX.Element[]
}

export const ServiceListContainer: React.FC<ServiceListContainerProps> = ({
  baseUrl = './services/',
  services = [],
  span = ['12/12', '6/12', '6/12', '4/12'],
  tagDisplayNames = {},
  children
}) => {

  const CategoriesToTags = (service: ApiService) => {
    const tags: Tag[] = []
    let value;

    service.pricing.forEach((tag) => {
      value = tagDisplayNames[tag];
      if (value !== undefined)
        tags.push({ label: value })
      else
        tags.push({ label: tag })
    })
    service.data.forEach((tag) => {
      value = tagDisplayNames[tag];
      if (value !== undefined)
        tags.push({ label: value })
      else
        tags.push({ label: tag })
    })
    service.type.forEach((tag) => {
      value = tagDisplayNames[tag];
      if (value !== undefined)
        tags.push({ label: value })
      else
        tags.push({ label: tag })
    })
    service.access.forEach((tag) => {
      value = tagDisplayNames[tag];
      if (value !== undefined)
        tags.push({ label: value })
      else
        tags.push({ label: tag })
    })
    return tags
  }

  return (
    <GridContainer>
      <GridRow>
        {
          services.map((item) => {
            return (
              <GridColumn
                key={item.id.toString()}
                span={span}
                paddingBottom={3}
              >
                <CategoryCard
                  href={`${baseUrl}${item.id}`}
                  heading={item.name}
                  text={item.owner}
                  tags={CategoriesToTags(item)}
                />
              </GridColumn>
            )
          })
        }
        { //rendering items below all cards, such as load more button
          React.Children.map(children, (child) => {
            return (
              <GridColumn
                span={span}
                paddingBottom={3}
              >
                {child}
              </GridColumn>
            )
          })
        }
      </GridRow>
    </GridContainer>
  )
}
