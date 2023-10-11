import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import {
  getValueViaPath,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { NO, YES } from '../lib/constants'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function HealthDeclaration({
  field,
  application,
  error,
}: PropTypes): JSX.Element {
  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const props = field.props as { label: string }

  useEffect(() => {
    const healthDeclarationErrors = getErrorViaPath(
      errors,
      'healthDeclaration.answers',
    )

    if (!!healthDeclarationErrors) {
      setValue('healthDeclaration.error', true)
    } else {
      setValue('healthDeclaration.error', false)
    }
  }, [error, errors, setValue])

  const checkForGlassesMismatch = (value: string) => {
    if (field.id === 'healthDeclaration.answers.usesContactGlasses') {
      const glassesUsedPreviously = application.externalData.glassesCheck.data

      console.log(glassesUsedPreviously)

      if (
        (glassesUsedPreviously && value === NO) ||
        (!glassesUsedPreviously && value === YES)
      ) {
        setValue('healthDeclaration.contactGlassesMismatch', true)
      } else {
        setValue('healthDeclaration.contactGlassesMismatch', false)
      }
    }
  }

  return (
    <GridRow>
      <GridColumn span={['12/12', '8/12']}>
        <Text>{formatText(props.label, application, formatMessage)}</Text>
      </GridColumn>
      <GridColumn span={['8/12', '3/12']} offset={['0', '1/12']}>
        <RadioController
          id={field.id}
          split="1/2"
          smallScreenSplit="1/2"
          largeButtons={false}
          defaultValue={
            (getValueViaPath(application.answers, field.id) as string[]) ??
            undefined
          }
          options={[
            {
              label: formatText(m.yes, application, formatMessage),
              value: YES,
            },
            {
              label: formatText(m.no, application, formatMessage),
              value: NO,
            },
          ]}
          onSelect={(value) => {
            if (field.id === 'healthDeclaration.answers.usesContactGlasses') {
              checkForGlassesMismatch(value)
            }
          }}
        />
      </GridColumn>
    </GridRow>
  )
}

export default HealthDeclaration
