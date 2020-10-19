import classnames from 'classnames'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styleRefs from './useNegativeMarginLeft.treat'

export const useNegativeMarginLeft = (space: ResponsiveProp<any>) => {
  const styles = {
    ...styleRefs,
  }

  return classnames(
    resolveResponsiveProp(
      space,
      styles.xs,
      styles.sm,
      styles.md,
      styles.lg,
      styles.xl,
    ),
  )
}
