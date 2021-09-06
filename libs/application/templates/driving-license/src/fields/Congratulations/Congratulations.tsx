import React from 'react'

import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import WarningSection, { Step } from './WarningSection'

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

interface name {
  fullName: string
}

const Congratulations = ({
  error,
  field,
  application,
}: PropTypes): JSX.Element => {
  const name = application.externalData.nationalRegistry?.data as name
  const { formatMessage } = useLocale()
  const { answers } = application
  const picture = answers.willBringQualityPhoto === 'yes'
  const certificate = Object.values(answers?.healthDeclaration).includes('yes')
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
  } else {
    return (
      <Box marginTop={7} marginBottom={8}>
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
    )
  }
}

export default Congratulations
