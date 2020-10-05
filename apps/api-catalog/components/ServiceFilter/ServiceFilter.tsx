import React from 'react'
import { AccordionItem, Box } from '@island.is/island-ui/core'
import * as styles from './ServiceFilter.treat';
import cn from 'classnames'
import { 
  ACCESS_CATEGORY, 
  CategoryCheckBox, 
  DATA_CATEGORY, 
  GetServicesParameters, 
  InputSearch, 
  PRICING_CATEGORY, 
  TYPE_CATEGORY } from '..';

import { ContentfulString } from '../../services/contentful.types';

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
    strings: Array<ContentfulString>
}

export const ServiceFilter = (props: ServiceFilterProps) => {

    return (
        <Box  className={props.rootClasses + " filterX"}>
                <Box className={cn(styles.inputSearch)}>
                  <InputSearch 
                    name="text-search"
                    value={props.searchValue}
                    loading={props.isLoading}
                    placeholder={props.strings.find(s => s.id === 'catalog-filter-search').text}
                    colored={ props.searchValue.length < 1 }
                    onChange={props.onInputChange}
                  />
              </Box>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="pricing_category" label={props.strings.find(s => s.id === 'catalog-filter-pricing').text} labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-pricing-free').text}   
                    value={PRICING_CATEGORY.FREE}   
                    checked={props.parameters.pricing.includes(PRICING_CATEGORY.FREE)}   
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-pricing-paid').text}   
                    value={PRICING_CATEGORY.PAID}   
                    checked={props.parameters.pricing.includes(PRICING_CATEGORY.PAID)}   
                    onChange={props.onCheckCategoryChanged} 
                  />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
              <AccordionItem  id="data_category" label={props.strings.find(s => s.id === 'catalog-filter-data').text} labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-data-public').text}    
                    value={DATA_CATEGORY.PUBLIC}    
                    checked={props.parameters.data.includes(DATA_CATEGORY.PUBLIC)}    
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-data-official').text}  
                    value={DATA_CATEGORY.OFFICIAL}  
                    checked={props.parameters.data.includes(DATA_CATEGORY.OFFICIAL)}  
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-data-personal').text}  
                    value={DATA_CATEGORY.PERSONAL}  
                    checked={props.parameters.data.includes(DATA_CATEGORY.PERSONAL)}  
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-data-health').text}    
                    value={DATA_CATEGORY.HEALTH}    
                    checked={props.parameters.data.includes(DATA_CATEGORY.HEALTH)}    
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-data-financial').text} 
                    value={DATA_CATEGORY.FINANCIAL} 
                    checked={props.parameters.data.includes(DATA_CATEGORY.FINANCIAL)} 
                    onChange={props.onCheckCategoryChanged} 
                  />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="type_category" label={props.strings.find(s => s.id === 'catalog-filter-type').text} labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-type-react').text}   
                    value={TYPE_CATEGORY.REST}   
                    checked={props.parameters.type.includes(TYPE_CATEGORY.REST)}   
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-type-soap').text}    
                    value={TYPE_CATEGORY.SOAP}    
                    checked={props.parameters.type.includes(TYPE_CATEGORY.SOAP)}    
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-type-graphql').text} 
                    value={TYPE_CATEGORY.GRAPHQL} 
                    checked={props.parameters.type.includes(TYPE_CATEGORY.GRAPHQL)} 
                    onChange={props.onCheckCategoryChanged} 
                  />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="access_category" label={props.strings.find(s => s.id === 'catalog-filter-access').text} labelVariant="sideMenu" iconVariant={props.iconVariant}>
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-access-xroad').text} 
                    value={ACCESS_CATEGORY.X_ROAD}  
                    checked={props.parameters.access.includes(ACCESS_CATEGORY.X_ROAD)} 
                    onChange={props.onCheckCategoryChanged} 
                  />
                  <CategoryCheckBox 
                    label={props.strings.find(s => s.id === 'catalog-filter-access-apigw').text} 
                    value={ACCESS_CATEGORY.API_GW}  
                    checked={props.parameters.access.includes(ACCESS_CATEGORY.API_GW)} 
                    onChange={props.onCheckCategoryChanged} 
                  />
                </AccordionItem>
              </div>
          </Box>
    )
}