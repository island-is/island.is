import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  Breadcrumbs,
  Select,
  Typography,
} from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import {
  ApiService,
  GetOpenApiInput,
  OpenApi,
  Query,
  QueryGetOpenApiArgs,
} from '@island.is/api/schema'
import { RedocStandalone } from 'redoc'
import { useLazyQuery } from 'react-apollo'
import { GET_OPEN_API_QUERY } from '../../screens/Queries'
import { ContentfulString } from '../../services/contentful.types'
import {
  AccessCategory,
  PricingCategory,
  TypeCategory,
  DataCategory,
} from '@island.is/api-catalogue/consts'
import YamlParser from 'js-yaml'

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
        <a href="/">
          Ísland.is
        </a>
        <a href="/services">
          API Vörulisti
        </a>
        <span>{service.owner}</span>
      </Breadcrumbs>
      <div className={cn(styles.section)}>
        <Box>
          <h1>{service.owner}</h1>
        </Box>
      </div>
      <div className={cn(styles.section)}>
        <h2 className="name" data-id={service.id}>
          {service.name}
        </h2>
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
                        s.id ===
                        `catalog-filter-pricing-${PricingCategory[
                          item
                        ].toLowerCase()}`,
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
                        s.id ===
                        `catalog-filter-data-${DataCategory[
                          item
                        ].toLowerCase()}`,
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
                  {TypeCategory[item]}
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
                  {AccessCategory[item]}
                </div>
              ))}
            </div>
          </Box>
        </Box>
      </div>
      <div className={cn(styles.section)}>
        <Accordion singleExpand={true}>
          <AccordionItem id="id_1" label="OpenAPI skjölun">
            <Typography variant="p" as="div">
              {loading ? (
                'Leita...'
              ) : data?.getOpenApi.spec == '' || data?.getOpenApi == null ? (
                'Ekki tókst að sækja skjölun'
              ) : (
                <RedocStandalone
                  spec={YamlParser.safeLoad(data?.getOpenApi.spec) as OpenApi}
                />
              )}
            </Typography>
          </AccordionItem>
        </Accordion>
      </div>
    </Box>
  )
}
