import React, { useState } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './TreeSlider.css'
import { Controller } from 'react-hook-form'
import { theme } from '@island.is/island-ui/theme'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale } from '@island.is/localization'

import { treeSliderConfig } from '../../lib/constants'
import { Tree } from '../../assets/Tree'
import { draft } from '../../lib/messages'
import { Slider } from '@island.is/application/ui-components'

export const TreeSlider = () => {
  const { formatMessage } = useLocale()
  const [numberOfTrees, setNumberOfTrees] = useState(0)
  const { sizes, zIndices } = treeSliderConfig

  return (
    <>
      <Box display="flex" alignItems="flexEnd" style={{ minHeight: '176px' }}>
        <AnimatePresence>
          {[...Array.from({ length: numberOfTrees })].map((_, i) => {
            return (
              <motion.div
                key={`tree-${i}`}
                className={styles.treeWrapper}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, transition: { ease: 'linear' } }}
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
        <Box marginBottom={12}>
          <Controller
            defaultValue={numberOfTrees}
            name={'numberOfTrees'}
            render={({ field: { onChange } }) => (
              <Slider
                min={0}
                max={20}
                step={1}
                currentIndex={numberOfTrees}
                showMinMaxLabels
                showToolTip
                trackStyle={{ gridTemplateRows: 10 }}
                onChange={(newValue: number) => {
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
        <Text>
          {formatMessage(draft.treeSliderCo2EffectDescriptor, {
            trees: numberOfTrees,
            co2: (numberOfTrees * 0.1).toFixed(1),
          })}
        </Text>
      </Box>
    </>
  )
}
