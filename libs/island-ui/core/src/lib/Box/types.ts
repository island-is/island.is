import { AllHTMLAttributes, ElementType } from 'react'
import { UseBoxStylesProps } from './useBoxStyles'

export interface BoxProps
  extends Omit<UseBoxStylesProps, 'component'>,
    Omit<AllHTMLAttributes<HTMLElement>, 'width' | 'height' | 'className'> {
  component?: ElementType
}
