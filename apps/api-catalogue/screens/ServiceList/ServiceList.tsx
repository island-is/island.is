import React, { useState, ReactNode } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  Breadcrumbs,
  ContentBlock,
  GridRow,
  GridColumn,
  Text,
  AccordionItem,
  GridContainer,
  LoadingIcon,
  Stack,
  ServiceFilter,
  FilterSearchGroup,
  FilterSearch,
  Checkbox,
} from '@island.is/island-ui/core'

import * as styles from './ServiceList.treat'
import cn from 'classnames'
import {
  Layout,
  ServiceCard,
  ServiceCardMessage,
} from '../../components'
import { Page } from '../../services/contentful.types'
import { theme } from '@island.is/island-ui/theme'
import { GET_CATALOGUE_QUERY } from '../Queries'
import { useQuery } from 'react-apollo'
import {
  GetApiCatalogueInput,
  Query,
  QueryGetApiCatalogueArgs,
} from '@island.is/api/schema'
import {
  PricingCategory,
  DataCategory,
  TypeCategory,
  AccessCategory
} from '@island.is/api-catalogue/consts'
import { style } from 'treat'
import { label } from 'libs/island-ui/core/src/lib/AsyncSearch/shared/Label/Label.treat'

interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  isMobile: boolean
}

function ServiceLayout({
  top,
  left,
  right,
  isMobile,
}: PropTypes) {
  return (
    <div>
      <Box paddingX="gutter">
        <Layout left={top} />
      </Box>
      <div className={cn(isMobile? styles.bottomRootMobile : styles.bottomRoot)}>
      <h4 className={cn(styles.bottomHeading)}>API Vörulisti</h4>
      <div className={cn(isMobile? styles.leftAndRightMobile : styles.leftAndRight)}>
        <div className={cn(isMobile? style({width:'100%'}) : {})}>
              {left}
        </div>
        <div>
              {right}
        </div>
      </div>
      </div>
    </div>
  )
}

const LIMIT = 25

export interface ServiceListProps {
  pageContent: Page
  filterStrings: Page
}

