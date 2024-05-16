import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'

import { ChildInput } from './ChildInput'
import { sortChildrenUnderAgeByAge } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'

export type ChildrenField = {
  nationalId: string
  school: string
  hasFoodStamps: ApproveOptions.Yes | ApproveOptions.No
  hasAfterSchool: ApproveOptions.Yes | ApproveOptions.No
  hasBookAid: ApproveOptions.Yes | ApproveOptions.No
}

const ChildrenForm = ({ application, field, errors }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { externalData, answers } = application
  const childrenExternalData = externalData.childrenCustodyInformation.data
  const childrenInfo = sortChildrenUnderAgeByAge(childrenExternalData)

  const { childrenSchoolInfo } = answers

  const { setValue } = useFormContext()

  useEffect(() => {
    if (childrenSchoolInfo.length === 0) {
      const formChildren = childrenInfo.map((f) => {
        return {
          fullName: f.fullName,
          nationalId: f.nationalId,
        }
      })
      setValue(field.id, formChildren)
    }
  }, [childrenInfo])

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {childrenSchoolInfo.length !== 0 &&
        childrenSchoolInfo.map((child, index) => {
          return (
            <ChildInput
              id={field.id}
              application={application}
              index={index}
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
