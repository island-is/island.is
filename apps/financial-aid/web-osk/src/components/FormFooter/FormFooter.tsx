import React from 'react'
import { Box, Button, Icon, Text } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import * as styles from './FormFooter.treat'
interface Props {
  hidePreviousButton?: boolean
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
      {!props.hidePreviousButton && (
        <Button
          variant="ghost"
          disabled={props.previousIsDisabled}
          onClick={() => {
            router.push(props.previousUrl || '')
          }}
        >
          Til baka
        </Button>
      )}
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
      {props.infoBoxText && (
        <div className={styles.infoBoxContainer}>
          <Box display="flex" alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              marginRight={2}
              flexShrink={0}
            >
              <Icon type="filled" color="blue400" icon="informationCircle" />
            </Box>
            <Text variant="small">{props.infoBoxText}</Text>
          </Box>
        </div>
      )}
    </Box>
  )
}

export default FormFooter
