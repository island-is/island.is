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

interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  className?: string
  listClassNames?: string
}

function ServiceLayout({
  top,
  left,
  right,
  bottom,
  className,
  listClassNames,
}: PropTypes) {
  return (
    <Box paddingX="gutter">
      <Layout left={top} />
      <GridContainer className={className}>
        <GridRow className={listClassNames}>
          <GridColumn
            span={['12/12', '8/12', '8/12', '9/12', '9/12']}
            offset={['0', '0', '0', '0', '0']}
          >
            {left}
          </GridColumn>
          <GridColumn
            span={['12/12', '4/12', '4/12', '3/12', '3/12']}
            offset={['0', '0', '0', '0', '0']}
          >
            {right}
          </GridColumn>
        </GridRow>
      </GridContainer>
      <ContentBlock>{bottom}</ContentBlock>
    </Box>
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
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const { width } = useWindowSize()
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
    if (width < theme.breakpoints.sm) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <ServiceLayout
      className={cn(isMobile ? styles.LayoutMobile : {})}
      listClassNames={cn(isMobile ? styles.serviceLayoutMobile : {})}
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
      right={
        isMobile ? (
          <div>
            <AccordionItem
              id="serviceFilter"
              label="Sýna flokka"
              labelVariant="default"
              iconVariant="default"
            >
              <ServiceFilter
                iconVariant="default"
                rootClasses={cn(styles.filterMobile, 'filter')}
                isLoading={loading}
                parameters={parameters}
                onInputChange={(input) => onSearchChange(input.target.value)}
                onClear={onClear}
                onCheckCategoryChanged={({ target }) => {
                  updateCategoryCheckBox(target)
                }}
                strings={filterStrings.strings}
              />
            </AccordionItem>
          </div>
        ) : (
          <ServiceFilter
            rootClasses={cn(styles.filter, 'filter')}
            isLoading={loading}
            parameters={parameters}
            onInputChange={(input) => onSearchChange(input.target.value)}
            onClear={onClear}
            onCheckCategoryChanged={({ target }) => {
              updateCategoryCheckBox(target)
            }}
            strings={filterStrings.strings}
          />
        )
      }
    />
  )
}
