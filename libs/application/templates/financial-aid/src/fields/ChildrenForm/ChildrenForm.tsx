import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'

import { ChildInput } from './ChildInput'
import { sortChildrenUnderAgeByAge } from '../../lib/utils'

const ChildrenForm = ({ application, field, errors }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { externalData } = application
  const childrenExternalData = externalData.childrenCustodyInformation.data
  const childrenInfo = sortChildrenUnderAgeByAge(childrenExternalData)

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {childrenInfo?.map((child, index) => {
        return (
          <ChildInput
            id={field.id}
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
