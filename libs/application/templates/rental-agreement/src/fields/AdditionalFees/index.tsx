import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Input, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { otherFees } from '../../lib/messages'

export const AdditionalFees: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { formatMessage } = useLocale()
  const { application } = props
  return (
    <Box marginTop={3}>
      <Stack space={2}>
        <Input
          name="otherFees.otherCostsDescription"
          label={formatMessage(otherFees.otherCostsDescriptionLabel)}
          placeholder={formatMessage(
            otherFees.otherCostsDescriptionPlaceholder,
          )}
          backgroundColor={'blue'}
          required
        />
        <Input
          name="otherFees.otherCostsAmount"
          label={formatMessage(otherFees.otherCostsAmountLabel)}
          placeholder={formatMessage(otherFees.otherCostsAmountPlaceholder)}
          type="number"
          backgroundColor={'blue'}
          required
        />

        <Button icon="add" variant="ghost" type="button" size="small">
          Bæta við kostnaðarlið
        </Button>
      </Stack>
    </Box>
  )
}
