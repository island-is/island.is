import React, { Component } from 'react'
import * as styles from './FilterSearch.treat'
import cn from 'classnames'

import { AccordionItem, Box, Icon, InputSearch } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { TextVariants } from '../Text/Text.treat'


export type IconVariantTypes = 'default' | 'sidebar'

export type InputValues = {
  placeholder:string,
  isLoading:boolean,
  colored:boolean,
  value?:string,
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}
export type ClearValues = {
  text:string,
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  
}

// 'default': The component will be styled with default styles and all styles
//            provided in ClassName will be added also.
// 'noStyles: The component will not use any styles, only styles provided in
//            ClassName will be used.

export type FilterSearchType = 'default' | 'noStyles'

export interface FilterSearchProps  {
  id:string,
  label:string,
  type?:FilterSearchType
  inputValues?:InputValues,
  clearValues?:ClearValues,
  className?: string
  searchInput?:Component,
  iconVariant?:IconVariantTypes,
  labelVariant?:TextVariants,
  children?: JSX.Element | JSX.Element[];
}


export const FilterSearch: React.FC<FilterSearchProps> = ({
  id,
  label,
  type = 'default',
  iconVariant = 'default',
  labelVariant="default",
  inputValues,
  clearValues,
  className,
  children,
}) => {


  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])
  
  const showContent = () => {
    return (
      <Box className={
        type === 'default'
          ? `${className ? className : ""} ${isMobile? cn(styles.rootMobile): cn(styles.root)}  filter-search`
          : `${className ? className : ""} filter-search`
      } >
      { inputValues?
        (<Box className={cn(styles.inputSearch)}>
            
            <InputSearch
              placeholder={inputValues.placeholder}
              value={inputValues?.value}
              loading={inputValues.isLoading}
              colored={inputValues.colored}
              onChange={inputValues?.onChange}
            />
          </Box>):""
        }
  
      <div className={cn(styles.filterItem)}>
      {children}
      </div>
      {clearValues?
        (
          <span onClick={clearValues.onClick} className={cn(styles.clear)}>
            {clearValues.text} <Icon icon="home" size="small" className={cn(styles.clearIcon)} />
          </span>
        ):("")
      }
    </Box>
  )
  }


  return (
    isMobile?
      <AccordionItem
              id={id}
              label={label}
              labelVariant={labelVariant}
              iconVariant={iconVariant}
            >
              {showContent()}
      </AccordionItem>
    :
    showContent()
  )
};