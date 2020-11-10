import React, { Component } from 'react'
import * as styles from './FilterSearch.treat'
import cn from 'classnames'

import { AccordionItem, Box, Checkbox, InputSearch, Stack } from '@island.is/island-ui/core'
import { TextVariants } from '../Text/Text.treat'

type IconVariantTypes = 'default' | 'sidebar'

export type InputValues = {
  placeholder:string,
  colored:boolean,
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}
export type ClearValues = {
  text:string,
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  
}
export interface FilterSearchProps  {
  id:string
  label:string,
  labelVariant?:TextVariants,
  iconVariant?:IconVariantTypes,
  isLoading?:boolean,
  inputValues?:InputValues,
  clearValues?:ClearValues,
  className?: string
  searchInput?:Component,
  children?: JSX.Element | JSX.Element[];
}


export const FilterSearch: React.FC<FilterSearchProps> = ({
  id,
  label,
  labelVariant="h5",
  iconVariant="default",
  isLoading,
  inputValues,
  clearValues,
  className,
  children,
}) => {
  return (
    <Box className={`${className? className : ""} FilterSearch`}>

    { inputValues?
      (<Box className={cn(styles.inputSearch)}>
          
          <InputSearch
            loading={isLoading}
            placeholder={inputValues.placeholder}
            colored={inputValues.colored}
            onChange={inputValues?.onChange}
          />
        </Box>):"XXXX"
      }

    <div className={cn(styles.filterItem)}>
    {children}
    </div>
    {clearValues?
      (
        <span onClick={clearValues.onClick} className={cn(styles.clear)}>
          {clearValues.text}
        </span>
      ):("")
    }
  </Box>
)
};