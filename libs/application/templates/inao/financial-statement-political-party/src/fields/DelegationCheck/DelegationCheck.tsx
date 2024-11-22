import { FieldBaseProps } from '@island.is/application/types'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { VALIDATOR } from '@island.is/application/templates/inao/shared'
import { m } from '../../lib/messages'
import { FinancialStatementPoliticalParty } from '../../lib/dataSchema'

export const DelegationCheck = ({
  application,
  setBeforeSubmitCallback,
}: FieldBaseProps<FinancialStatementPoliticalParty>) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    setError,
  } = useFormContext()
  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const userType = application.externalData.getUserType?.data
      const hasUserType = !!userType

      if (hasUserType) {
        setError(VALIDATOR, {
          type: 'custom',
          message: formatMessage(m.wrongDelegation),
        })
        return [false, formatMessage(m.wrongDelegation)]
      } else {
        return [true, null]
      }
    })

  return errors && errors.validator ? (
    <Box paddingBottom={2} paddingTop={4}>
      <AlertBanner
        title={formatMessage(m.genericError)}
        description={formatMessage(m.wrongDelegation)}
        variant="error"
      />
    </Box>
  ) : null
}
