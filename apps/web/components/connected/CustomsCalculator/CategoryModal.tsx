import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useClickAway } from 'react-use'

import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'

import { translation as translationStrings } from './translation.strings'
import * as styles from './CategoryModal.css'

interface Option {
  label: string
  value: string
  hasChildren: boolean
}

interface CategoryModalProps {
  title: string
  options: { label: string; value: string; hasChildren: boolean }[]
  onOptionSelect: (option: Option) => void
  topComponent?: React.ReactNode
}

export const CategoryModal = ({
  title,
  options,
  onOptionSelect,
  topComponent,
}: CategoryModalProps) => {
  const { formatMessage } = useIntl()
  const [isVisible, setIsVisible] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  useClickAway(containerRef, (ev) => {
    if (ev.type !== 'touchstart') setIsVisible(false)
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Whether there are options below the visible part of the list, used to
  // show a fade at the bottom so it's clear the list can be scrolled
  const [canScrollDown, setCanScrollDown] = useState(false)
  const updateCanScrollDown = useCallback(() => {
    const element = dropdownRef.current
    setCanScrollDown(
      !!element &&
        element.scrollTop + element.clientHeight < element.scrollHeight - 1,
    )
  }, [])
  useEffect(updateCanScrollDown, [isVisible, options, updateCanScrollDown])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Button
        icon="filter"
        size="small"
        variant="utility"
        colorScheme="white"
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
        >
          <Box marginBottom={topComponent ? 2 : 3}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              columnGap={2}
            >
              <Box minWidth={0}>
                <Text variant="h4">{title}</Text>
              </Box>
              <Box
                flexShrink={0}
                tabIndex={0}
                role="button"
                aria-label={formatMessage(translationStrings.closeModal)}
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
            </Box>
          </Box>

          <Box
            className={styles.scrollableContent}
            paddingRight={4}
            ref={dropdownRef}
            onScroll={updateCanScrollDown}
          >
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
                      if (dropdownRef.current) dropdownRef.current.scrollTop = 0
                    }}
                  >
                    <Text>{option.label}</Text>
                    {option.hasChildren && (
                      <div>
                        <Icon
                          icon="chevronForward"
                          color="blue400"
                          size="medium"
                        />
                      </div>
                    )}
                  </Box>
                ))}
              </Box>
            </Stack>
          </Box>
          {canScrollDown && <div className={styles.scrollFade} />}
        </Box>
      )}
    </div>
  )
}
