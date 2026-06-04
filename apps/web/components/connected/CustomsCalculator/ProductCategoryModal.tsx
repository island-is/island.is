import { Box, Icon, Inline, Stack, Text } from '@island.is/island-ui/core'

import * as styles from './ProductCategoryModal.css'

interface Option {
  label: string
  value: string
  hasChildren: boolean
}

interface ProductCategoryModalProps {
  modalTitle: string
  isVisible: boolean
  onClose: () => void
  options: { label: string; value: string; hasChildren: boolean }[]
  onOptionSelect: (option: Option) => void
  topComponent?: React.ReactNode
}

export const ProductCategoryModal = ({
  modalTitle,
  isVisible,
  onClose,
  options,
  onOptionSelect,
  topComponent,
}: ProductCategoryModalProps) => {
  if (!isVisible) return null

  return (
    <Box className={styles.dropdown} padding={2} paddingX={3}>
      <Stack space={topComponent ? 2 : 3}>
        <Inline alignY="center" space={2} justifyContent="spaceBetween">
          <Text variant="h4">{modalTitle}</Text>
          <Box
            tabIndex={0}
            role="button"
            cursor="pointer"
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault()
                onClose()
              }
            }}
            onClick={onClose}
          >
            <Icon icon="close" color="blue400" size="large" />
          </Box>
        </Inline>

        <Box paddingRight={4}>
          <Stack space={2}>
            {topComponent}
            <Stack space={2}>
              {options.map((option, index) => (
                <Box
                  key={option.value}
                  borderBottomWidth={
                    index < options.length - 1 ? 'standard' : undefined
                  }
                  borderColor="blue200"
                  display="flex"
                  paddingBottom={2}
                  justifyContent="spaceBetween"
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => onOptionSelect(option)}
                >
                  <Text>{option.label}</Text>
                  {option.hasChildren && (
                    <Box paddingRight={1}>
                      <Icon
                        icon="chevronForward"
                        color="blue400"
                        size="medium"
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
