import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Markdown } from '@island.is/shared/components'
import { paymentArrangement } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { IndividualOrCompany } from '../../utils/enums'
import { isCompanyType } from '../../utils'

export const AgreementCheckbox: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  error,
  application,
}) => {
  const { id } = field
  const { externalData } = application
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  useEffect(() => {
    // To trigger the validation
    if (isCompanyType(externalData)) {
      setValue(
        'paymentArrangement.individualOrCompany',
        IndividualOrCompany.company,
      )
    }
  }, [setValue, externalData])
  return (
    <Box marginTop={[3]}>
      <CheckboxController
        id={id}
        name={id}
        error={error}
        options={[
          {
            value: 'yes',
            label: (
              <Markdown>
                {formatMessage(paymentArrangement.labels.aggreementCheckbox)}
              </Markdown>
            ),
          },
        ]}
      />
    </Box>
  )
}
