import React from 'react'
import { AccordionItem, Box } from '@island.is/island-ui/core'
import * as styles from './ServiceFilter.treat'
import cn from 'classnames'
import { CategoryCheckBox, InputSearch } from '..'
import { ContentfulString } from '../../services/contentful.types'
import { GetApiCatalogueInput } from '@island.is/api/schema'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

type IconVariantTypes = 'default' | 'sidebar'

export interface ServiceFilterProps {
  rootClasses: string
  isLoading: boolean
  iconVariant?: IconVariantTypes
  parameters: GetApiCatalogueInput
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onCheckCategoryChanged: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  strings: Array<ContentfulString>
}

export const ServiceFilter = (props: ServiceFilterProps) => {
  return (
    <Box className={props.rootClasses + ' filterX'}>
      <Box className={cn(styles.inputSearch)}>
        <span onClick={props.onClear} className={cn(styles.clear)}>
          Hreinsa
        </span>
        <InputSearch
          name="text-search"
          value={props.parameters.query}
          loading={props.isLoading}
          placeholder={
            props.strings.find((s) => s.id === 'catalog-filter-search').text
          }
          colored={props.parameters.query.length < 1}
          onChange={props.onInputChange}
        />
      </Box>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="pricing_category"
          label={
            props.strings.find((s) => s.id === 'catalog-filter-pricing').text
          }
          labelVariant="sideMenu"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-pricing-free')
                .text
            }
            name="pricing"
            value={PricingCategory.FREE}
            checked={props.parameters.pricing.includes(PricingCategory.FREE)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-pricing-paid')
                .text
            }
            name="pricing"
            value={PricingCategory.PAID}
            checked={props.parameters.pricing.includes(PricingCategory.PAID)}
            onChange={props.onCheckCategoryChanged}
          />
        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="data_category"
          label={props.strings.find((s) => s.id === 'catalog-filter-data').text}
          labelVariant="sideMenu"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-data-public')
                .text
            }
            name="data"
            value={DataCategory.PUBLIC}
            checked={props.parameters.data.includes(DataCategory.PUBLIC)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-data-official')
                .text
            }
            name="data"
            value={DataCategory.OFFICIAL}
            checked={props.parameters.data.includes(DataCategory.OFFICIAL)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-data-personal')
                .text
            }
            name="data"
            value={DataCategory.PERSONAL}
            checked={props.parameters.data.includes(DataCategory.PERSONAL)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-data-health')
                .text
            }
            name="data"
            value={DataCategory.HEALTH}
            checked={props.parameters.data.includes(DataCategory.HEALTH)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find(
                (s) => s.id === 'catalog-filter-data-financial',
              ).text
            }
            name="data"
            value={DataCategory.FINANCIAL}
            checked={props.parameters.data.includes(DataCategory.FINANCIAL)}
            onChange={props.onCheckCategoryChanged}
          />
        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="type_category"
          label={props.strings.find((s) => s.id === 'catalog-filter-type').text}
          labelVariant="sideMenu"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-type-react')
                .text
            }
            name="type"
            value={TypeCategory.REST}
            checked={props.parameters.type.includes(TypeCategory.REST)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-type-soap')
                .text
            }
            name="type"
            value={TypeCategory.SOAP}
            checked={props.parameters.type.includes(TypeCategory.SOAP)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-type-graphql')
                .text
            }
            name="type"
            value={TypeCategory.GRAPHQL}
            checked={props.parameters.type.includes(TypeCategory.GRAPHQL)}
            onChange={props.onCheckCategoryChanged}
          />
        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="access_category"
          label={
            props.strings.find((s) => s.id === 'catalog-filter-access').text
          }
          labelVariant="sideMenu"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-access-xroad')
                .text
            }
            name="access"
            value={AccessCategory.XROAD}
            checked={props.parameters.access.includes(AccessCategory.XROAD)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={
              props.strings.find((s) => s.id === 'catalog-filter-access-apigw')
                .text
            }
            name="access"
            value={AccessCategory.APIGW}
            checked={props.parameters.access.includes(AccessCategory.APIGW)}
            onChange={props.onCheckCategoryChanged}
          />
        </AccordionItem>
      </div>
    </Box>
  )
}
