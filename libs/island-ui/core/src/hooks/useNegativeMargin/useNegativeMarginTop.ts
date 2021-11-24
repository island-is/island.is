import classnames from 'classnames'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styleRefs from './useNegativeMarginTop.css'

export const useNegativeMarginTop = (space: ResponsiveProp<any>) => {
  const styles = {
    ...styleRefs,
  }

  const negativeMarginTop = resolveResponsiveProp(
    space,
    styles.xs,
    styles.sm,
    styles.md,
    styles.lg,
    styles.xl,
  )
  return classnames(styles.base, negativeMarginTop)
}
