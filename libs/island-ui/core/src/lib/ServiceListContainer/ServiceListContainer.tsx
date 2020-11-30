import React from 'react'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { ApiService } from '@island.is/api/schema'
import { CategoryCard } from '../../lib/CategoryCard/CategoryCard'
import { ResponsiveProp } from '../../utils/responsiveProp'
import * as styles from '../Grid/GridColumn/GridColumn.treat'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
}

export interface ServiceListContainerProps {
  baseUrl?: string
  services: ApiService[]
  span?: ResponsiveProp<styles.GridColumns>
  children?: JSX.Element | JSX.Element[]
}

export const ServiceListContainer: React.FC<ServiceListContainerProps> = ({
  baseUrl = './services/',
  services = [],
  span = ['12/12', '6/12', '6/12', '4/12'],
  children
}) => {
  const CategoriesToTags = (service: ApiService) => {
    const tags: Tag[] = []
    service.pricing.forEach((tag) => {
      tags.push({ label: tag })
    })
    service.data.forEach((tag) => {
      tags.push({ label: tag })
    })
    service.type.forEach((tag) => {
      tags.push({ label: tag })
    })
    service.access.forEach((tag) => {
      tags.push({ label: tag })
    })
    return tags
  }

  const showChildren = () => {
      return React.Children.map(children, (child, index) => {
        return (
                <GridColumn 
                  key={index}
                  span={span}
                  paddingBottom={3}
                >
                  {child}
                </GridColumn>
        )
      })
  }

  return (
    <GridContainer>
      <GridRow>
        {
          services.map((item) => {
            return (
              <GridColumn
                key={String(item.id)}
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
        {showChildren()}
      </GridRow>
    </GridContainer>
  )
}
