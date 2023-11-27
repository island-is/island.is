import React from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  ButtonTypes,
  IconMapIcon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { core } from '@island.is/judicial-system-web/messages'

import InfoBox from '../InfoBox/InfoBox'
import * as styles from './FormFooter.css'

interface Props {
  previousUrl?: string
  previousIsDisabled?: boolean
  previousButtonText?: string
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  nextButtonIcon?: IconMapIcon
  nextButtonColorScheme?: ButtonTypes['colorScheme']
  onNextButtonClick?: () => void
  hideNextButton?: boolean
  infoBoxText?: string
}

const FormFooter: React.FC<React.PropsWithChildren<Props>> = (props: Props) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection={['row', 'row', 'columnReverse', 'row']}
      alignItems="center"
      data-testid="formFooter"
      className={cn(styles.button)}
    >
      <Box className={styles.button}>
        <Button
          variant="ghost"
          disabled={props.previousIsDisabled}
          onClick={() => {
            router.push(props.previousUrl ?? '')
          }}
          icon={isMobile ? 'arrowBack' : undefined}
          circle={isMobile}
          aria-label={props.previousButtonText || formatMessage(core.back)}
          data-testid="previousButton"
          fluid
        >
          {!isMobile && (props.previousButtonText || formatMessage(core.back))}
        </Button>
      </Box>
      {(!props.hideNextButton || props.infoBoxText) && (
        <Box
          display="flex"
          justifyContent="flexEnd"
          className={cn(styles.button, styles.continueButton)}
        >
          {!props.hideNextButton && (
            <Button
              data-testid="continueButton"
              icon={props.nextButtonIcon}
              disabled={props.nextIsDisabled}
              colorScheme={props.nextButtonColorScheme ?? 'default'}
              loading={props.nextIsLoading}
              onClick={() => {
                if (props.onNextButtonClick) {
                  props.onNextButtonClick()
                } else if (props.nextUrl) {
                  router.push(props.nextUrl)
                }
              }}
              fluid
            >
              {props.nextButtonText ?? formatMessage(core.continue)}
            </Button>
          )}
          {props.infoBoxText && (
            <div className={styles.infoBoxContainer}>
              <InfoBox text={props.infoBoxText} />
            </div>
          )}
        </Box>
      )}
    </Box>
  )
}

export default FormFooter
