import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  Breadcrumbs,
  LoadingIcon,
  Select,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import {
  ApiService,
  GetOpenApiInput,
  Query,
  QueryGetOpenApiArgs,
} from '@island.is/api/schema'
import { useLazyQuery } from 'react-apollo'
import { GET_OPEN_API_QUERY } from '../../screens/Queries'
import { ContentfulString } from '../../services/contentful.types'
import {
  AccessCategory,
  PricingCategory,
  TypeCategory,
  DataCategory,
} from '@island.is/api-catalogue/consts'
import { OpenApi } from '@island.is/api-catalogue/types'
import YamlParser from 'js-yaml'
import { OpenApiView } from '../OpenApiView'

type SelectOption = {
  label: string
  value: any
}

export interface ServiceDetailProps {
  service: ApiService
  strings: Array<ContentfulString>
}

export const ServiceDetail = ({ service, strings }: ServiceDetailProps) => {
  const options: Array<SelectOption> = service.xroadIdentifier.map((x) => ({
    label: x.serviceCode.split('-').pop(),
    value: {
      instance: x.instance,
      memberClass: x.memberClass,
      memberCode: x.memberCode,
      serviceCode: x.serviceCode,
      subsystemCode: x.subsystemCode,
    },
  }))
  const [openApi, setOpenApi] = useState<GetOpenApiInput>(options[0].value)
  // prettier-ignore
  const [getOpenApi, { data, loading, error }] = useLazyQuery<Query,QueryGetOpenApiArgs>(GET_OPEN_API_QUERY,
  {
    variables: {
      input: openApi,
    },
  })

  useEffect(() => {
    getOpenApi()
  }, [openApi])

  const onSelectChange = (option: SelectOption) => {
    setOpenApi(option.value)
  }

  // Main page
  return (
    <Box className={cn(styles.root)}>
      <Breadcrumbs>
        <a href="/">Viskuausan</a>
        <a href="/services">API Vörulisti</a>
        <span>{service.name}</span>
      </Breadcrumbs>
      <div className={cn(styles.topSection)}>
        <h1 className="name" data-id={service.id}>
          {service.name}
        </h1>
        <div className={cn(styles.description)}>{service.description}</div>
        <Box>
          <Select
            label="Version"
            name="version"
            defaultValue={options[0]}
            options={options}
            onChange={onSelectChange}
            noOptionsMessage="Engar útgáfuupplýsingar"
          />
        </Box>
      </div>
      <div className={cn(styles.section)}>
        <Box>
          <h3>Framleiðandi</h3>
          <div className={cn(styles.description)}>{service.owner}</div>
        </Box>
      </div>
      <div className={cn(styles.section)}>
        <Box className={cn(styles.categoryContainer)}>
          <Box style={{ width: '100%' }}>
            <h3>
              {strings.find((s) => s.id === 'catalog-filter-pricing').text}
            </h3>
            <div className={cn([styles.category])}>
              {service.pricing?.map((item, index) => (
                <div className={cn(styles.categoryItem)} key={index}>
                  {
                    strings.find(
                      (s) =>
                        s.id === `catalog-filter-pricing-${item.toLowerCase()}`,
                    ).text
                  }
                </div>
              ))}
            </div>
          </Box>
          <Box style={{ width: '100%' }}>
            <h3>{strings.find((s) => s.id === 'catalog-filter-data').text}</h3>
            <div className={cn([styles.category])}>
              {service.data?.map((item, index) => (
                <div className={cn(styles.categoryItem)} key={index}>
                  {
                    strings.find(
                      (s) =>
                        s.id === `catalog-filter-data-${item.toLowerCase()}`,
                    ).text
                  }
                </div>
              ))}
            </div>
          </Box>
          <Box style={{ width: '100%' }}>
            <h3>{strings.find((s) => s.id === 'catalog-filter-type').text}</h3>
            <div className={cn([styles.category])}>
              {service.type?.map((item, index) => (
                <div className={cn(styles.categoryItem)} key={index}>
                  {
                    strings.find(
                      (s) =>
                        s.id === `catalog-filter-type-${item.toLowerCase()}`,
                    ).text
                  }
                </div>
              ))}
            </div>
          </Box>
          <Box style={{ width: '100%' }}>
            <h3>
              {strings.find((s) => s.id === 'catalog-filter-access').text}
            </h3>
            <div className={cn([styles.category])}>
              {service.access?.map((item, index) => (
                <div className={cn(styles.categoryItem)} key={index}>
                  {
                    strings.find(
                      (s) =>
                        s.id === `catalog-filter-access-${item.toLowerCase()}`,
                    ).text
                  }
                </div>
              ))}
            </div>
          </Box>
        </Box>
      </div>
      <div className={cn(styles.section)}>
        <Accordion singleExpand={true}>
          <AccordionItem id="id_1" label="OpenAPI skjölun">
            <Text variant="default" as="div">
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <LoadingIcon animate color="blue400" size={50} />
                </div>
              ) : data?.getOpenApi.spec == '' || data?.getOpenApi == null ? (
                'Ekki tókst að sækja skjölun'
              ) : (
                <OpenApiView
                  spec={YamlParser.safeLoad(data?.getOpenApi.spec) as OpenApi}
                />
              )}
            </Text>
          </AccordionItem>
        </Accordion>
      </div>
    </Box>
  )
}
