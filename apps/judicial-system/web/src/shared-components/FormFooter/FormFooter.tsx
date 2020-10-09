import React from 'react'
import { Box, ButtonDeprecated as Button } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'

import * as styles from './FormFooter.treat'

interface Props {
  nextUrl?: string
  nextIsDisabled?: boolean
  nextIsLoading?: boolean
  nextButtonText?: string
  onNextButtonClick?: () => void
  previousIsDisabled?: boolean
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
      <div className={styles.nextButtonContainer}>
        <Button
          icon="arrowRight"
          disabled={props.nextIsDisabled}
          loading={props.nextIsLoading}
          onClick={() => {
            props.onNextButtonClick
              ? props.onNextButtonClick()
              : history.push(props.nextUrl)
          }}
        >
          {props.nextButtonText ?? 'Halda áfram'}
        </Button>
      </div>
    </Box>
  )
}

export default FormFooter
