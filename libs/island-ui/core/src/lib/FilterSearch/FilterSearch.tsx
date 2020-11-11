import React, { Component } from 'react'
import * as styles from './FilterSearch.treat'
import cn from 'classnames'

import { AccordionItem, Box, Checkbox, InputSearch, Stack } from '@island.is/island-ui/core'
import { TextVariants } from '../Text/Text.treat'

type IconVariantTypes = 'default' | 'sidebar'

export type InputValues = {
  placeholder:string,
  isLoading:boolean,
  colored:boolean,
  value?:string,
  valueDoUpdate?:string,
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}
export type ClearValues = {
  text:string,
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
  
}

//todo: Þarf að bjóða upp á að nota default Classes í grunn og bæta custom classes ofaná
//todo: þarf að bjóða upp á að nota EKKI default classes í grunn, heldur bara þá sem eru

export interface FilterSearchProps  {
  inputValues?:InputValues,
  clearValues?:ClearValues,
  className?: string
  searchInput?:Component,
  children?: JSX.Element | JSX.Element[];
}


export const FilterSearch: React.FC<FilterSearchProps> = ({
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
          {clearValues.text}
        </span>
      ):("")
    }
  </Box>
)
};