import { FC } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Application, FieldBaseProps } from '@island.is/application/types'
import { FormAlertBanner } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { debts as messages } from '../../lib/messages'
import { getSelectedDebts } from '../../utils/getSelectedDebts'

export const SalaryWithholdingBanner: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()
  const [selectedDebts, selectedDebtIds] = useWatch({
    name: ['selectedDebts', 'selectedDebtIds'],
    control,
  })

  const withheldDebts = getSelectedDebts({
    ...application,
    answers: { selectedDebts, selectedDebtIds },
  } as Application).filter((debt) => debt.salaryPayerName)
  const payerName = withheldDebts[0]?.salaryPayerName

  return (
    <FormAlertBanner
      visible={payerName !== undefined}
      showAgainKey={withheldDebts.map((debt) => debt.payID).join('|')}
      variant="warning"
      title={formatMessage(messages.salaryWithholding.title)}
      description={
        payerName
          ? formatMessage(messages.salaryWithholding.message, { payerName })
          : undefined
      }
      closeButtonLabel={formatMessage(
        messages.salaryWithholding.closeButtonLabel,
      )}
    />
  )
}
