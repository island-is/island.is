import React, { ReactNode, useState } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  Breadcrumbs,
  Text,
  LoadingIcon,
  Stack,
  FilterSearchGroup,
  FilterSearch,
  Checkbox,
  ServiceListContainer,
  Button,
  GridRow,
  GridColumn,
  TagDisplayNames,
} from '@island.is/island-ui/core'

import * as styles from './ServiceList.treat'
import cn from 'classnames'
import { Layout  } from '../../components'
import { theme } from '@island.is/island-ui/theme'
import { GET_CATALOGUE_QUERY } from '../Queries'
import { useQuery } from 'react-apollo'
import {
  GetApiCatalogueInput,
  Query,
  QueryGetApiCatalogueArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'
import {
  PricingCategory,
  DataCategory,
  TypeCategory,
  AccessCategory,
} from '@island.is/api-catalogue/consts'
import { style } from 'treat'

import { useNamespace } from '../../hooks'
import { GET_NAMESPACE_QUERY } from '../Queries'
import { Screen, GetNamespaceQuery } from '../../types'
import initApollo from '../../graphql/client'
import { CategoryCard } from 'libs/island-ui/core/src/lib/CategoryCard/CategoryCard'

interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  isMobile: boolean
}

function ServiceLayout({ top, left, right, isMobile }: PropTypes) {
  return (
    <div>
      <Box paddingX="gutter">
        <Layout left={top} />
      </Box>
      <div
        className={cn(isMobile ? styles.bottomRootMobile : styles.bottomRoot)}
      >
        <h4 className={cn(styles.bottomHeading)}>API Vörulisti</h4>
        <div
          className={cn(
            isMobile ? {} : styles.leftAndRight,
          )}
        >
          <div className={cn(isMobile ? style({ width: '100%' }) : {})}>
            {left}
          </div>
          <div>{right}</div>
        </div>
      </div>
    </div>
  )
}

const LIMIT = 2

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

  
  const translateTags = (): TagDisplayNames => {
    const names: TagDisplayNames = {
      APIGW: fn('accessApigw'),
      XROAD: fn('accessXroad'),
      FINANCIAL: fn('dataFinancial'),
      HEALTH: fn('dataHealth'),
      OFFICIAL: fn('dataOfficial'),
      PERSONAL: fn('dataPersonal'),
      PUBLIC: fn('dataPublic'),
      FREE: fn('pricingFree'),
      PAID: fn('pricingPaid'),
      GRAPHQL: fn('typeGraphql'),
      REST: fn('typeRest'),
      SOAP: fn('typeSoap'),
      OPEN: 'OPEN'  //tag not currently used
    }

    return names;
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
        <FilterSearch
          labelMobileButton={fn('mobile')}
          labelMobileCloseButton={fn('mobileClose')}
          labelMobileResultButton={
            data?.getApiCatalogue.services.length > 0
              ? `${fn('mobileResult')} (${
                  data?.getApiCatalogue.services.length
                })`
              : fn('mobileNoResult')
          }
          inputValues={{
            value: parameters?.query === null ? '' : parameters?.query,
            placeholder: fn('search'),
            colored: false,
            isLoading: loading,
            onChange: (event) => onSearchChange(event.target.value),
          }}
          clearValues={{
            text: fn('clear'),
            onClick: onClear,
          }}
        >
          <FilterSearchGroup id="pricing_category" label={fn('pricing')}>
            <Checkbox
              id="pricing-free"
              name="pricing"
              value={PricingCategory.FREE}
              label={fn('pricingFree')}
              checked={parameters.pricing.includes(PricingCategory.FREE)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="pricing-paid"
              name="pricing"
              label={fn('pricingPaid')}
              value={PricingCategory.PAID}
              checked={parameters.pricing.includes(PricingCategory.PAID)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup id="data_category" label={fn('data')}>
            <Checkbox
              id="data-public"
              name="data"
              label={fn('dataPublic')}
              value={DataCategory.PUBLIC}
              checked={parameters.data.includes(DataCategory.PUBLIC)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-official"
              name="data"
              label={fn('dataOfficial')}
              value={DataCategory.OFFICIAL}
              checked={parameters.data.includes(DataCategory.OFFICIAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-personal"
              name="data"
              label={fn('dataPersonal')}
              value={DataCategory.PERSONAL}
              checked={parameters.data.includes(DataCategory.PERSONAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-health"
              name="data"
              label={fn('dataHealth')}
              value={DataCategory.HEALTH}
              checked={parameters.data.includes(DataCategory.HEALTH)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-financial"
              name="data"
              label={fn('dataFinancial')}
              value={DataCategory.FINANCIAL}
              checked={parameters.data.includes(DataCategory.FINANCIAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup id="type_category" label={fn('type')}>
            <Checkbox
              id="type-rest"
              name="type"
              label={fn('typeRest')}
              value={TypeCategory.REST}
              checked={parameters.type.includes(TypeCategory.REST)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="type-soap"
              name="type"
              label={fn('typeSoap')}
              value={TypeCategory.SOAP}
              checked={parameters.type.includes(TypeCategory.SOAP)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="type-graphql"
              name="type"
              label={fn('typeGraphql')}
              value={TypeCategory.GRAPHQL}
              checked={parameters.type.includes(TypeCategory.GRAPHQL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup id="access_category" label={fn('access')}>
            <Checkbox
              id="access-xroad"
              name="access"
              label={fn('accessXroad')}
              value={AccessCategory.XROAD}
              checked={parameters.access.includes(AccessCategory.XROAD)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="access-apigw"
              name="access"
              label={fn('accessApigw')}
              value={AccessCategory.APIGW}
              checked={parameters.access.includes(AccessCategory.APIGW)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
        </FilterSearch>
      }
      right={
        <ServiceListContainer
          services={data?.getApiCatalogue.services}
          span={['12/12', '12/12', '12/12', '6/12', '4/12']}
          tagDisplayNames={translateTags()}
          loading={loading}
          moreToLoad={data?.getApiCatalogue?.pageInfo?.nextCursor != null}
          emptyListText={TEXT_NOT_FOUND}
          onLoadMoreClick={onLoadMore}
          loadMoreButtonText={n('fmButton')}
        >
          {error && (
            <CategoryCard
              colorScheme="red"
              heading={TEXT_ERROR}
              text="Ekki tókst að sækja gögn." />
          )}
        </ServiceListContainer>
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
