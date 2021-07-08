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
        const prerequisiteItem = checkPrerequisite(item)
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

  // Following checks are made:
  // User should have legal residence in Iceland
  // User should not have an active draft application
  // User should not already have health insurance
  // User should not have an application already at sjukratryggingar
  const checkPrerequisite = (prerequisiteName: string) => {
    switch (prerequisiteName) {
      // https://island.is/logheimili-upplysingar-innflytjendur
      // https://island.is/en/legal-domicile-immigrant`
      case 'nationalRegistry':
        return {
          prerequisiteMet: hasNoIcelandicAddress(externalData),
          title: formatMessage(m.prerequisiteNationaalRegistryTitle),
          description: formatMessage(
            m.prerequisiteNationaalRegistryDescription,
          ),
          furtherInformationTitle: formatMessage(m.registerYourselfTitle),
          furtherInformationDescription: formatMessage(
            m.registerYourselfDescription,
          ),
          buttonText: formatMessage(m.registerYourselfButtonText),
          buttonLink: formatMessage(m.registerYourselfButtonLink),
          tagText: 'something else',
        }

      //const { externalData, typeId } = application
      //const applicationSlug = getSlugFromType(typeId)
      //const oldestDraftApplicationId = getOldestDraftApplicationId(applications)
      //is/en umsoknir/${applicationSlug}/${oldestDraftApplicationId}
      case 'applications':
        return {
          prerequisiteMet: !hasActiveDraftApplication(externalData),
          title: formatMessage(m.prerequisiteActiveDraftApplicationTitle),
          description: formatMessage(
            m.prerequisiteActiveDraftApplicationDescription,
          ),
          furtherInformationTitle: formatMessage(m.activeDraftApplicationTitle),
          furtherInformationDescription: formatMessage(
            m.activeDraftApplicationDescription,
          ),
          buttonText: formatMessage(m.activeDraftApplicationButtonText),
          buttonLink: 'something',
          tagText: 'something else',
        }

      //is 'https://www.sjukra.is'
      //en 'https://www.sjukra.is/english'
      case 'healthInsurance':
        return {
          prerequisiteMet: !hasHealthInsurance(externalData),
          title: formatMessage(m.prerequisiteHealthInsuranceTitle),
          description: formatMessage(m.prerequisiteHealthInsuranceDescription),
          furtherInformationTitle: formatMessage(m.alreadyInsuredTitle),
          furtherInformationDescription: formatMessage(
            m.alreadyInsuredDescription,
          ),
          buttonText: formatMessage(m.alreadyInsuredButtonText),
          buttonLink: formatMessage(m.activeDraftApplicationButtonLink),
          tagText: 'something else',
        }

      //is 'https://www.sjukra.is/um-okkur/thjonustuleidir/ '
      //en 'https://www.sjukra.is/english'
      case 'pendingApplications':
        return {
          prerequisiteMet: !hasPendingApplications(externalData),
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
          tagText: 'something else',
        }
      // Should never go to the default as we dont check prerequisites that arent defined in the PREREQUISITESTOCHECK
      // constant but incase it does happen we send the requirement met flag as true in order not to block anything
      default:
        return {
          prerequisiteMet: true,
          title: formatMessage(m.unexpectedError),
          description: formatMessage(m.unexpectedError),
          furtherInformationTitle: formatMessage(m.unexpectedError),
          furtherInformationDescription: formatMessage(m.unexpectedError),
          // TODO FIX, maybe just return empty string and not render it in the summaryItem?
          buttonText: formatMessage(m.pendingApplicationButtonText),
          buttonLink: 'something',
          tagText: 'something else',
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
              index={i + 1}
              application={application}
              {...prerequisite}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default PrerequisiteSummary
