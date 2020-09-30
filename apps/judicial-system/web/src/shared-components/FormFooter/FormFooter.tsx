import React from 'react'
import { Box, Button, Typography } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'

import * as styles from './FormFooter.treat'

interface Props {
  nextUrl?: string
  nextIsDisabled?: boolean
  nextButtonText?: string
  onNextButtonClick?: () => void
  previousUrl?: string
  previousIsDisabled?: boolean
  confirmationText?: string
}

const FormFooter: React.FC<Props> = (props: Props) => {
  const history = useHistory()

  return (
    <Box display="flex" justifyContent="spaceBetween">
      <Button
        variant="ghost"
        disabled={props.previousIsDisabled}
        onClick={() => {
          history.push(props.previousUrl)
        }}
      >
        Til baka
      </Button>
      <div className={styles.nextButtonContainer}>
        <Button
          icon="arrowRight"
          disabled={props.nextIsDisabled}
          onClick={() => {
            props.onNextButtonClick
              ? props.onNextButtonClick()
              : history.push(props.nextUrl)
          }}
        >
          {props.nextButtonText ?? 'Halda áfram'}
        </Button>
        {props.confirmationText && (
          <Box marginTop={1}>
            <Typography variant="pSmall">{props.confirmationText}</Typography>
          </Box>
        )}
      </div>
    </Box>
  )
}

export default FormFooter
