import React from 'react'
import { AccordionItem, Box } from '@island.is/island-ui/core'
import * as styles from './ServiceFilter.treat'
import cn from 'classnames'
import { CategoryCheckBox, InputSearch } from '..'
import { GetApiCatalogueInput } from '@island.is/api/schema'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

type IconVariantTypes = 'default' | 'sidebar'

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
  strings: GetNamespaceQuery['getNamespace']
}

export const ServiceFilter = (props: ServiceFilterProps) => {
  const n = useNamespace(props.strings)

  return (
    <Box className={props.rootClasses + ' filterX'}>
      <Box className={cn(styles.inputSearch)}>
        <span onClick={props.onClear} className={cn(styles.clear)}>
          Hreinsa
        </span>
        <InputSearch
          name="text-search"
          value={
            props.parameters?.query === null ? '' : props.parameters?.query
          }
          loading={props.isLoading}
          placeholder={n('search')}
          colored={props.parameters.query?.length < 1}
          onChange={props.onInputChange}
        />
      </Box>
      <div className={cn(styles.filterItem)}>
        <AccordionItem
          id="pricing_category"
          label={n('pricing')}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={n('pricingFree')}
            name="pricing"
            value={PricingCategory.FREE}
            checked={props.parameters.pricing.includes(PricingCategory.FREE)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('pricingPaid')}
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
          label={n('data')}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={n('dataPublic')}
            name="data"
            value={DataCategory.PUBLIC}
            checked={props.parameters.data.includes(DataCategory.PUBLIC)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('dataOfficial')}
            name="data"
            value={DataCategory.OFFICIAL}
            checked={props.parameters.data.includes(DataCategory.OFFICIAL)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('dataPersonal')}
            name="data"
            value={DataCategory.PERSONAL}
            checked={props.parameters.data.includes(DataCategory.PERSONAL)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('dataHealth')}
            name="data"
            value={DataCategory.HEALTH}
            checked={props.parameters.data.includes(DataCategory.HEALTH)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('dataFinancial')}
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
          label={n('type')}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={n('typeRest')}
            name="type"
            value={TypeCategory.REST}
            checked={props.parameters.type.includes(TypeCategory.REST)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('typeSoap')}
            name="type"
            value={TypeCategory.SOAP}
            checked={props.parameters.type.includes(TypeCategory.SOAP)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('typeGraphql')}
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
          label={n('access')}
          labelVariant="h5"
          iconVariant={props.iconVariant}
        >
          <CategoryCheckBox
            label={n('accessXroad')}
            name="access"
            value={AccessCategory.XROAD}
            checked={props.parameters.access.includes(AccessCategory.XROAD)}
            onChange={props.onCheckCategoryChanged}
          />
          <CategoryCheckBox
            label={n('accessApigw')}
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
