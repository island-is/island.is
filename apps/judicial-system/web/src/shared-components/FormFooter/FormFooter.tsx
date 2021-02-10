import React from 'react'
import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'
import * as styles from './FormFooter.treat'
interface Props {
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  onNextButtonClick?: () => void
  previousIsDisabled?: boolean
  hideNextButton?: boolean
  infoBoxText?: string
}

const FormFooter: React.FC<Props> = (props: Props) => {
  const history = useHistory()

  return (
    <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart">
      <Button
        variant="ghost"
        disabled={props.previousIsDisabled}
        onClick={() => {
          history.goBack()
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
              history.push(props.nextUrl)
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
