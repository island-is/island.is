import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Markdown } from '@island.is/shared/components'
import { paymentArrangement } from '../../lib/messages'

export const AgreementCheckbox: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={[3]}>
      <CheckboxController
        id={id}
        name={id}
        options={[
          {
            value: 'aggreementCheckbox',
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
