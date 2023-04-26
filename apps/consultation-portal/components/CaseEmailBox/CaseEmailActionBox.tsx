import { Box, Button, Checkbox, Input, Stack } from '@island.is/island-ui/core'
import { SyntheticEvent } from 'react'

interface Button {
  label: string
  onClick?: () => void
  isDisabled?: boolean
  isLoading?: boolean
}

interface Selection {
  label: string
  checked?: boolean
  onChange?: (label: string) => void
  isDisabled?: boolean
}

interface Props {
  button?: Array<Button>
  selection?: Array<Selection>
  input?: {
    name: string
    label: string
    placeholder: string
    value?: string
    onChange?: (e: SyntheticEvent) => void
    isDisabled?: boolean
  }
}

const CaseEmailActionBox = ({ button, input, selection }: Props) => {
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
          {selection &&
            selection.map((sel, idx) => {
              return (
                <Checkbox
                  key={idx}
                  name={sel.label}
                  label={sel.label}
                  checked={sel.checked}
                  onChange={() => sel.onChange(sel.label)}
                  disabled={sel.isDisabled}
                />
              )
            })}
          {button &&
            button.map((btn, index) => {
              return (
                <Box paddingTop={index === 0 ? 1 : 0} key={index}>
                  <Button
                    fluid
                    nowrap
                    colorScheme={index > 0 ? 'destructive' : 'default'}
                    variant={
                      btn.label === 'Breyta áskrift' ? 'ghost' : 'primary'
                    }
                    size="small"
                    onClick={btn.onClick}
                    disabled={btn.isDisabled}
                    loading={btn.isLoading}
                  >
                    {btn.label}
                  </Button>
                </Box>
              )
            })}
        </Stack>
      </div>
    </Box>
  )
}

export default CaseEmailActionBox
