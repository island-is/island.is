import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { ReviewScreenProps } from '../../types'
import { getReviewSteps } from '../../utils'
import { StatusStep } from './StatusStep'
import { useAuth } from '@island.is/auth/react'

export const ApplicationStatus: FC<FieldBaseProps & ReviewScreenProps> = ({
  goToScreen,
  application,
  field,
  setStep,
}) => {
  const { formatMessage } = useLocale()

  const { userInfo } = useAuth()
  console.log(userInfo)

  /* const reviewerNationalIdList = [] as string[]
    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
      '',
    ) as string
    reviewerNationalIdList.push(buyerNationalId)
    const sellerCoOwner = getValueViaPath(
      application.answers,
      'sellerCoOwner',
      [],
    ) as UserInformation[]
    const buyerCoOwnerAndOperator = getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
    sellerCoOwner?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    })
    buyerCoOwnerAndOperator?.map(({ nationalId }) => {
      reviewerNationalIdList.push(nationalId)
      return nationalId
    }) */

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const steps = getReviewSteps(application)

  return (
    <Box marginBottom={10}>
      <Text variant="h1" marginBottom={2}>
        Staða tilkynningar
      </Text>
      <Box marginTop={4} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => setStep('overview')}
        >
          Skoða yfirlit
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            title={step.title}
            description={step.description}
            tagText={step.tagText}
            tagVariant={step.tagVariant}
            visible={step.visible}
            reviewer={step.reviewer}
          />
        ))}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flexEnd" paddingY={5}>
        <Button onClick={() => setStep('overview')}>Opna samþykki</Button>
      </Box>
    </Box>
  )
}
