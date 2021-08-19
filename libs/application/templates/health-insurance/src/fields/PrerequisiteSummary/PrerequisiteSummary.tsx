import React, { FC } from 'react'
import { m } from '../../forms/messages'
import { FieldBaseProps, getSlugFromType } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import SummaryItem from './SummaryItem'
import {
  hasHealthInsurance,
  hasActiveDraftApplication,
  hasPendingApplications,
  hasNoIcelandicAddress,
  getOldestDraftApplicationId,
} from '../../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'
import { Applications } from '../../dataProviders/APIDataTypes'

const PrerequisiteSummary: FC<FieldBaseProps> = ({ application }) => {
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

  const getPendingApplicationNumber = () => {
    const pendingApplications = externalData?.pendingApplications
      ?.data as string[]
    return pendingApplications[0]
  }

  const buildPendingApplicationLink = () => {
    const applications = externalData?.applications.data as Applications[]
    const applicationSlug = getSlugFromType(application.typeId)
    const oldestDraftApplicationId = getOldestDraftApplicationId(applications)
    return `umsoknir/${applicationSlug}/${oldestDraftApplicationId}`
  }

  const requiresActionTagString = formatMessage(m.requiresActionTagLabel)
  const completeTagString = formatMessage(m.completeTagLabel)
  const hasNoIcelandicAddressCheck = hasNoIcelandicAddress(externalData)
  const hasActiveDraftApplicationCheck = hasActiveDraftApplication(externalData)
  const hasHealthInsuranceCheck = hasHealthInsurance(externalData)
  const hasPendingApplicationsCheck = hasPendingApplications(externalData)

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

      case 'applications':
        return {
          prerequisiteMet: !hasActiveDraftApplicationCheck,
          title: formatMessage(m.prerequisiteActiveDraftApplicationTitle),
          description: formatMessage(
            m.prerequisiteActiveDraftApplicationDescription,
          ),
          furtherInformationTitle: formatMessage(m.activeDraftApplicationTitle),
          furtherInformationDescription: formatMessage(
            m.activeDraftApplicationDescription,
          ),
          buttonText: formatMessage(m.activeDraftApplicationButtonText),
          buttonLink: buildPendingApplicationLink(),
          tagText: hasActiveDraftApplicationCheck
            ? requiresActionTagString
            : completeTagString,
        }

      case 'healthInsurance':
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

      case 'pendingApplications':
        return {
          prerequisiteMet: !hasPendingApplicationsCheck,
          title: formatMessage(m.prerequisitePendingApplicationTitle),
          description: formatMessage(
            m.prerequisitePendingApplicationDescription,
          ),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.pendingApplicationDescription,
            {
              applicationNumber: getPendingApplicationNumber(),
            },
          ),
          buttonText: formatMessage(m.pendingApplicationButtonText),
          buttonLink: formatMessage(m.pendingApplicationButtonLink),
          tagText: hasPendingApplicationsCheck
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
            key={i}
            index={i + 1}
            application={application}
            {...prerequisite}
          />
        )
      })}
    </Box>
  )
}

export default PrerequisiteSummary
