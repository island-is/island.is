import { Box, Button, Input, Stack } from '@island.is/island-ui/core'
import { RefObject } from 'react'

interface Button {
  label: string
  onClick?: () => void
  disabled?: boolean
}

interface Props {
  button: Array<Button>
  ref: RefObject<HTMLInputElement>
}

const CaseEmailActionBox = ({ button, ref }: Props) => {
  console.log('caseEmailActionBox')
  return (
    <Box>
      <Stack space={2}>
        <Input
          name="userEmailInput"
          size="sm"
          label="Netfang"
          placeholder="nonni@island.is"
          ref={ref}
        />
        {button &&
          button.map((btn, index) => {
            return (
              <Button
                fluid
                nowrap
                variant={index > 0 ? 'ghost' : 'primary'}
                size="small"
                onClick={btn.onClick}
                disabled={btn.disabled}
              >
                {btn.label}
              </Button>
            )
          })}
      </Stack>
    </Box>
  )
}

export default CaseEmailActionBox
