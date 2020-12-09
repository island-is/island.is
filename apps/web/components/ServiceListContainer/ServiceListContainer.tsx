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
import { ResponsiveProp } from '../../../../libs/island-ui/core/src/utils/responsiveProp'
import * as GridColumnStyles from '../../../../libs/island-ui/core/src/lib/Grid/GridColumn/GridColumn.treat'

type Tag = {
  label: string
  href?: string
  onClick?: () => void
}

type CategoryKeys =
  | 'FREE'
  | 'PAID'
  | 'OPEN'
  | 'PUBLIC'
  | 'OFFICIAL'
  | 'PERSONAL'
  | 'HEALTH'
  | 'FINANCIAL'
  | 'REST'
  | 'SOAP'
  | 'GRAPHQL'
  | 'XROAD'
  | 'APIGW'

export type TagDisplayNames = {
  [key in CategoryKeys]: string
}

export type ErrorMessage = {
  heading: string
  text: string
}

export interface ServiceListContainerProps {
  baseUrl?: string
  services: ApiService[]
  span?: ResponsiveProp<GridColumnStyles.GridColumns>
  tagDisplayNames?: TagDisplayNames //If you want different display names for tag
  loading?: Boolean // pass true to show loading icon
  emptyListText?: string
  errorMessage?: ErrorMessage //pass null if no error
  loadMoreButtonText?: string
  onLoadMoreClick?: () => void
  moreToLoad?: Boolean //should the loadMore button be shown
  children?: JSX.Element | JSX.Element[]
}

export const ServiceListContainer: React.FC<ServiceListContainerProps> = ({
  baseUrl = './vorulisti/',
  services = [],
  span = ['12/12', '6/12', '6/12', '4/12'],
  tagDisplayNames = {},
  loading = false,
  moreToLoad = false,
  emptyListText = 'No service was found',
  errorMessage = null,
  loadMoreButtonText = 'See more',
  onLoadMoreClick,
  children,
}) => {
  const CategoriesToTags = (service: ApiService) => {
    const tags: Tag[] = []
    let value

    service.pricing.forEach((tag) => {
      value = tagDisplayNames[tag]
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.data.forEach((tag) => {
      value = tagDisplayNames[tag]
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.type.forEach((tag) => {
      value = tagDisplayNames[tag]
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    service.access.forEach((tag) => {
      value = tagDisplayNames[tag]
      if (value !== undefined) tags.push({ label: value })
      else tags.push({ label: tag })
    })
    return tags
  }

  return (
    <GridContainer>
      {services.length < 1 && !loading && (
        <GridRow>
          <CategoryCard heading={emptyListText} text="" />
        </GridRow>
      )}
      <GridRow>
        {services.map((item) => {
          return (
            <GridColumn key={item.id.toString()} span={span} paddingBottom={3}>
              <CategoryCard
                href={`${baseUrl}${item.id}`}
                heading={item.name}
                text={item.owner}
                tags={CategoriesToTags(item)}
              />
            </GridColumn>
          )
        })}
        {loading && (
          <GridColumn>
            <Box borderRadius="large" padding="containerGutter">
              <LoadingIcon animate color="blue400" size={32} />
            </Box>
          </GridColumn>
        )}
      </GridRow>
      {errorMessage && (
        <GridRow align="center">
          <CategoryCard
            colorScheme="red"
            heading={errorMessage.heading}
            text={errorMessage.text}
          />
        </GridRow>
      )}
      {services.length > 0 && moreToLoad && (
        <GridRow align="center">
          <Button
            colorScheme="default"
            iconType="filled"
            onBlur={function noRefCheck() {}}
            onClick={onLoadMoreClick}
            onFocus={function noRefCheck() {}}
            size="default"
            type="button"
            variant="ghost"
          >
            {loadMoreButtonText}
          </Button>
        </GridRow>
      )}

      <GridRow>
        {
          //rendering items below all, but within same GridContainer
          React.Children.map(children, (child) => {
            return (
              <GridColumn span={span} paddingBottom={3}>
                {child}
              </GridColumn>
            )
          })
        }
      </GridRow>
    </GridContainer>
  )
}
