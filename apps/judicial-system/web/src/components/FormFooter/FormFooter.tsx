import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import router from 'next/router'

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
  hidePreviousButton?: boolean
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  nextButtonIcon?: IconMapIcon
  nextButtonColorScheme?: ButtonTypes['colorScheme']
  onNextButtonClick?: () => void
  hideNextButton?: boolean
  actionButtonText?: string
  actionButtonColorScheme?: 'destructive'
  actionButtonIsDisabled?: boolean
  onActionButtonClick?: () => void
  hideActionButton?: boolean
  infoBoxText?: string
}

const FormFooter: FC<Props> = ({
  previousUrl,
  previousIsDisabled,
  previousButtonText,
  hidePreviousButton,
  nextUrl,
  nextIsDisabled,
  nextIsLoading,
  nextButtonText,
  nextButtonIcon,
  nextButtonColorScheme,
  onNextButtonClick,
  hideNextButton,
  actionButtonText,
  actionButtonColorScheme,
  actionButtonIsDisabled,
  onActionButtonClick,
  hideActionButton,
  infoBoxText,
}) => {
  const { formatMessage } = useIntl()
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md
  const isTablet = width <= theme.breakpoints.lg && width > theme.breakpoints.md

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection={['row', 'row', 'columnReverse', 'row']}
      alignItems="center"
      data-testid="formFooter"
      className={cn(styles.button)}
    >
      {!hidePreviousButton && (
        <Box className={styles.button}>
          <Button
            variant="ghost"
            disabled={previousIsDisabled}
            onClick={() => {
              router.push(previousUrl ?? '')
            }}
            icon={isMobile ? 'arrowBack' : undefined}
            circle={isMobile}
            aria-label={previousButtonText || formatMessage(core.back)}
            data-testid="previousButton"
            fluid
          >
            {!isMobile && (previousButtonText || formatMessage(core.back))}
          </Button>
        </Box>
      )}
      {!hideActionButton && actionButtonText && (
        <Box className={cn(styles.button, styles.actionButton)}>
          <Button
            onClick={onActionButtonClick}
            variant="ghost"
            colorScheme={actionButtonColorScheme ?? 'destructive'}
            disabled={actionButtonIsDisabled}
            fluid={isTablet}
          >
            {actionButtonText}
          </Button>
        </Box>
      )}
      {(!hideNextButton || infoBoxText) && (
        <Box
          display="flex"
          justifyContent="flexEnd"
          className={cn(styles.button, styles.continueButton)}
        >
          {!hideNextButton && (
            <Button
              data-testid="continueButton"
              icon={nextButtonIcon}
              disabled={nextIsDisabled}
              colorScheme={nextButtonColorScheme ?? 'default'}
              loading={nextIsLoading}
              onClick={() => {
                if (onNextButtonClick) {
                  onNextButtonClick()
                } else if (nextUrl) {
                  router.push(nextUrl)
                }
              }}
              fluid
            >
              {nextButtonText ?? formatMessage(core.continue)}
            </Button>
          )}
          {infoBoxText && (
            <div className={styles.infoBoxContainer}>
              <InfoBox text={infoBoxText} />
            </div>
          )}
        </Box>
      )}
    </Box>
  )
}

export default FormFooter
