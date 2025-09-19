import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Label } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { SocialInsuranceMedicalDocumentsServiceProvider } from '@island.is/api/schema'

export interface ManagedByProps {
  serviceProvider?: SocialInsuranceMedicalDocumentsServiceProvider | null
}

export const ManagedBy = ({ serviceProvider }: ManagedByProps) => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.managedBy,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(socialInsuranceAdministrationMessage.confirm.name)}
          </Label>
          <Text>{serviceProvider?.coordinatorName}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .serviceProvider,
            )}
          </Label>
          <Text>{serviceProvider?.serviceProviderName}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.jobTitle,
            )}
          </Label>
          <Text>{serviceProvider?.coordinatorTitle}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.location,
            )}
          </Label>
          <Text>{serviceProvider?.workplace}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              socialInsuranceAdministrationMessage.info.applicantPhonenumber,
            )}
          </Label>
          <Text>{serviceProvider?.phoneNumber}</Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )
}
