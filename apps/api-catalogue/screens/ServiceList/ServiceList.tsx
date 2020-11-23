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
} from '@island.is/island-ui/core'

import * as styles from './ServiceList.treat'
import cn from 'classnames'
import { Layout, ServiceCard, ServiceCardMessage } from '../../components'
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
            isMobile ? styles.leftAndRightMobile : styles.leftAndRight,
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
          labelMobileButton="Sýna flokka"
          labelMobileCloseButton="Sía API vörulista"
          labelMobileResultButton={
            data?.getApiCatalogue.services.length > 0
              ? `Skoða niðurstöður (${data?.getApiCatalogue.services.length})`
              : 'Ekkert fannst'
          }
          inputValues={{
            value: parameters?.query === null ? '' : parameters?.query,
            placeholder: n('search'),
            colored: false,
            isLoading: loading,
            onChange: (event) => onSearchChange(event.target.value),
          }}
          clearValues={{
            text: 'Hreinsa',
            onClick: onClear,
          }}
        >
          <FilterSearchGroup
            id="pricing_category"
            label={n('pricing') }
          >
            <Checkbox
              id="pricing-free"
              name="pricing"
              value={PricingCategory.FREE}
              label={n('pricingFree')}
              checked={parameters.pricing.includes(PricingCategory.FREE)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="pricing-paid"
              name="pricing"
              label={n('pricingPaid')}
              value={PricingCategory.PAID}
              checked={parameters.pricing.includes(PricingCategory.PAID)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="data_category"
            label={n('data')}
          >
            <Checkbox
              id="data-public"
              name="data"
              label={ n('dataPublic') }
              value={DataCategory.PUBLIC}
              checked={parameters.data.includes(DataCategory.PUBLIC)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-official"
              name="data"
              label={ n('dataOfficial') }
              value={DataCategory.OFFICIAL}
              checked={parameters.data.includes(DataCategory.OFFICIAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-personal"
              name="data"
              label={ n('dataPersonal') }
              value={DataCategory.PERSONAL}
              checked={parameters.data.includes(DataCategory.PERSONAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-health"
              name="data"
              label={n('dataHealth') }
              value={DataCategory.HEALTH}
              checked={parameters.data.includes(DataCategory.HEALTH)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="data-financial"
              name="data"
              label={
                n('dataFinancial') }
              value={DataCategory.FINANCIAL}
              checked={parameters.data.includes(DataCategory.FINANCIAL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="type_category"
            label={ n('type') }
          >
            <Checkbox
              id="type-rest"
              name="type"
              label={ n('typeRest') }
              value={TypeCategory.REST}
              checked={parameters.type.includes(TypeCategory.REST)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="type-soap"
              name="type"
              label={n('typeSoap') }
              value={TypeCategory.SOAP}
              checked={parameters.type.includes(TypeCategory.SOAP)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="type-graphql"
              name="type"
              label={ n('typeGraphql') }
              value={TypeCategory.GRAPHQL}
              checked={parameters.type.includes(TypeCategory.GRAPHQL)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="access_category"
            label={n('access') }
          >
            <Checkbox
              id="access-xroad"
              name="access"
              label={ n('accessXroad') }
              value={AccessCategory.XROAD}
              checked={parameters.access.includes(AccessCategory.XROAD)}
              onChange={({ target }) => {
                updateCategoryCheckBox(target)
              }}
            />
            <Checkbox
              id="access-apigw"
              name="access"
              label={ n('accessApigw') }
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
  console.log(filterContent);
  return {
    staticContent,
    filterContent,
  }
}
