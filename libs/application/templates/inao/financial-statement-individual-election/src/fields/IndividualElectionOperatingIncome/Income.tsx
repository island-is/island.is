import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  INDIVIDUALOPERATIONIDS,
  INPUTCHANGEINTERVAL,
} from '../../utils/constants'
import { m } from '../../lib/messages'

type Props = {
  getSum: () => void
}

export const Income = ({ getSum }: Props) => {
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
          id={INDIVIDUALOPERATIONIDS.contributionsByLegalEntities}
          name={INDIVIDUALOPERATIONIDS.contributionsByLegalEntities}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.contributionsByLegalEntities,
            )
          }
          label={formatMessage(m.contributionsFromLegalEntities)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.contributionsByLegalEntities)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.individualContributions}
          name={INDIVIDUALOPERATIONIDS.individualContributions}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.individualContributions,
            )
          }
          label={formatMessage(m.contributionsFromIndividuals)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.individualContributions)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.candidatesOwnContributions}
          name={INDIVIDUALOPERATIONIDS.candidatesOwnContributions}
          error={
            errors &&
            getErrorViaPath(
              errors,
              INDIVIDUALOPERATIONIDS.candidatesOwnContributions,
            )
          }
          label={formatMessage(m.candidatesOwnContributions)}
          onChange={() =>
            onInputChange(INDIVIDUALOPERATIONIDS.candidatesOwnContributions)
          }
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
      <Box paddingY={1}>
        <InputController
          id={INDIVIDUALOPERATIONIDS.otherIncome}
          name={INDIVIDUALOPERATIONIDS.otherIncome}
          error={
            errors &&
            getErrorViaPath(errors, INDIVIDUALOPERATIONIDS.otherIncome)
          }
          label={formatMessage(m.otherIncome)}
          onChange={() => onInputChange(INDIVIDUALOPERATIONIDS.otherIncome)}
          backgroundColor="blue"
          rightAlign
          currency
        />
      </Box>
    </>
  )
}
