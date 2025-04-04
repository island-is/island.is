import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath } from '@island.is/application/core'
import {
  INDIVIDUALOPERATIONIDS,
  INPUTCHANGEINTERVAL,
} from '../../utils/constants'
import { m } from '../../lib/messages'

type Props = {
  getSum: () => void
}

export const Expenses = ({ getSum }: Props) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
    clearErrors,
  } = useFormContext()

  const onInputChange = debounce((fieldId: string) => {
    getSum()
    clearErrors(fieldId)
  }, INPUTCHANGEINTERVAL)

  return (
    <>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.electionOffice}
          name={INDIVIDUALOPERATIONIDS.electionOffice}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.electionOffice)
          }
          label={formatMessage(m.electionOffice)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.electionOffice)}
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.advertisements}
          name={INDIVIDUALOPERATIONIDS.advertisements}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.advertisements)
          }
          label={formatMessage(m.advertisements)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.electionOffice)}
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.travelCost}
          name={INDIVIDUALOPERATIONIDS.travelCost}
          error={
            errors && getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.travelCost)
          }
          label={formatMessage(m.travelCost)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.travelCost)}
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.otherCost}
          name={INDIVIDUALOPERATIONIDS.otherCost}
          error={
            errors && getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.otherCost)
          }
          label={formatMessage(m.otherCost)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.otherCost)}
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
    </>
  )
}
