import React, { FC } from 'react'

import { m } from '../../forms/messages'
import { FieldBaseProps } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import SummaryItem from './SummaryItem'
import {
  hasHealthInsurance,
  hasActiveDraftApplication,
  hasPendingApplications,
  hasNoIcelandicAddress,
} from '../../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'

const PREREQUISITESTOCHECK = [
  'applications',
  'healthInsurance',
  'pendingApplications',
  'nationalRegistry',
]

const PrerequisiteSummary: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const externalData = application.externalData

  // Build prerequisite object for summary item
  const buildPrerequisite = () => {
    const prerequisiteObject = []
    for (const item in externalData) {
      if (PREREQUISITESTOCHECK.includes(item)) {
        const {
          prerequisiteMet,
          prerequisiteTitle,
          prerequisiteDescription,
          furtherInformationTitle,
          furtherInformationDescription,
          buttonText,
        } = checkPrerequisite(item)
        prerequisiteObject.push({
          name: item,
          status: prerequisiteMet,
          title: prerequisiteTitle,
          description: prerequisiteDescription,
          furtherInformationTitle: furtherInformationTitle,
          furtherInformationDescription: furtherInformationDescription,
          buttonText: buttonText,
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

  // Following checks are made:
  // User should have legal residence in Iceland
  // User should not have an active draft application
  // User should not already have health insurance
  // User should not have an application already at sjukratryggingar
  const checkPrerequisite = (prerequisiteName: string) => {
    switch (prerequisiteName) {
      case 'nationalRegistry':
        return {
          prerequisiteMet: hasNoIcelandicAddress(externalData),
          prerequisiteTitle: formatMessage(
            m.prerequisiteNationaalRegistryTitle,
          ),
          prerequisiteDescription: formatMessage(
            m.prerequisiteNationaalRegistryDescription,
          ),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.registerYourselfDescription,
          ),
          buttonText: formatMessage(m.registerYourselfButtonText),
        }
      case 'applications':
        return {
          prerequisiteMet: !hasActiveDraftApplication(externalData),
          prerequisiteTitle: formatMessage(
            m.prerequisiteActiveDraftApplicationTitle,
          ),
          prerequisiteDescription: formatMessage(
            m.prerequisiteActiveDraftApplicationDescription,
          ),
          furtherInformationTitle: formatMessage(m.activeDraftApplicationTitle),
          furtherInformationDescription: formatMessage(
            m.activeDraftApplicationDescription,
          ),
          buttonText: formatMessage(m.activeDraftApplicationButtonText),
        }
      case 'healthInsurance':
        return {
          prerequisiteMet: !hasHealthInsurance(externalData),
          prerequisiteTitle: formatMessage(m.prerequisiteHealthInsuranceTitle),
          prerequisiteDescription: formatMessage(
            m.prerequisiteHealthInsuranceDescription,
          ),
          furtherInformationTitle: formatMessage(m.alreadyInsuredTitle),
          furtherInformationDescription: formatMessage(
            m.alreadyInsuredDescription,
          ),
          buttonText: formatMessage(m.alreadyInsuredButtonText),
        }
      case 'pendingApplications':
        return {
          prerequisiteMet: !hasPendingApplications(externalData),
          prerequisiteTitle: formatMessage(
            m.prerequisitePendingApplicationTitle,
          ),
          prerequisiteDescription: formatMessage(
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
        }
      // Should never go to the default as we dont check prerequisites that arent defined in the PREREQUISITESTOCHECK
      // constant but incase it does happen we send the requirement met flag as true in order not to block anything
      default:
        return {
          prerequisiteMet: true,
          prerequisiteTitle: formatMessage(m.unexpectedError),
          prerequisiteDescription: formatMessage(m.unexpectedError),
          furtherInformationTitle: formatMessage(m.unexpectedError),
          furtherInformationDescription: formatMessage(m.unexpectedError),
          // TODO FIX, maybe just return empty string and not render it in the summaryItem?
          buttonText: formatMessage(m.pendingApplicationButtonText),
        }
    }
  }

  const prerequisites = buildPrerequisite()

  return (
    <Box marginBottom={10}>
      <Box marginTop={7} marginBottom={8}>
        {prerequisites.map((prerequisite, i) => {
          return (
            <SummaryItem
              key={i}
              application={application}
              title={prerequisite.title}
              description={prerequisite.description}
              furtherInformationTitle={prerequisite.furtherInformationTitle}
              furtherInformationDescription={
                prerequisite.furtherInformationDescription
              }
              prerequisiteMet={prerequisite.status}
              buttonText={prerequisite.buttonText}
              index={i + 1}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default PrerequisiteSummary
