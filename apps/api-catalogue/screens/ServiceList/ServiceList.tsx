import React, { useState, ReactNode } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  Breadcrumbs,
  ContentBlock,
  GridRow,
  GridColumn,
  Icon,
  Text,
  AccordionItem,
  GridContainer,
} from '@island.is/island-ui/core'

import * as styles from './ServiceList.treat'
import cn from 'classnames'
import {
  ServiceCard,
  ServiceFilter,
  ServiceCardMessage,
} from '../../components'
import ContentfulApi from '../../services/contentful'
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
  bottom,
  left,
  right,
  className,
  listClassNames: listClasses,
}: PropTypes) {
  return (
    <Box paddingX="gutter">
      <GridContainer className={className}>
        {<ContentBlock>{top}</ContentBlock>}
        <ContentBlock>
          <GridRow className={listClasses}>
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
        </ContentBlock>
        {<ContentBlock>{bottom}</ContentBlock>}
      </GridContainer>
    </Box>
  )
}

const LIMIT = 25

export interface ServiceListProps {
  pageContent: Page
  filterStrings: Page
}

export default function ServiceList(props: ServiceListProps) {
  // prettier-ignore
  const TEXT_SEARCHING = props.pageContent.strings.find(s => s.id === 'catalog-searching').text;
  // prettier-ignore
  const TEXT_NOT_FOUND = props.pageContent.strings.find(s => s.id === 'catalog-not-found').text;
  // prettier-ignore
  const TEXT_ERROR = props.pageContent.strings.find(s => s.id === 'catalog-error').text;

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
        <div>
          <Breadcrumbs>
            <a href="/">Ísland.is</a>
            <span>
              {
                props.pageContent.strings.find((s) => s.id === 'catalog-title')
                  .text
              }
            </span>
          </Breadcrumbs>
          <div
            className={cn(
              isMobile ? styles.topSectionMobile : styles.topSection,
            )}
          >
            <Text variant="h1">
              {
                props.pageContent.strings.find((s) => s.id === 'catalog-title')
                  .text
              }
            </Text>
            <div className={cn(styles.topSectionText)}>
              <Text variant="intro">
                {
                  props.pageContent.strings.find(
                    (s) => s.id === 'catalog-intro',
                  ).text
                }
              </Text>
            </div>
          </div>
        </div>
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
                  strings={props.filterStrings.strings}
                />
              )
            })}

          {loading && (
            <Box className={cn(styles.navigation)} borderRadius="large">
              <div>
                <Icon
                  type="filled"
                  icon="sync"
                  className={styles.loadingIcon}
                />
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
                  props.pageContent.strings.find(
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
                strings={props.filterStrings.strings}
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
            strings={props.filterStrings.strings}
          />
        )
      }
    />
  )
}

ServiceList.getInitialProps = async (ctx): Promise<ServiceListProps> => {
  const client = new ContentfulApi()
  let locale = 'is-IS'

  const pathLocale = ctx.pathname.split('/')[1]
  if (pathLocale === 'en') {
    locale = 'en-GB'
  }

  const pageContent = await client.fetchPageBySlug('services', locale)
  const filterStrings = await client.fetchPageBySlug('service-filter', locale)

  return {
    pageContent: pageContent,
    filterStrings: filterStrings,
  }
}
