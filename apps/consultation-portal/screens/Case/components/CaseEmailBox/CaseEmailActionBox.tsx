import { Box, Button, Input, Stack } from '@island.is/island-ui/core'
import { BaseSyntheticEvent } from 'react'

interface ButtonProps {
  label: string
  onClick?(): void
  isDisabled?: boolean
  isLoading?: boolean
}

interface InputProps {
  name: string
  label: string
  placeholder: string
  value?: string
  onChange?(e: BaseSyntheticEvent): void
  isDisabled?: boolean
}

interface Props {
  button?: ButtonProps
  input?: InputProps
}

const CaseEmailActionBox = ({ button, input }: Props) => {
  return (
    <Box>
      <div>
        <Stack space={2}>
          {input && (
            <Input
              name={input.name}
              size="sm"
              label={input.label}
              placeholder={input.placeholder}
              value={input.value}
              onChange={input.onChange}
              disabled={input.isDisabled}
            />
          )}
          {button && (
            <Button
              fluid
              nowrap
              onClick={button.onClick}
              disabled={button.isDisabled}
              loading={button.isLoading}
            >
              {button.label}
            </Button>
          )}
        </Stack>
      </div>
    </Box>
  )
}

export default CaseEmailActionBox
