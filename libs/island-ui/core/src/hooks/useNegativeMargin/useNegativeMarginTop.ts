import classnames from 'classnames'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styleRefs from './useNegativeMarginTop.treat'

type NegativeMarginTop = Extract<
  Extract<keyof typeof styleRefs.xs, keyof typeof styleRefs.sm>,
  Extract<keyof typeof styleRefs.xs, keyof typeof styleRefs.xl>
>

export const useNegativeMarginTop = (
  space: ResponsiveProp<NegativeMarginTop>,
) => {
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
