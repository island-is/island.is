// Insurance company with button - only visible to buyer
// Buyer and buyers coowener + button for buyer to add more coowners or operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { error, overview } from '../../../lib/messages'
import { States } from '../../../lib/constants'
import { ReviewGroup } from '../../ReviewGroup'
import { ReviewScreenProps, InsuranceCompany } from '../../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { hasReviewerApproved } from '../../../utils'

interface Props {
  noInsuranceError: boolean
}

export const InsuranceSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps & Props>
> = ({
  setStep,
  insurance = undefined,
  reviewerNationalId = '',
  application,
  noInsuranceError,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const onButtonClick = () => {
    setStep && setStep('insurance')
  }

  const insuranceCompanyList = getValueViaPath(
    application.externalData,
    'insuranceCompanyList.data',
    [],
  ) as InsuranceCompany[]

  const isBuyer =
    (getValueViaPath(answers, 'buyer.nationalId', '') as string) ===
    reviewerNationalId

  const getInsurance = () => {
    const insuranceName = insuranceCompanyList?.find(
      (insuranceItem) => insuranceItem.code === insurance,
    )
    return insuranceName ? insuranceName.name : undefined
  }

  return (
    <ReviewGroup
      editMessage={
        isBuyer &&
        !hasReviewerApproved(answers, reviewerNationalId) &&
        application.state !== States.COMPLETED
          ? formatMessage(overview.labels.addInsuranceButton)
          : undefined
      }
      isLast
      handleClick={onButtonClick}
    >
      <GridRow>
        <GridColumn span={['6/12']}>
          <Text variant="h4" color={noInsuranceError ? 'red600' : 'dark400'}>
            {formatMessage(overview.labels.insuranceTitle)}
          </Text>
          <Text color={noInsuranceError ? 'red600' : 'dark400'}>
            {getInsurance() || formatMessage(overview.labels.noChosenInsurance)}
          </Text>
        </GridColumn>
      </GridRow>
      {noInsuranceError && (
        <Box marginTop={2}>
          <Text variant="eyebrow" color="red600">
            {formatMessage(error.noInsuranceSelected)}
          </Text>
        </Box>
      )}
    </ReviewGroup>
  )
}
