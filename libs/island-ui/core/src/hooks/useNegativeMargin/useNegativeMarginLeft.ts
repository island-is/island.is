import classnames from 'classnames'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styleRefs from './useNegativeMarginLeft.treat'

type NegativeMarginLeft = Extract<
  Extract<keyof typeof styleRefs.xs, keyof typeof styleRefs.sm>,
  Extract<keyof typeof styleRefs.xs, keyof typeof styleRefs.xl>
>

export const useNegativeMarginLeft = (
  space: ResponsiveProp<NegativeMarginLeft>,
) => {
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
