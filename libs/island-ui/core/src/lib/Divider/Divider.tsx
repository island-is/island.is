import React from 'react'
import { Box } from '../Box/Box'
import * as styleRefs from './Divider.css'

export interface DividerProps {
  weight?: keyof typeof styleRefs.weight
  thickness?: keyof typeof styleRefs.thickness
}

const defaultWeight = 'regular'
const defaultThickness = 'standard'
export const Divider = ({
  weight = defaultWeight,
  thickness = defaultThickness,
}: DividerProps) => {
  const styles = {
    ...styleRefs,
  }

  return (
    <Box position="relative">
      <Box
        position="absolute"
        width="full"
        className={[
          styles.base,
          styles.weight[weight] || styles.weight[defaultWeight],
          styles.thickness[thickness] || styles.thickness[defaultThickness],
        ]}
      />
    </Box>
  )
}
