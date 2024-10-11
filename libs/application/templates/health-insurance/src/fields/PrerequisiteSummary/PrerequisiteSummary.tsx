import { m } from '../../lib/messages/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { SummaryItem } from './SummaryItem'
import {
  hasHealthInsurance,
  hasNoIcelandicAddress,
} from '../../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'

export const PrerequisiteSummary = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const externalData = application.externalData

  const buildPrerequisite = () => {
    const prerequisiteObject = []
    for (const item in externalData) {
      const prerequisiteItem = checkPrerequisite(item)
      if (prerequisiteItem) {
        prerequisiteObject.push({
          name: item,
          ...prerequisiteItem,
        })
      }
    }
    return prerequisiteObject
  }

  const requiresActionTagString = formatMessage(m.requiresActionTagLabel)
  const completeTagString = formatMessage(m.completeTagLabel)
  const hasNoIcelandicAddressCheck = hasNoIcelandicAddress(externalData)
  const hasHealthInsuranceCheck = hasHealthInsurance(externalData)

  const checkPrerequisite = (prerequisiteName: string) => {
    switch (prerequisiteName) {
      case 'nationalRegistry':
        return {
          prerequisiteMet: !hasNoIcelandicAddressCheck,
          title: formatMessage(m.prerequisiteNationalRegistryTitle),
          description: formatMessage(m.prerequisiteNationalRegistryDescription),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.registerYourselfDescription,
          ),
          buttonText: formatMessage(m.registerYourselfButtonText),
          buttonLink: formatMessage(m.registerYourselfButtonLink),
          tagText: hasNoIcelandicAddressCheck
            ? requiresActionTagString
            : completeTagString,
        }
      case 'isHealthInsured':
        return {
          prerequisiteMet: !hasHealthInsuranceCheck,
          title: formatMessage(m.prerequisiteHealthInsuranceTitle),
          description: formatMessage(m.prerequisiteHealthInsuranceDescription),
          furtherInformationTitle: formatMessage(m.alreadyInsuredTitle),
          furtherInformationDescription: formatMessage(
            m.alreadyInsuredDescription,
          ),
          buttonText: formatMessage(m.alreadyInsuredButtonText),
          buttonLink: formatMessage(m.alreadyInsuredButtonLink),
          tagText: hasHealthInsuranceCheck
            ? requiresActionTagString
            : completeTagString,
        }

      default:
        break
    }
  }

  const prerequisites = buildPrerequisite()
  return (
    <Box>
      {prerequisites.map((prerequisite, i) => {
        return (
          <SummaryItem
            key={`${prerequisite.name}-${i}`}
            index={i + 1}
            application={application}
            {...prerequisite}
          />
        )
      })}
    </Box>
  )
}
