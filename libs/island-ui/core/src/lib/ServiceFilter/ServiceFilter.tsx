import React from 'react'
import { AccordionItem, Box, Checkbox, InputSearch, Stack } from '@island.is/island-ui/core'
import * as styles from './ServiceFilter.treat'
import cn from 'classnames'
import { GetApiCatalogueInput } from '@island.is/api/schema'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

type IconVariantTypes = 'default' | 'sidebar'

export type ContentfulString = {
  id: string
  text: string
}

export interface ServiceFilterProps {
  rootClasses: string
  isLoading: boolean
  iconVariant?: IconVariantTypes
  parameters: GetApiCatalogueInput
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onCheckCategoryChanged: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  strings: Array<ContentfulString>
}

export const ServiceFilter = (props: ServiceFilterProps) => {

  type CreateCheckboxParams = {
    name:string
    label:string
    value:string
    checked:boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    tooltip:string
  }

  const createCheckBox = (values: CreateCheckboxParams) => {
    return (
      <Stack space="gutter">
        <div className={cn(styles.categoryCheckbox, 'category-checkbox')}>
          <Checkbox
            name={values.name}
            id={'check-category-' + values.value}
            label={values.label}
            value={values.value}
            checked={values.checked}
            onChange={values.onChange}
            tooltip={values.tooltip}
          />
        </div>
      </Stack>

    )

  }
  return (
    <Box className={props.rootClasses + ' filterX'}>
      <Box className={cn(styles.inputSearch)}>
        <span onClick={props.onClear} className={cn(styles.clear)}>
          Hreinsa
        </span>
        <InputSearch
          value={
            props.parameters?.query === null ? '' : props.parameters?.query
          }
          loading={props.isLoading}
          placeholder={
            props.strings.find((s) => s.id === 'catalog-filter-search').text
          }
          colored={props.parameters.query?.length < 1}
          onChange={props.onInputChange}
        />
      </Box>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="pricing_category"
          label={
            props.strings.find((s) => s.id === 'catalog-filter-pricing').text
          }
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          {createCheckBox({
            name: 'pricing',
            label: props.strings.find((s) => s.id === 'catalog-filter-pricing-free').text,
            value: PricingCategory.FREE,
            checked: props.parameters.pricing.includes(PricingCategory.FREE),
            onChange: props.onCheckCategoryChanged,
            tooltip: null
          })}
         
          {createCheckBox({
            name: 'pricing',
            label: props.strings === undefined ? "" : props.strings.find((s) => s.id === 'catalog-filter-pricing-paid').text,
            value: PricingCategory.PAID,
            checked: props.parameters.pricing.includes(PricingCategory.PAID),
            onChange: props.onCheckCategoryChanged,
            tooltip: null
          })}
        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="data_category"
          label={props.strings.find((s) => s.id === 'catalog-filter-data').text}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
           {createCheckBox( {
            name    :'data', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-data-public').text,
            value   :DataCategory.PUBLIC,
            checked :props.parameters.data.includes(DataCategory.PUBLIC),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'data', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-data-official').text,
            value   :DataCategory.OFFICIAL,
            checked :props.parameters.data.includes(DataCategory.OFFICIAL),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'data', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-data-personal').text,
            value   :DataCategory.PERSONAL,
            checked :props.parameters.data.includes(DataCategory.PERSONAL),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'data', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-data-health').text,
            value   :DataCategory.HEALTH,
            checked :props.parameters.data.includes(DataCategory.HEALTH),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'data', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-data-financial').text,
            value   :DataCategory.FINANCIAL,
            checked :props.parameters.data.includes(DataCategory.FINANCIAL),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}

        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="type_category"
          label={props.strings.find((s) => s.id === 'catalog-filter-type').text}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          {createCheckBox( {
            name    :'type', 
            label:props.strings.find((s) => s.id === 'catalog-filter-type-rest').text,
            value   :TypeCategory.REST,
            checked :props.parameters.type.includes(TypeCategory.REST),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'type', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-type-soap').text,
            value   :TypeCategory.SOAP,
            checked :props.parameters.type.includes(TypeCategory.SOAP),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'type', 
            label   :props.strings.find((s) => s.id === 'catalog-filter-type-graphql').text,
            value   :TypeCategory.GRAPHQL,
            checked :props.parameters.type.includes(TypeCategory.GRAPHQL),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}

        </AccordionItem>
      </div>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="access_category"
          label={
            props.strings.find((s) => s.id === 'catalog-filter-access').text
          }
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          {createCheckBox( {
            name    :'access', 
            label:props.strings.find((s) => s.id === 'catalog-filter-access-xroad').text,
            value   :AccessCategory.XROAD,
            checked :props.parameters.access.includes(AccessCategory.XROAD),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}
          {createCheckBox( {
            name    :'access', 
            label:props.strings.find((s) => s.id === 'catalog-filter-access-apigw').text,
            value   :AccessCategory.APIGW,
            checked :props.parameters.access.includes(AccessCategory.APIGW),
            onChange:props.onCheckCategoryChanged,
            tooltip :null 
          })}

        </AccordionItem>
      </div>
    </Box>
  )
}
