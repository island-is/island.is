import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box, ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { getApplicationExternalData } from '../../../lib/survivorsBenefitsUtils'
import { survivorsBenefitsFormMessage } from '../../../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { ReviewGroupProps } from './props'

export const Children = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { children } = getApplicationExternalData(application.externalData)

  return (
    children.length > 0 && (
      <ReviewGroup isLast>
        <Label marginBottom={1}>
          {formatMessage(survivorsBenefitsFormMessage.info.childrenTitle)}
        </Label>
        {children.map((child, index) => {
          return (
            <Box
              key={index}
              marginBottom={index === children.length - 1 ? 0 : 2}
            >
              <ActionCard
                headingVariant="h4"
                heading={child.fullName}
                text={`
              ${formatMessage(
                socialInsuranceAdministrationMessage.confirm.nationalId,
              )}: ${formatKennitala(child.nationalId)}`}
              />
            </Box>
          )
        })}
      </ReviewGroup>
    )
  )
}
