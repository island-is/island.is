import { useRef, useState } from 'react'
import { useClickAway } from 'react-use'

import {
  Box,
  Button,
  Icon,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './ProductCategoryModal.css'

interface Option {
  label: string
  value: string
  hasChildren: boolean
}

interface ProductCategoryModalProps {
  title: string
  options: { label: string; value: string; hasChildren: boolean }[]
  onOptionSelect: (option: Option) => void
  topComponent?: React.ReactNode
}

export const ProductCategoryModal = ({
  title,
  options,
  onOptionSelect,
  topComponent,
}: ProductCategoryModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  useClickAway(containerRef, () => setIsVisible(false))

  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Button
        icon="filter"
        size="small"
        variant="utility"
        onClick={() => setIsVisible((v) => !v)}
        disabled={isVisible}
      >
        {title}
      </Button>

      {isVisible && (
        <Box
          className={styles.dropdown}
          padding={2}
          paddingLeft={3}
          paddingRight={1}
          ref={dropdownRef}
        >
          <Stack space={topComponent ? 2 : 3}>
            <Inline alignY="center" space={2} justifyContent="spaceBetween">
              <Text variant="h4">{title}</Text>
              <Box
                tabIndex={0}
                role="button"
                cursor="pointer"
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    setIsVisible(false)
                  }
                }}
                onClick={() => setIsVisible(false)}
              >
                <Icon icon="close" color="blue400" size="large" />
              </Box>
            </Inline>

            <Box paddingRight={4}>
              <Stack space={2}>
                {topComponent}
                <Box>
                  {options.map((option, index) => (
                    <Box
                      key={option.value}
                      borderBottomWidth={
                        index < options.length - 1 ? 'standard' : undefined
                      }
                      borderColor="blue200"
                      display="flex"
                      className={styles.option}
                      paddingX={1}
                      justifyContent="spaceBetween"
                      alignItems="center"
                      cursor="pointer"
                      tabIndex={0}
                      role="button"
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault()
                          onOptionSelect(option)
                          if (!option.hasChildren) setIsVisible(false)
                          if (dropdownRef.current)
                            dropdownRef.current.scrollTop = 0
                        }
                      }}
                      onClick={() => {
                        onOptionSelect(option)
                        if (!option.hasChildren) setIsVisible(false)
                        if (dropdownRef.current)
                          dropdownRef.current.scrollTop = 0
                      }}
                    >
                      <Text>{option.label}</Text>
                      {option.hasChildren && (
                        <Icon
                          icon="chevronForward"
                          color="blue400"
                          size="medium"
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </div>
  )
}
