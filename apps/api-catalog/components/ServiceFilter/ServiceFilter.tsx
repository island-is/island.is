import React from 'react'
import { AccordionItem, Box } from '@island.is/island-ui/core'
import * as styles from './ServiceFilter.treat';
import cn from 'classnames'
import { ACCESS_CATEGORY, CategoryCheckBox, DATA_CATEGORY, GetServicesParameters, InputSearch, PRICING_CATEGORY, TYPE_CATEGORY } from '..';

type IconVariantTypes = 'default' | 'sidebar'

export interface ServiceFilterProps {
    rootClasses:string
    searchValue: string
    isLoading: boolean
    iconVariant?: IconVariantTypes
    parameters: GetServicesParameters
    onInputChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void
    onCheckCategoryChanged: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ServiceFilter = (props: ServiceFilterProps) => {

    return (
        <Box  className={props.rootClasses + " filterX"}>
                <Box className={cn(styles.inputSearch)}>
                  <InputSearch 
                    name="text-search"
                    value={props.searchValue}
                    loading={props.isLoading}
                    placeholder="Leita"
                    colored={ props.searchValue.length < 1 }
                    onChange={props.onInputChange}
                  />
              </Box>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="pricing_category" label="Pricing" labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox label={PRICING_CATEGORY.FREE}   value={PRICING_CATEGORY.FREE}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.FREE)}   onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={PRICING_CATEGORY.PAID}   value={PRICING_CATEGORY.PAID}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.PAID)}   onChange={props.onCheckCategoryChanged} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
              <AccordionItem  id="data_category" label="Data" labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox label={DATA_CATEGORY.PUBLIC}    value={DATA_CATEGORY.PUBLIC}    checked={props.parameters.data.includes(DATA_CATEGORY.PUBLIC)}    onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={DATA_CATEGORY.OFFICIAL}  value={DATA_CATEGORY.OFFICIAL}  checked={props.parameters.data.includes(DATA_CATEGORY.OFFICIAL)}  onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={DATA_CATEGORY.PERSONAL}  value={DATA_CATEGORY.PERSONAL}  checked={props.parameters.data.includes(DATA_CATEGORY.PERSONAL)}  onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={DATA_CATEGORY.HEALTH}    value={DATA_CATEGORY.HEALTH}    checked={props.parameters.data.includes(DATA_CATEGORY.HEALTH)}    onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={DATA_CATEGORY.FINANCIAL} value={DATA_CATEGORY.FINANCIAL} checked={props.parameters.data.includes(DATA_CATEGORY.FINANCIAL)} onChange={props.onCheckCategoryChanged} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="type_category" label="Type" labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox label={TYPE_CATEGORY.REACT}   value={TYPE_CATEGORY.REACT}   checked={props.parameters.type.includes(TYPE_CATEGORY.REACT)}   onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={TYPE_CATEGORY.SOAP}    value={TYPE_CATEGORY.SOAP}    checked={props.parameters.type.includes(TYPE_CATEGORY.SOAP)}    onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={TYPE_CATEGORY.GRAPHQL} value={TYPE_CATEGORY.GRAPHQL} checked={props.parameters.type.includes(TYPE_CATEGORY.GRAPHQL)} onChange={props.onCheckCategoryChanged} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="access_category" label="Access" labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox label={ACCESS_CATEGORY.X_ROAD} value={ACCESS_CATEGORY.X_ROAD}  checked={props.parameters.access.includes(ACCESS_CATEGORY.X_ROAD)} onChange={props.onCheckCategoryChanged} />
                  <CategoryCheckBox label={ACCESS_CATEGORY.API_GW} value={ACCESS_CATEGORY.API_GW}  checked={props.parameters.access.includes(ACCESS_CATEGORY.API_GW)} onChange={props.onCheckCategoryChanged} />
                </AccordionItem>
              </div>
          </Box>
    )
}