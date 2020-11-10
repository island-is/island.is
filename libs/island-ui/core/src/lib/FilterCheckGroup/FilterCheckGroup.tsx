import React from 'react'
import * as styles from './FilterCheckGroup.treat'
import cn from 'classnames'

import { AccordionItem, Box, Checkbox, InputSearch, Stack } from '@island.is/island-ui/core'
import { TextVariants } from '../Text/Text.treat'

type IconVariantTypes = 'default' | 'sidebar'

export interface FilterCheckGroupProps  {
  id:string
  label:string,
  labelVariant?:TextVariants,
  iconVariant?:IconVariantTypes,
  className?: string,
  children?: JSX.Element | JSX.Element[];
}

export const FilterCheckGroup: React.FC<FilterCheckGroupProps> = ({
  id,
  label,
  labelVariant="h5",
  iconVariant="default",
  className,
  children,
}) => {
  return (
    <Box className={`${className? className : ""} stuff`}>
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
                <Stack space="gutter">
                  <div className={cn(styles.categoryCheckbox, 'category-checkbox')}>
                    {child}
                  </div>
                </Stack>
              )
            })
          }
    </AccordionItem>
    </div>
  </Box>
)
};