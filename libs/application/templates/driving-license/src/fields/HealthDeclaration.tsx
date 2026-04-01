import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useFormContext } from 'react-hook-form'
import { BE } from '../lib/constants'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

const HealthDeclaration = ({ field, application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()
  const props = field.props as { title?: string; label: string }
  const id = field.id as string

  const { setValue, getValues } = useFormContext()

  const checkForGlassesMismatch = (value: string) => {
    if (id === 'healthDeclaration.usesContactGlasses') {
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
            id={id}
            split="1/2"
            smallScreenSplit="1/2"
            largeButtons={false}
            defaultValue={getValueViaPath<string[]>(application.answers, id)}
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
              //TODO: Remove when RLS/SGS supports health certificate in BE license
              if (application.answers.applicationFor === BE) {
                const currValues = getValues(
                  'healthDeclarationValidForBELicense',
                ) as string[]
                if (
                  value === YES &&
                  !(currValues as string[])?.some((x) => x === id)
                ) {
                  setValue('healthDeclarationValidForBELicense', [
                    ...(currValues ?? []),
                    id,
                  ])
                } else {
                  setValue(
                    'healthDeclarationValidForBELicense',
                    currValues?.filter((x) => x !== id),
                  )
                }
              }
              if (id === 'healthDeclaration.usesContactGlasses') {
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
