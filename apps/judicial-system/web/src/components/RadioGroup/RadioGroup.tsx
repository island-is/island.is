import { FC, PropsWithChildren } from 'react'
import cn from 'classnames'

import { Box } from '@island.is/island-ui/core'

import * as styles from './RadioGroup.css'

interface Props {
  // Accessible name for the radio group, exposed via the <legend>.
  legend: string
  // Hide the legend visually when the group already has an adjacent visible
  // title. The legend stays available to assistive technology.
  hideLegend?: boolean
  // Layout classes (e.g. grid/gap recipes) are applied to the <fieldset> itself
  // so wrapping the radios does not collapse the spacing between them.
  className?: string
}

// Wraps a set of RadioButtons in a <fieldset>/<legend> so screen readers
// announce them as a single, named group.
const RadioGroup: FC<PropsWithChildren<Props>> = ({
  legend,
  hideLegend = false,
  className,
  children,
}) => (
  <Box component="fieldset" className={cn(styles.fieldset, className)}>
    <Box
      component="legend"
      className={hideLegend ? styles.visuallyHiddenLegend : undefined}
    >
      {legend}
    </Box>
    {children}
  </Box>
)

export default RadioGroup
