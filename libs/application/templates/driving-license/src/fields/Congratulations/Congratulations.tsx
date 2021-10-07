import React from 'react'

import {
  Box,
  ContentBlock,
  Text,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import WarningSection, { Step } from './WarningSection'
import { hasYes } from '../../utils'

interface ReasonsProps {
  key: string
  requirementMet: boolean
}

const extractReasons = (reasons: ReasonsProps[]): Step[] => {
  return reasons.map(({ key, requirementMet }) =>
    requirementKeyToStep(key, requirementMet),
  )
}

const requirementKeyToStep = (key: string, isRequirementMet: boolean): Step => {
  const step = {
    key: key,
    state: isRequirementMet,
  }

  switch (key) {
    case 'picture':
      return {
        ...step,
        title: m.congratulationsQualityPictureTitle,
        description: m.congratulationsQualityPictureDescription,
      }
    case 'certificate':
      return {
        ...step,
        title: m.congratulationsCertificateTitle,
        description: m.congratulationsCertificateDescription,
      }
    default:
      throw new Error('Unknown requirement reason - should not happen')
  }
}

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

interface Name {
  fullName: string
}

const Congratulations = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const name = application.externalData.nationalRegistry?.data as Name
  const picture = hasYes(answers?.willBringQualityPhoto)
  const certificate = hasYes(answers?.healthDeclaration)

  const reasons = [
    { key: 'picture', requirementMet: picture },
    { key: 'certificate', requirementMet: certificate },
  ]

  const steps = extractReasons(reasons)

  if (!picture && !certificate) {
    return (
      <Box paddingTop={2}>
        <Box marginTop={2}>
          <ContentBlock>
            <AlertMessage
              type="success"
              title={`${formatText(
                m.congratulationsTitle,
                application,
                formatMessage,
              )} ${name.fullName}`}
              message={formatText(
                m.congratulationsTitleSuccess,
                application,
                formatMessage,
              )}
            />
          </ContentBlock>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box paddingTop={2}>
        <Text>
          {formatText(m.congratulationsHelpText, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={5} marginBottom={8}>
        {steps.map(
          (step, index) =>
            step.state && (
              <WarningSection
                key={index}
                application={application}
                step={step}
              />
            ),
        )}
      </Box>
    </>
  )
}

export default Congratulations
