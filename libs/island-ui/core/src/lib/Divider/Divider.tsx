import React from 'react'
import { Box } from '../Box/Box'
import * as styleRefs from './Divider.css'

export interface DividerProps {
  weight?: keyof typeof styleRefs.weight
}

const defaultWeight = 'regular'

export const Divider = ({ weight = defaultWeight }: DividerProps) => {
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
        ]}
      />
    </Box>
  )
}
