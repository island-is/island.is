import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { ApproveOptions, FAFieldBaseProps, SchoolType } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'

import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'
import kennitala from 'kennitala'
import { getMessageForSchool } from '../../lib/formatters'
import { getSchoolType } from '../../lib/utils'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { ChildInput } from './ChildInput'

const childrenTypes = (CHILDREN_INDEX: number) => {
  return {
    nationalId: `children[${CHILDREN_INDEX}].nationalId`,
    school: `children[${CHILDREN_INDEX}].school`,
    hasFoodStamps: `children[${CHILDREN_INDEX}].hasFoodStamps`,
    hasAfterSchool: `children[${CHILDREN_INDEX}].hasAfterSchool`,
    hasBookAid: `children[${CHILDREN_INDEX}].hasBookAid`,
  }
}

export type ChildrenField = {
  nationalId: string
  school: string
  hasFoodStamps?: ApproveOptions.Yes | ApproveOptions.No
  hasAfterSchool?: ApproveOptions.Yes | ApproveOptions.No
  hasBookAid?: ApproveOptions.Yes | ApproveOptions.No
}

const ChildrenForm = ({ application, field, errors }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  const children = externalData.childrenCustodyInformation.data
  const sortChildrenAge = sortChildrenByAge(children).reverse()

  const id = 'children'
  const { fields, append, remove } = useFieldArray({
    name: id,
  })

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) handleAddContact()
  }, [fields])

  const handleAddContact = () =>
    append({
      nationalId: '',
      school: '',
      hasFoodStamps: '',
      hasAfterSchool: '',
      hasBookAid: '',
    })
  const handleRemoveContact = (index: number) => remove(index)

  console.log(answers)
  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {sortChildrenAge.map((child, index) => {
        return (
          <ChildInput
            id={id}
            application={application}
            field={field}
            index={index}
            key={field.id}
            handleRemoveContact={handleRemoveContact}
            errors={errors}
            childFullName={child.fullName}
            childNationalId={child.nationalId}
          />
        )
      })}
    </>
  )
}

export default withLogo(ChildrenForm)
