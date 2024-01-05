import { FieldBaseProps } from '@island.is/application/types'
import { AlertBanner, Box, GridContainer } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { VALIDATOR } from '../../lib/constants'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { m } from '../../lib/messages'

export const DelegationCheck: FC<
  React.PropsWithChildren<FieldBaseProps<FinancialStatementsInao>>
> = ({ application, setBeforeSubmitCallback }) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    setError,
  } = useFormContext()
  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const userType = application.externalData.getUserType.data
      const hasUserType = !!userType

      if (!hasUserType) {
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
