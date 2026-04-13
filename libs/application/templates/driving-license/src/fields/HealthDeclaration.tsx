import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { BE } from '../lib/constants'
import { needsHealthCertificateCondition } from '../lib/utils/formUtils'
import { useFormContext } from 'react-hook-form'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

const HealthDeclaration = ({
  field,
  application,
  error,
}: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const props = field.props as { title?: string; label: string }

  const { setValue, getValues } = useFormContext()

  const clearHealthCertificateIfNotNeeded = (value: string) => {
    if (getValueViaPath(application.answers, 'applicationFor') !== BE) {
      return
    }

    // Build answers snapshot with the just-changed value so we don't
    // read stale form state for the current field
    const formValues = getValues()
    const currentAnswers = {
      ...formValues,
      healthDeclaration: {
        ...formValues.healthDeclaration,
        [field.id.replace('healthDeclaration.', '')]: value,
      },
    }

    if (
      !needsHealthCertificateCondition(YES)(
        currentAnswers,
        application.externalData,
      )
    ) {
      setValue('healthCertificate', undefined)
    }
  }

  const checkForVisionMismatch = (value: string) => {
    if (
      field.id !== 'healthDeclaration.usesContactGlasses' &&
      field.id !== 'healthDeclaration.hasReducedPeripheralVision'
    ) {
      return
    }

    const glassesUsedPreviously = application.externalData.glassesCheck.data

    // Get the current value of the other question
    const q1Value =
      field.id === 'healthDeclaration.usesContactGlasses'
        ? value
        : (getValues('healthDeclaration.usesContactGlasses') as string)
    const q2Value =
      field.id === 'healthDeclaration.hasReducedPeripheralVision'
        ? value
        : (getValues('healthDeclaration.hasReducedPeripheralVision') as string)

    // Mismatch if either vision question contradicts license data
    const q1Mismatch =
      q1Value &&
      ((glassesUsedPreviously && q1Value === NO) ||
        (!glassesUsedPreviously && q1Value === YES))
    const q2Mismatch =
      q2Value &&
      ((glassesUsedPreviously && q2Value === NO) ||
        (!glassesUsedPreviously && q2Value === YES))

    setValue(
      'healthDeclaration.contactGlassesMismatch',
      !!(q1Mismatch || q2Mismatch),
    )
  }

  return (
    <>
      {props.title && (
        <Box marginBottom={4}>
          <Text variant="h5">{formatMessage(props.title)}</Text>
        </Box>
      )}
      <Box marginBottom={1}>
        <Text>{formatMessage(props.label)}</Text>
      </Box>
      <Box style={{ maxWidth: '200px' }}>
        <RadioController
          id={field.id}
          split="1/2"
          smallScreenSplit="1/2"
          largeButtons={false}
          error={error}
          defaultValue={
            getValueViaPath<string>(application.answers, field.id) ?? undefined
          }
          options={[
            {
              label: formatMessage(m.yes),
              value: 'yes',
            },
            {
              label: formatMessage(m.no),
              value: 'no',
            },
          ]}
          onSelect={(value) => {
            checkForVisionMismatch(value)
            clearHealthCertificateIfNotNeeded(value)
          }}
        />
      </Box>
    </>
  )
}

export default HealthDeclaration
