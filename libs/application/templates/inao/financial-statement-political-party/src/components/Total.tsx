import { useEffect } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

type Props = {
  name: string
  total: number
  label: string
  title?: string
}

export const Total = ({ name, total, label, title }: Props) => {
  const { setValue } = useFormContext()

  useEffect(() => {
    setValue(name, total.toString())
  }, [total])

  return (
    <Box paddingY={3}>
      {title ? (
        <Text as="h4" variant="h4" paddingBottom={1}>
          {title}
        </Text>
      ) : null}

      <InputController
        id={name}
        name={name}
        label={label}
        rightAlign
        readOnly
        backgroundColor="blue"
        currency
      />
    </Box>
  )
}
