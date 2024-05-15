import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'

import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'
import { useFieldArray } from 'react-hook-form'
import { ChildInput } from './ChildInput'
import { getValueViaPath } from '@island.is/application/core'

export type ChildrenField = {
  nationalId: string
  school: string
  hasFoodStamps: ApproveOptions.Yes | ApproveOptions.No
  hasAfterSchool: ApproveOptions.Yes | ApproveOptions.No
  hasBookAid: ApproveOptions.Yes | ApproveOptions.No
}

const ChildrenForm = ({ application, errors, field }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()

  const childrenInfo = application.externalData.childrenCustodyInformation.data

  const { id } = field
  const { answers } = application
  const children = answers?.children

  const { fields, append, remove } = useFieldArray({ name: id })

  const handleAddPerson = useCallback(() => {
    append({
      nationalId: '',
      school: '',
      hasFoodStamps: ApproveOptions.No,
      hasAfterSchool: ApproveOptions.No,
      hasBookAid: ApproveOptions.No,
    })
  }, [append])

  const handleRemovePerson = (index: number) => remove(index)

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) {
      handleAddPerson()
    }
  }, [fields, handleAddPerson])

  console.log(fields)

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {fields.map((field, index) => {
        return (
          <ChildInput
            id={field.id}
            application={application}
            field={field}
            index={index}
            key={field.id}
            errors={errors}
            childFullName="adsa"
            childNationalId="asd"
          />
        )
      })}
    </>
  )
}

export default withLogo(ChildrenForm)
