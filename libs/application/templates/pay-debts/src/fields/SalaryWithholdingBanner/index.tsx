import { FC } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { FormAlertBanner } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { debts as messages } from '../../lib/messages'
import { getDebts, getSelectedSalaryPayerName } from '../../utils/getDebts'

export const SalaryWithholdingBanner: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()
  const selected = useWatch({ name: 'selectedDebts', control }) as
    | (boolean | null | undefined)[]
    | undefined

  const payerName = getSelectedSalaryPayerName(getDebts(application), selected)

  return (
    <FormAlertBanner
      visible={payerName !== undefined}
      variant="warning"
      title={formatMessage(messages.salaryWithholding.title)}
      description={formatMessage(messages.salaryWithholding.message, {
        payerName,
      })}
      closeButtonLabel={formatMessage(
        messages.salaryWithholding.closeButtonLabel,
      )}
    />
  )
}
