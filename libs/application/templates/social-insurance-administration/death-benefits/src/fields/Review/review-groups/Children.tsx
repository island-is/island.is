import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { getApplicationExternalData } from '../../../lib/deathBenefitsUtils'
import { deathBenefitsFormMessage } from '../../../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { ReviewGroupProps } from './props'
import { FieldComponents, FieldTypes } from '@island.is/application/types'

export const Children = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { children } = getApplicationExternalData(application.externalData)
  const rows = children.map((child) => {
    return [child.fullName ?? '', formatKennitala(child.nationalId ?? '')]
  })

  return (
    children.length > 0 && (
      <ReviewGroup isLast>
        <Label marginBottom={1}>
          {formatMessage(deathBenefitsFormMessage.info.childrenTitle)}
        </Label>
        {children?.length > 0 && (
          <Box paddingTop={3}>
            <StaticTableFormField
              application={application}
              field={{
                type: FieldTypes.STATIC_TABLE,
                component: FieldComponents.STATIC_TABLE,
                children: undefined,
                id: 'childrenTable',
                title: '',
                header: [
                  socialInsuranceAdministrationMessage.confirm.name,
                  socialInsuranceAdministrationMessage.confirm.nationalId,
                ],
                rows,
              }}
            />
          </Box>
        )}
      </ReviewGroup>
    )
  )
}
