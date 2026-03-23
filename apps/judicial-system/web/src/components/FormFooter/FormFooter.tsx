import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
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
  actionButtonIcon?: IconMapIcon
  actionButtonVariant?: ButtonTypes['variant']
  actionButtonColorScheme?: 'default' | 'destructive'
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
  actionButtonIcon,
  actionButtonVariant,
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
    <Box data-testid="formFooter" className={styles.formFooter}>
      {!hidePreviousButton && (
        <Box display="flex" alignItems="center">
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
            fluid={isMobile}
          >
            {!isMobile && (previousButtonText || formatMessage(core.back))}
          </Button>
        </Box>
      )}
      <Box className={styles.buttonContainer}>
        {!hideActionButton && actionButtonText && (
          <Box className={styles.actionButton}>
            <Button
              onClick={onActionButtonClick}
              variant={actionButtonVariant ?? 'ghost'}
              colorScheme={actionButtonColorScheme ?? 'destructive'}
              icon={actionButtonIcon}
              disabled={actionButtonIsDisabled}
              fluid={isTablet}
            >
              {actionButtonText}
            </Button>
          </Box>
        )}
        {(!hideNextButton || infoBoxText) && (
          <Box className={styles.continueButton}>
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
    </Box>
  )
}

export default FormFooter
