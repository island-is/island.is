import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

interface Props {
  nationalId?: string
  name?: string
  disabled: boolean
}

export const NationalIdField = ({ nationalId, name, disabled }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
        <Input
          label={formatMessage(m.nationalId)}
          name="nationalId"
          placeholder={formatMessage(m.nationalId)}
          value={nationalId}
          disabled={disabled}
          backgroundColor={disabled ? 'white' : 'blue'}
        />
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
        <Box marginTop={[2, 2, 0, 0]}>
          <Input
            label={formatMessage(m.fullName)}
            name="name"
            value={name}
            placeholder={formatMessage(m.fullName)}
            disabled={true}
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
