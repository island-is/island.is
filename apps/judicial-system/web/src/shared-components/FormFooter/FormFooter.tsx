import React from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  ButtonTypes,
  IconMapIcon,
} from '@island.is/island-ui/core'

import InfoBox from '../InfoBox/InfoBox'
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

  return (
    <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
      <Button
        variant="ghost"
        disabled={props.previousIsDisabled}
        onClick={() => {
          router.push(props.previousUrl ?? '')
        }}
      >
        Til baka
      </Button>
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
  )
}

export default FormFooter
