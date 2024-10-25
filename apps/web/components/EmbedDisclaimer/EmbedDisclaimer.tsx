import React, { type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Box,
  Button,
  Checkbox,
  FocusableBox,
  Icon,
  LinkContext,
  Stack,
} from '@island.is/island-ui/core'

import * as styles from './EmbedDisclaimer.css'

export interface EmbedDisclaimerProps {
  texts: {
    cancel: string
    accept: string
    message: ReactNode
    remember: string
  }
  onAnswer: (acceptsTerms: boolean) => void
  localStorageKey: string
}

export const EmbedDisclaimer = ({
  texts,
  onAnswer,
  localStorageKey,
}: EmbedDisclaimerProps) => {
  const methods = useForm()

  const { control } = methods

  return (
    <Box
      className={styles.modal}
      background="blue100"
      borderRadius="large"
      padding="gutter"
    >
      <Stack space={1}>
        <Box display="flex" justifyContent="spaceBetween">
          <Box />
          <FocusableBox
            tabIndex={0}
            aria-label={texts.cancel}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                onAnswer(false)
                ev.preventDefault()
              }
            }}
            onClick={() => {
              onAnswer(false)
            }}
          >
            <Icon icon="close" size="medium" />
          </FocusableBox>
        </Box>
        <Box padding="p1">
          <LinkContext.Provider
            value={{
              linkRenderer: (href, children) => (
                <a
                  className={styles.link}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              ),
            }}
          >
            <Stack space={3}>
              <Stack space={2} align="center">
                <Box>{texts.message}</Box>
                <Controller
                  name={localStorageKey}
                  defaultValue={false}
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      label={texts.remember}
                      labelVariant="small"
                      checked={value}
                      onChange={(e) => {
                        onChange(e.target.checked)
                        localStorage.setItem(
                          localStorageKey,
                          e.target.checked ? 'true' : 'false',
                        )
                      }}
                    />
                  )}
                />
              </Stack>
              <Stack space={2} align="center">
                <Button
                  fluid={true}
                  colorScheme="default"
                  size="small"
                  onClick={() => {
                    onAnswer(true)
                  }}
                >
                  {texts.accept}
                </Button>
                <Button
                  fluid={true}
                  variant="ghost"
                  colorScheme="default"
                  size="small"
                  onClick={() => {
                    onAnswer(false)
                  }}
                >
                  {texts.cancel}
                </Button>
              </Stack>
            </Stack>
          </LinkContext.Provider>
        </Box>
      </Stack>
    </Box>
  )
}
