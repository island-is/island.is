import React from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'

import {
  Box,
  Button,
  ButtonTypes,
  IconMapIcon,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import InfoBox from '../InfoBox/InfoBox'
import * as styles from './FormFooter.css'

interface Props {
  previousUrl?: string
  previousIsDisabled?: boolean
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

const FormFooter: React.FC<Props> = (props: Props) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  return (
    <Box display="flex" justifyContent="spaceBetween" alignItems="center">
      <Box className={styles.footerItem}>
        <Button
          variant="ghost"
          disabled={props.previousIsDisabled}
          onClick={() => {
            router.push(props.previousUrl ?? '')
          }}
          icon={isMobile ? 'arrowBack' : undefined}
          circle={isMobile}
          aria-label="Til baka"
        >
          {!isMobile && 'Til baka'}
        </Button>
      </Box>
      <Box
        className={styles.footerItem}
        display="flex"
        justifyContent="flexEnd"
      >
        {!props.hideNextButton && (
          <Button
            data-testid="continueButton"
            icon={props.nextButtonIcon ?? 'arrowForward'}
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
          >
            {props.nextButtonText ?? 'Halda áfram'}
          </Button>
        )}
        {props.infoBoxText && <InfoBox text={props.infoBoxText} />}
      </Box>
    </Box>
  )
}

export default FormFooter