export function ServiceList({ pageContent, filterStrings }: ServiceListProps) {
  // prettier-ignore
  const TEXT_NOT_FOUND = pageContent.strings.find(s => s.id === 'catalog-not-found').text;
  // prettier-ignore
  const TEXT_ERROR = pageContent.strings.find(s => s.id === 'catalog-error').text;

  const [parameters, setParameters] = useState<GetApiCatalogueInput>({
    cursor: null,
    limit: LIMIT,
    query: '',
    pricing: [],
    data: [],
    type: [],
    access: [],
  })
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // prettier-ignore
  const { data, loading, error, fetchMore, refetch } = useQuery<Query, QueryGetApiCatalogueArgs>(GET_CATALOGUE_QUERY,
  {
    variables: {
      input: parameters,
    },
  })

  const onClear = () => {
    setParameters({
      cursor: null,
      limit: LIMIT,
      query: '',
      pricing: [],
      data: [],
      type: [],
      access: [],
    })
  }

  const onLoadMore = () => {
    if (data?.getApiCatalogue.pageInfo?.nextCursor == null) {
      return
    }

    const { nextCursor } = data?.getApiCatalogue?.pageInfo
    const param = { ...parameters, cursor: nextCursor }
    fetchMore({
      variables: { input: param },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getApiCatalogue.services = [
          ...prevResult.getApiCatalogue.services,
          ...fetchMoreResult.getApiCatalogue.services,
        ]
        return fetchMoreResult
      },
    })
  }

  const updateCategoryCheckBox = (target) => {
    const name: string = target.name
    const categoryValue: string = target.value
    const checked: boolean = target.checked
    const temp = parameters

    if (checked) {
      if (!temp[name].includes(categoryValue)) {
        temp[name].push(categoryValue)
      }
    } else {
      temp[name].splice(temp[name].indexOf(categoryValue), 1)
    }
    setParameters({ ...temp })
    refetch()
  }

  const onSearchChange = function (inputValue: string) {
      setParameters({ ...parameters, query: inputValue })
  }

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <ServiceLayout
      isMobile={isMobile}
      top={
        <Box>
          <Box marginBottom={2}>
            <Breadcrumbs>
              <a href="/">Viskuausan</a>
              <span>
                {pageContent.strings.find((s) => s.id === 'catalog-title').text}
              </span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={1}>
              <Text variant="h1">
                {pageContent.strings.find((s) => s.id === 'catalog-title').text}
              </Text>
              <Text variant="intro">
                {pageContent.strings.find((s) => s.id === 'catalog-intro').text}
              </Text>
            </Stack>
          </Box>
        </Box>
      }
      left={
        <FilterSearch
          id="filter-search-box"
          label="Sýna flokka"
          labelCloseButton = "Sía API vörulista"
          labelResultButton={data?.getApiCatalogue.services.length > 0? 
                                  `Skoða niðurstöður (${data?.getApiCatalogue.services.length})`:
                                  'Ekkert fannst'}
          inputValues={{
            value: parameters?.query === null ? '' : parameters?.query,
            placeholder: filterStrings.strings.find((s) => s.id === 'catalog-filter-search').text,
            colored: false,
            isLoading: loading,
            onChange: (event) => onSearchChange(event.target.value)
          }}
          clearValues={{
            text: 'Hreinsa',
            onClick: onClear
          }}
        >
          <FilterSearchGroup
            id="pricing_category"
            label={filterStrings.strings.find((s) => s.id === 'catalog-filter-pricing').text}
          >
            <Checkbox
              id="pricing-free"
              name="pricing"
              value={PricingCategory.FREE}
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-pricing-free').text}
              checked={parameters.pricing.includes(PricingCategory.FREE)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
              id="pricing-paid"
              name="pricing"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-pricing-paid').text}
              value={PricingCategory.PAID}
              checked={parameters.pricing.includes(PricingCategory.PAID)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />

          </FilterSearchGroup>
          <FilterSearchGroup
            id="data_category"
            label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data').text}
          >
            <Checkbox
              id="data-public"
              name="data"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data-public').text}
              value={DataCategory.PUBLIC}
              checked={parameters.data.includes(DataCategory.PUBLIC)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
              id="data-official"
              name="data"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data-official').text}
              value={DataCategory.OFFICIAL}
              checked={parameters.data.includes(DataCategory.OFFICIAL)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
            id="data-personal"
              name="data"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data-personal').text}
              value={DataCategory.PERSONAL}
              checked={parameters.data.includes(DataCategory.PERSONAL)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
            id="data-health"
              name="data"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data-health').text}
              value={DataCategory.HEALTH}
              checked={parameters.data.includes(DataCategory.HEALTH)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
            id="data-financial"
              name="data"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-data-financial').text}
              value={DataCategory.FINANCIAL}
              checked={parameters.data.includes(DataCategory.FINANCIAL)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="type_category"
            label={filterStrings.strings.find((s) => s.id === 'catalog-filter-type').text}
          >
            <Checkbox
              id="type-rest"
              name="type"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-type-rest').text}
              value={TypeCategory.REST}
              checked={parameters.type.includes(TypeCategory.REST)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
              id="type-soap"
              name="type"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-type-soap').text}
              value={TypeCategory.SOAP}
              checked={parameters.type.includes(TypeCategory.SOAP)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
              id="type-graphql"
              name="type"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-type-graphql').text}
              value={TypeCategory.GRAPHQL}
              checked={parameters.type.includes(TypeCategory.GRAPHQL)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="access_category"
            label={filterStrings.strings.find((s) => s.id === 'catalog-filter-access').text}
          >
            <Checkbox
              id="access-xroad"
              name="access"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-access-xroad').text}
              value={AccessCategory.XROAD}
              checked={parameters.access.includes(AccessCategory.XROAD)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
            <Checkbox
              id="access-apigw"
              name="access"
              label={filterStrings.strings.find((s) => s.id === 'catalog-filter-access-apigw').text}
              value={AccessCategory.APIGW}
              checked={parameters.access.includes(AccessCategory.APIGW)}
              onChange={({ target }) => { updateCategoryCheckBox(target) }} />
          </FilterSearchGroup>
        </FilterSearch>
      }
      right={
        <Box
          className={cn(
            isMobile ? styles.serviceListMobile : styles.serviceList,
            'service-list',
          )}
          marginBottom="containerGutter"
          marginTop={1}
        >
          {data?.getApiCatalogue.services.length > 0 &&
            data.getApiCatalogue.services.map((item) => {
              return (
                <ServiceCard
                  key={item.id}
                  service={item}
                  strings={filterStrings.strings}
                />
              )
            })}

          {loading && (
            <Box className={cn(styles.navigation)} borderRadius="large">
              <div>
                <LoadingIcon animate color="blue400" size={32} />
              </div>
            </Box>
          )}

          {data?.getApiCatalogue?.services.length > 0 && (
            <Box
              className={cn(
                isMobile ? styles.navigationMobile : styles.navigation,
                data?.getApiCatalogue?.pageInfo?.nextCursor == null
                  ? styles.displayHidden
                  : {},
              )}
              borderRadius="large"
              onClick={() => onLoadMore()}
            >
              <div className={cn(styles.navigationText)}>
                {
                  pageContent.strings.find(
                    (s) => s.id === 'catalog-fetch-more-button',
                  ).text
                }
              </div>
            </Box>
          )}

          {data?.getApiCatalogue.services.length < 1 && !loading && (
            <ServiceCardMessage messageType="default" title={TEXT_NOT_FOUND} />
          )}

          {error && (
            <ServiceCardMessage messageType="error" title={TEXT_ERROR} />
          )}
        </Box>
      }
    />
  )
}
