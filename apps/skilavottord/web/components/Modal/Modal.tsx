import React, { FC, useEffect } from 'react'
import { ApolloError } from '@apollo/client'
import {
  Button,
  Box,
  Text,
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  LoadingDots,
} from '@island.is/island-ui/core'
import * as styles from './Modal.css'
import { OutlinedError } from '@island.is/skilavottord-web/components'
import { CompletedError } from '@island.is/skilavottord-web/i18n/locales/translation'

export interface ModalProps {
  show: boolean
  onCancel: () => void
  onContinue: () => void
  title: string
  text?: string
  continueButtonText: string
  cancelButtonText: string
  loading?: boolean
  error?: ApolloError | string
  errorText?: CompletedError
  children?: React.ReactNode
}

export const Modal: FC<React.PropsWithChildren<ModalProps>> = ({
  show,
  onCancel,
  onContinue,
  title,
  text,
  continueButtonText,
  cancelButtonText,
  loading = false,
  error,
  errorText,
  children,
}: ModalProps) => {
  useEffect(() => {
    document.body.style.overflowY = 'auto'
    if (show) {
      document.body.style.overflowY = 'hidden'
    }
  }, [show])

  return (
    <>
      {show && (
        <Box className={styles.container}>
          <Box className={styles.overlay} />
          <GridContainer>
            <GridRow>
              <GridColumn
                span={['12/12', '8/12', '8/12', '8/12']}
                offset={['0', '2/12', '2/12', '2/12']}
              >
                <Box
                  paddingY={[12, 10, 10, 10]}
                  paddingX={[3, 0, 0, 0]}
                  className={styles.modalContainer}
                  background="white"
                  borderRadius="large"
                >
                  <Box className={styles.modalClose}>
                    <Button
                      colorScheme="negative"
                      circle
                      icon="close"
                      size="large"
                      onClick={onCancel}
                    />
                  </Box>
                  <GridColumn
                    span={['8/8', '6/8', '6/8', '6/8']}
                    offset={['0', '1/8', '1/8', '1/8']}
                  >
                    {error && errorText ? (
                      <Stack space={2}>
                        <Text variant="h1">{title}</Text>
                        <OutlinedError
                          title={errorText?.title}
                          message={errorText?.message}
                          primaryButton={{
                            text: `${errorText?.primaryButton}`,
                            action: onContinue,
                          }}
                          secondaryButton={{
                            text: `${errorText?.secondaryButton}`,
                            action: onCancel,
                          }}
                        />
                      </Stack>
                    ) : (
                      <Stack space={[6, 4, 4, 5]}>
                        <Stack space={2}>
                          <Text variant="h1">{title}</Text>
                          {loading ? (
                            <Box textAlign="center">
                              <LoadingDots size="large" />
                            </Box>
                          ) : (
                            <Text variant="intro">{text}</Text>
                          )}
                        </Stack>
                        {children ? (
                          children
                        ) : (
                          <Box display="flex" justifyContent="spaceBetween">
                            <Button variant="ghost" onClick={onCancel} fluid>
                              {cancelButtonText}
                            </Button>
                            <Box paddingX={[3, 3, 3, 15]}></Box>
                            <Button onClick={onContinue} fluid>
                              {continueButtonText}
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    )}
                  </GridColumn>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
    </>
  )
}
