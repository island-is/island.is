import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  GenericFormField,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { ParentsToApplicant } from '../../shared'
import { information } from '../../lib/messages'
import { NationalIdWithGivenFamilyName } from '../NationalIdWithGivenFamilyName'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'

interface Props {
  index: number
  isHidden?: boolean
  disabled?: boolean
  readOnly?: boolean
  isRequired?: boolean
  repeaterField: GenericFormField<ParentsToApplicant>
  itemNumber: number
  addParentToApplication: (index: number) => void
}

export const ParentRepeaterItem: FC<Props & FieldBaseProps> = ({
  index,
  isHidden,
  disabled,
  readOnly,
  isRequired,
  repeaterField,
  itemNumber,
  addParentToApplication,
  ...props
}) => {
  const { application, errors, field } = props
  const { formatMessage } = useLocale()
  return (
    <Box hidden={isHidden}>
      <Box paddingTop={3} paddingBottom={1}>
        {DescriptionFormField({
          application: application,
          showFieldName: false,
          field: {
            id: 'title',
            title: '',
            description: formatMessage(information.labels.parents.parentTitle, {
              index: itemNumber + 1,
            }),
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>
      <NationalIdWithGivenFamilyName
        field={field}
        application={application}
        customId={`${field.id}.parents[${index}]`}
        isRequired={isRequired}
        addParentToApplication={addParentToApplication}
        itemNumber={itemNumber}
        repeaterField={repeaterField}
        errors={errors}
        readOnly={readOnly}
      />
    </Box>
  )
}
