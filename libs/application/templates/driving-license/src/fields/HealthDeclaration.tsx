import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
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

  const { setValue } = useFormContext()

  const checkForGlassesMismatch = (value: string) => {
    if (field.id === 'healthDeclaration.usesContactGlasses') {
      const glassesUsedPreviously = application.externalData.glassesCheck.data

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
    <>
      {props.title && (
        <Box marginBottom={4}>
          <Text variant="h5">{formatMessage(props.title)}</Text>
        </Box>
      )}
      <GridRow>
        <GridColumn span={['12/12', '8/12']} paddingBottom={1}>
          <Text>{formatMessage(props.label)}</Text>
        </GridColumn>
        <GridColumn span={['8/12', '3/12']} offset={['0', '1/12']}>
          <RadioController
            id={field.id}
            split="1/2"
            smallScreenSplit="1/2"
            largeButtons={false}
            error={error}
            defaultValue={
              (getValueViaPath(application.answers, field.id) as string[]) ??
              undefined
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
              if (field.id === 'healthDeclaration.usesContactGlasses') {
                checkForGlassesMismatch(value)
              }
            }}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}

export default HealthDeclaration
