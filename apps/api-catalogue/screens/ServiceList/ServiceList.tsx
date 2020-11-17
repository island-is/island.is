import React, { useState } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  Breadcrumbs,
  Text,
  AccordionItem,
  LoadingIcon,
  Stack,
} from '@island.is/island-ui/core'

import * as styles from './ServiceList.treat'
import cn from 'classnames'
import {
  ServiceLayout,
  ServiceCard,
  ServiceFilter,
  ServiceCardMessage,
} from '../../components'
import { theme } from '@island.is/island-ui/theme'
import { GET_CATALOGUE_QUERY } from '../Queries'
import { useQuery } from 'react-apollo'
import {
  GetApiCatalogueInput,
  Query,
  QueryGetApiCatalogueArgs,
} from '@island.is/api/schema'

import { useNamespace } from '@island.is/web/hooks'
import { QueryGetNamespaceArgs } from '@island.is/api/schema'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../Queries'
import { Screen } from '../../types'
import initApollo from 'apps/api-catalogue/graphql/client'

const LIMIT = 25

interface ServiceListProps {
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
}

export const ServiceList: Screen<ServiceListProps> = ({
  staticContent,
  filterContent,
}) => {
  const n = useNamespace(staticContent)
  const fn = useNamespace(filterContent)

  // prettier-ignore
  const TEXT_NOT_FOUND = n('notFound')
  // prettier-ignore
  const TEXT_ERROR = n('error')

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
              <span>{n('title')}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={1}>
              <Text variant="h1">{n('title')}</Text>
              <Text variant="intro">{n('intro')}</Text>
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
                  strings={filterContent}
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
              <div className={cn(styles.navigationText)}>{n('fmButton')}</div>
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
              label={fn('mobile')}
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
                strings={filterContent}
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
            strings={filterContent}
          />
        )
      }
    />
  )
}

ServiceList.getInitialProps = async (ctx) => {
  if (!ctx.locale) {
    ctx.locale = 'is-IS'
  }
  const client = initApollo({})

  const [staticContent, filterContent] = await Promise.all([
    client
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalog',
            lang: ctx.locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    client
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogFilter',
            lang: ctx.locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])
  
  return {
    staticContent,
    filterContent,
  }
}
