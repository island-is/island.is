import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import InfoBox from '../InfoBox/InfoBox'
interface Props {
  previousUrl?: string
  previousIsDisabled?: boolean
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
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
          router.push(props.previousUrl || '')
        }}
      >
        Til baka
      </Button>
      {!props.hideNextButton && (
        <Button
          data-testid="continueButton"
          icon="arrowForward"
          disabled={props.nextIsDisabled}
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
