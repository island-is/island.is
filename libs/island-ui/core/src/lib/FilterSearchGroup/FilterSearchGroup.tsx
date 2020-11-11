import React from 'react'
import * as styles from './FilterSearchGroup.treat'
import cn from 'classnames'

import { AccordionItem, Box, Checkbox, InputSearch, Stack } from '@island.is/island-ui/core'
import { TextVariants } from '../Text/Text.treat'

type IconVariantTypes = 'default' | 'sidebar'

export interface FilterSearchGroupProps  {
  id:string
  label:string,
  labelVariant?:TextVariants,
  iconVariant?:IconVariantTypes,
  className?: string,
  children?: JSX.Element | JSX.Element[];
}

export const FilterSearchGroup: React.FC<FilterSearchGroupProps> = ({
  id,
  label,
  labelVariant="h5",
  iconVariant="sidebar",
  className,
  children,
}) => {
  return (
    <Box className={className? className : ""}>
    <div className={cn(styles.filterItem)}>
    <AccordionItem
          id={id}
          label={label}
          labelVariant={labelVariant}
          iconVariant={iconVariant}
        >
          {
            React.Children.map(children, (child) => {
              return (
                  <div className={cn(styles.filterGroupItem, 'category-checkbox')}>
                    {child}
                  </div>
              )
            })
          }
    </AccordionItem>
    </div>
  </Box>
)
};