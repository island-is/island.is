import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { ParentsToApplicant } from '../../shared'
import { information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import { NationalIdWithGivenFamilyName } from '../NationalIdWithGivenFamilyName'

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

  return (
    <Box key={`parentBox${index}`} hidden={isHidden}>
      <DescriptionText
        text={information.labels.parents.parentTitle}
        format={{ index: itemNumber + 1 }}
        textProps={{
          as: 'h5',
          fontWeight: 'semiBold',
          paddingBottom: 1,
          paddingTop: 3,
          marginBottom: 0,
        }}
      />
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
