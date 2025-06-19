import {
  coreDefaultFieldMessages,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'
import { BankAccountField, FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: BankAccountField
}
export const BankAccountFormField = ({ field, application }: Props) => {
  const { formatMessage, lang: locale } = useLocale()
  const { marginBottom, marginTop, title, titleVariant, id, clearOnChange } =
    field
  const bankNumber = formatText(
    coreDefaultFieldMessages.defaultBankAccountBankNumber,
    application,
    formatMessage,
  )
  const ledger = formatText(
    coreDefaultFieldMessages.defaultBankAccountLedger,
    application,
    formatMessage,
  )
  const accountNumber = formatText(
    coreDefaultFieldMessages.defaultBankAccountAccountNumber,
    application,
    formatMessage,
  )

  const bankInfo = getDefaultValue(field, application)

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Box marginBottom={1}>
          <Text variant={titleVariant ?? 'h3'}>
            {formatTextWithLocale(title, application, locale, formatMessage)}
          </Text>
        </Box>
      )}
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={`${id}.bankNumber`}
              defaultValue={bankInfo?.bankNumber || ''}
              label={bankNumber}
              placeholder="0000"
              format="####"
              backgroundColor="blue"
              autoFocus
              clearOnChange={clearOnChange}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '2/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={`${id}.ledger`}
              defaultValue={bankInfo?.ledger || ''}
              label={ledger}
              placeholder="00"
              format="##"
              backgroundColor="blue"
              clearOnChange={clearOnChange}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box marginBottom={[2, 2, 4]}>
            <InputController
              id={`${id}.accountNumber`}
              defaultValue={bankInfo?.accountNumber || ''}
              label={accountNumber}
              placeholder="000000"
              format="######"
              backgroundColor="blue"
              clearOnChange={clearOnChange}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
