import { AnimatePresence, motion } from 'motion/react'

import { Box, Icon, LoadingDots, Text } from '@island.is/island-ui/core'
import { IconAndText } from '@island.is/judicial-system-web/src/components'
import { AnimateChildren } from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import { PoliceDigitalCaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from '../../../../components/SelectableList/SelectableList.css'

export interface PoliceDigitalCaseFilesData {
  files: PoliceDigitalCaseFile[]
  isLoading: boolean
  hasError: boolean
}

const listItemVariants = {
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
  hidden: { opacity: 0, y: 10 },
}

export const PoliceDigitalCaseFilesList = ({
  digitalCaseFiles,
  isLoading,
  errorMessage,
  onRemove,
}: {
  digitalCaseFiles: PoliceDigitalCaseFile[]
  isLoading: boolean
  errorMessage?: string
  onRemove: (file: PoliceDigitalCaseFile) => void
}) => {
  return (
    <Box
      marginTop={4}
      borderColor="blue200"
      borderWidth="standard"
      paddingX={4}
      paddingY={3}
      borderRadius="standard"
    >
      <Text variant="h4" as="h4" marginBottom={2}>
        Hljóð- og myndupptökur
      </Text>
      <AnimatePresence>
        {isLoading ? (
          <Box
            textAlign="center"
            paddingTop={1}
            paddingBottom={2}
            paddingX={3}
            key="loading-dots"
          >
            <LoadingDots />
          </Box>
        ) : errorMessage ? (
          <AnimateChildren id="error-message">
            <IconAndText
              icon="close"
              iconColor="red400"
              message={errorMessage}
            />
          </AnimateChildren>
        ) : (
          <ul className={styles.grid}>
            {digitalCaseFiles.map((item, index) => (
              <motion.li
                custom={index}
                initial="hidden"
                animate="visible"
                variants={listItemVariants}
                key={item.id}
              >
                <Box
                  key={item.id}
                  paddingX={3}
                  paddingY={2}
                  background={'blue100'}
                  borderRadius="standard"
                  display="flex"
                  justifyContent="spaceBetween"
                >
                  <Text key={`${item.id}`}>{item.name}</Text>
                  {item.isDeletable && (
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                      aria-label="Fjarlægja skrá"
                    >
                      <Icon color="blue400" icon="close" />
                    </button>
                  )}
                </Box>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </Box>
  )
}
