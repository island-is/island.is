import React, { FC } from 'react'

import { m } from '../../forms/messages'
import {
  ExternalData,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import SummaryItem from './SummaryItem'
import {
  hasHealthInsurance,
  hasActiveDraftApplication,
  hasPendingApplications,
  hasIcelandicAddress,
} from '../../healthInsuranceUtils'
import { useLocale } from '@island.is/localization'
import HtmlParser from 'react-html-parser'

// TODO: we need a better way of getting the translated string in here, outside
// of react. Possibly we should just make a more flexible results screen.
// This string ends up being used as the paramejter displayed as the error message
// for the failed dataprovider

// interface PrerequisiteItem {
//   title: string
//   description: string
//   statusOfPrerequisite: string
// }

// userProfile
// applications
// healthInsurance
// nationalRegistry
// pendingApplications

const PREREQUISITESTOCHECK = [
  'applications',
  'healthInsurance',
  'nationalRegistry',
  'pendingApplications',
]

const PrerequisiteSummary: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  // Build prerequisite object for summary item
  const buildPrerequisite = (externalData: ExternalData) => {
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
        } = checkPrerequisite(item, externalData)
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

  const checkPrerequisite = (
    prerequisiteName: string,
    externalData: ExternalData,
  ) => {
    switch (prerequisiteName) {
      // Should have a user application
      case 'userProfile':
        return {
          prerequisiteMet: hasIcelandicAddress(externalData),
          prerequisiteTitle: formatMessage(m.registerYourselfTitle),
          prerequisiteDescription: formatMessage(m.registerYourselfDescription),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.registerYourselfDescription,
          ),
          buttonText: formatMessage(m.registerYourselfButtonText),
        }
      // Should not have a active draft application
      case 'applications':
        return {
          prerequisiteMet: !hasActiveDraftApplication(externalData),
          prerequisiteTitle: formatMessage(m.activeDraftApplicationTitle),
          prerequisiteDescription: formatMessage(
            m.activeDraftApplicationDescription,
          ),
          furtherInformationTitle: formatMessage(m.activeDraftApplicationTitle),
          furtherInformationDescription: formatMessage(
            m.activeDraftApplicationDescription,
          ),
          buttonText: formatMessage(m.activeDraftApplicationButtonText),
        }
      // Should not have a health insurance
      case 'healthInsurance':
        return {
          prerequisiteMet: !hasHealthInsurance(externalData),
          prerequisiteTitle: formatMessage(m.alreadyInsuredTitle),
          prerequisiteDescription: formatMessage(m.alreadyInsuredDescription),
          furtherInformationTitle: formatMessage(m.alreadyInsuredTitle),
          furtherInformationDescription: formatMessage(
            m.alreadyInsuredDescription,
          ),
          buttonText: formatMessage(m.alreadyInsuredButtonText),
        }
      // Should not have a pending application
      case 'pendingApplications':
        return {
          prerequisiteMet: !hasPendingApplications(externalData),
          prerequisiteTitle: formatMessage(m.pendingApplicationTitle),
          prerequisiteDescription: formatMessage(
            m.pendingApplicationDescription,
            {
              applicationNumber: 'test',
            },
          ),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.pendingApplicationDescription,
            { applicationNumber: 'test' },
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
          buttonText: formatMessage(m.pendingApplicationButtonText),
        }
    }
  }

  const externalData = application.externalData
  const prerequisites = buildPrerequisite(externalData)

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
