import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { m } from '../../lib/messages'

interface Props {
  name?: string
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

export const ExternalDataAgreement = ({
  name = 'externalDataAgreement',
  disabled = false,
  onChange,
}: Props) => {
  const { formatMessage } = useLocale()
  const [checked, setChecked] = useState(false)
  const label = formatMessage(m.externalDataAgreement)

  return (
    <Box
      display="flex"
      alignItems="center"
      background="blue100"
      borderWidth="standard"
      borderColor="blue200"
      borderRadius="large"
      paddingX={[2, 3]}
      paddingY={3}
    >
      <Box flexShrink={0} style={{ width: 24 }}>
        <Checkbox
          name={name}
          ariaLabel={label}
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            setChecked(event.target.checked)
            onChange?.(event.target.checked)
          }}
        />
      </Box>
      <Box marginLeft={2}>
        <Text
          fontWeight={checked ? 'semiBold' : 'regular'}
          color={disabled ? 'dark300' : undefined}
        >
          {label}
        </Text>
      </Box>
    </Box>
  )
}
