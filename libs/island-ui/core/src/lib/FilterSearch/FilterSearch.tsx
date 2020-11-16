import React, { Component } from 'react'
import * as styles from './FilterSearch.treat'
import cn from 'classnames'

import { Box, Button, Icon, IconProps, InputSearch,Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'


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
  labelCloseButton:string,
  labelResultButton:string,
  type?:FilterSearchType
  inputValues?:InputValues,
  clearValues?:ClearValues,
  className?: string
  searchInput?:Component,
  children?: JSX.Element | JSX.Element[];
}


export const FilterSearch: React.FC<FilterSearchProps> = ({
  id,
  label,
  labelCloseButton = 'Close filter',
  labelResultButton = 'View Results',
  type = 'default',
  inputValues,
  clearValues,
  className= null,
  children,
}) => {


  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)
  const [isVisalbe, setIsVisible] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])
  
  const showDesktopFilter = () => {
    return (
      <Box className={
        type === 'default'
          ? `filter-search ${isMobile? cn(styles.rootMobile): cn(styles.root)} ${className}`
          : `filter-search ${className}`
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
  
      <div className={cn(styles.groupContainer)}>
      {children}
      </div>
      {clearValues?
        (
          <span className={cn(styles.clear)}>
            <Button
              colorScheme="default"
              icon="ellipse"
              iconType="outline"
              onBlur={function noRefCheck(){}}
              onClick={clearValues.onClick}
              onFocus={function noRefCheck(){}}
              size="default"
              type="button"
              variant="text"
            >
              {clearValues.text}
            </Button>
          </span>
        ):("")
      }
    </Box>
  )
  }


  const makeWideIconButton = (
    label: string,
    onItemClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    iconProps: IconProps) => {
    return (

      <span className={cn(styles.wideIconButton)}
        onClick={onItemClick}
      >
        <Text variant="h4" color="blue600">{label}</Text>
        <Icon
          color={iconProps.color}
          icon={iconProps.icon}
          size="large"
          type="filled"
        />
      </span>
    )
  }
  const showMobileFilter = () => {
    return (
      <Box className={
        type === 'default'
          ? `${className ? className : ""} ${cn(styles.filterContentMobile)} filter-search`
          : `${className ? className : ""} filter-search`
      } >
        <div className={styles.mobileCloseButton}>
          {makeWideIconButton(
            labelCloseButton,
            () => { setIsVisible(false) },
            {
              color: "blue400",
              icon: "closeCircle"
            },
          )
          }
        </div>

        { inputValues ?
          (<Box className={cn(styles.inputSearch)}>

            <InputSearch
              placeholder={inputValues.placeholder}
              value={inputValues?.value}
              loading={inputValues.isLoading}
              colored={inputValues.colored}
              onChange={inputValues?.onChange}
            />
          </Box>) : ""
        }

        <div className={cn(styles.groupContainerMobile)}>
          {children}
        </div>
        {clearValues ?
          (
            <span className={cn(styles.clear)}>
            <Button
              colorScheme="default"
              icon="ellipse"
              iconType="outline"
              onBlur={function noRefCheck(){}}
              onClick={clearValues.onClick}
              onFocus={function noRefCheck(){}}
              size="default"
              type="button"
              variant="text"
            >
              {clearValues.text}
            </Button>
          </span>
          ) : ("")
        }
        
      </Box>
    )
  }


  return (
    isMobile ?
      <Box className={cn(styles.rootMobile)}>

        {isVisalbe ?
        <span>
          {showMobileFilter()}
          <div className={cn(styles.labelResultButton)}>
          <Button
            colorScheme="default"
            iconType="filled"
            variant="primary"
            size="small"
            type="button"
            onBlur={function noRefCheck() { }}
            onFocus={function noRefCheck() { }}
            onClick={() => { setIsVisible(false) }}
          >
            {labelResultButton}
          </Button>
        </div>
        </span>
          :
          (
          <div>
            { makeWideIconButton(
            label, 
            () => {setIsVisible(true)},
            {
              color:"blue400",
              icon:"menu"
            },
          )
        }
          </div>
          )
        }
      </Box>
      :
      showDesktopFilter()
  )
};