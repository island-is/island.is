import React from 'react'
import {
  GridContainer,
  GridRow,
  GridColumn,
  CategoryCard,
  LoadingIcon,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { ApiService } from '@island.is/api/schema'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { capitalize } from '@island.is/web/utils/capitalize'
import { useNamespace } from '@island.is/web/hooks'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
}

export type ErrorMessage = {
  heading: string
  text: string
}

export interface ServiceListProps {
  baseUrl?: string
  services: ApiService[]
  tagDisplayNames?: GetNamespaceQuery['getNamespace']
}

export const ServiceList: React.FC<ServiceListProps> = ({
  baseUrl = './vorulisti/',
  services = [],
  tagDisplayNames = {},
}) => {
  const n = useNamespace(tagDisplayNames)
  const CategoriesToTags = (service: ApiService) => {
    const tags: Tag[] = []
    let value

    service.pricing.forEach((tag) => {
      value = n(`pricing${capitalize(tag)}`)
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.data.forEach((tag) => {
      value = n(`data${capitalize(tag)}`)
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.type.forEach((tag) => {
      value = n(`type${capitalize(tag)}`)
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.access.forEach((tag) => {
      value = n(`access${capitalize(tag)}`)
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    return tags
  }

  return (
    <GridContainer>
      <GridRow>
        {services.map((item) => {
          return (
            <GridColumn
              key={item.id.toString()}
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <CategoryCard
                href={`${baseUrl}${item.id}`}
                heading={item.name}
                text={item.owner}
                tags={CategoriesToTags(item)}
                truncateHeading={true}
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )
}
