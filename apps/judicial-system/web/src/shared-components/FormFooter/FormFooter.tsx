import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useHistory } from 'react-router-dom'

interface Props {
  nextUrl?: string
  nextIsDisabled?: boolean
  previousUrl?: string
  previousIsDisabled?: boolean
}

const FormFooter: React.FC<Props> = (props: Props) => {
  const history = useHistory()

  return (
    <Box display="flex" justifyContent="spaceBetween" marginBottom={30}>
      <Button
        variant="ghost"
        disabled={props.previousIsDisabled}
        onClick={() => {
          history.push(props.previousUrl)
        }}
      >
        Til baka
      </Button>
      <Button
        icon="arrowRight"
        disabled={props.nextIsDisabled}
        onClick={() => {
          history.push(props.nextUrl)
        }}
      >
        Halda áfram
      </Button>
    </Box>
  )
}

export default FormFooter
