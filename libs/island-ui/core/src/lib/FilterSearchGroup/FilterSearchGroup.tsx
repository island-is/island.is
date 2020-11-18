import React from 'react'
import * as styles from './FilterSearchGroup.treat'
import cn from 'classnames'
import { AccordionItem} from '../Accordion/AccordionItem/AccordionItem'
import { Box } from '../Box/Box'
import { TextVariants } from '../Text/Text.treat'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

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
  labelVariant="h3",
  iconVariant="default",
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

  const showChildren = () => {
    {
      return (
      React.Children.map(children, (child) => {
        return (
            <div className={cn(styles.filterGroupItem)}>
              {child}
            </div>
        )
      }))
    }
  }
  
  return (
    <Box className={cn(isMobile? styles.groupItemMobile : styles.groupItem)}>
    <AccordionItem
          id={id}
          label={label}
          labelVariant={labelVariant}
          iconVariant={iconVariant}
        >
         {showChildren()} 
    </AccordionItem>
  </Box>
)
};