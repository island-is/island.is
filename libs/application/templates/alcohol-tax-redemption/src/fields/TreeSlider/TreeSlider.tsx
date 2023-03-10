import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useFormContext, Controller } from 'react-hook-form'
import * as styles from './TreeSlider.css'
import Slider from '../Components/SliderWithGraphic/Slider/Slider'
import { theme } from '@island.is/island-ui/theme'
import { Text } from '@island.is/island-ui/core'
import { Tree } from '../../assets/Tree'
import { AnimatePresence, motion } from 'framer-motion'
import random from 'lodash/random'

const MIN_SIZE = 48,
  MAX_SIZE = 96
const sizes: number[] = []
const zIndices: number[] = []

export const TreeSlider = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [numberOfTrees, setNumberOfTrees] = useState(0)

  return (
    <>
      <Box
        display="flex"
        alignItems="flexEnd"
        style={{ height: `${MAX_SIZE * 2}px` }}
      >
        <AnimatePresence>
          {[...Array.from({ length: numberOfTrees })].map((_, i) => {
            if (sizes[i] === undefined) {
              sizes.push(random(MIN_SIZE, MAX_SIZE))
            }
            if (zIndices[i] === undefined) {
              zIndices.push(Math.round(random(1, 2)))
            }
            return (
              <motion.div
                key={`tree-${i}`}
                className={styles.treeWrapper}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, transition: { type: 'linear' } }}
                transition={{ type: 'spring', bounce: 0.25 }}
                style={{
                  fontSize: `${sizes[i]}px`,
                  zIndex: zIndices[i],
                  marginLeft: i > 0 ? `-${sizes[i] / 2}px` : 0,
                }}
              >
                <Tree />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </Box>
      <Box
        marginBottom={4}
        marginTop={1}
        paddingTop={6}
        paddingX={3}
        paddingBottom={3}
      >
        <Text marginBottom={6} variant="h4">
          'Tré veijj'
        </Text>
        <Box marginBottom={12}>
          <Controller
            defaultValue={numberOfTrees}
            name={'treesomtehing'}
            render={({ onChange }) => (
              <Slider
                min={0}
                max={20}
                step={1}
                currentIndex={numberOfTrees}
                showMinMaxLabels
                showToolTip
                trackStyle={{ gridTemplateRows: 5 }}
                onChange={(newValue: number) => {
                  console.log(newValue)
                  console.log(numberOfTrees)
                  if (!isNaN(newValue)) {
                    onChange(newValue)
                    setNumberOfTrees(newValue)
                  }
                }}
                label={{
                  singular: 'Tré',
                  plural: 'Tré',
                }}
                calculateCellStyle={() => {
                  return {
                    background: theme.color.dark200,
                  }
                }}
              />
            )}
          />
        </Box>
      </Box>
    </>
  )
}
