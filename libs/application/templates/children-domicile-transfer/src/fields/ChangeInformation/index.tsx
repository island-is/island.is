import React from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import {
  extractParentFromApplication,
  constructParentAddressString,
} from '../../lib/utils'
import { CheckboxController } from '@island.is/shared/form-fields'

const ChangeInformation = ({ field, application, error }: FieldBaseProps) => {
  const { id, disabled } = field
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  return (
    <>
      <Text marginBottom={2} marginTop={3}>
        Sem foreldrar með sameiginlega forsjá getið þið óskað eftir því að
        flytja lögheimili barns frá foreldri A til foreldri B eða öfugt.
      </Text>
      <Text marginBottom={4}>
        Vinsamlegast staðfestu að lögheimili barns sé að flytjast til hins
        foreldris eins og skráð hér fyrir neðan.
      </Text>
      <Box marginBottom={4}>
        <Text variant="h4">Núverandi lögheimili barna:</Text>
        <Text variant="h4" color="blue400">
          {/* // TODO: Get name of applicant */}
          {application?.applicant}
        </Text>
        <Text fontWeight="light">
          {/* TODO: Get address from applicant */}
          Missing address
        </Text>
      </Box>
      <Box marginBottom={6}>
        <Text variant="h4">Nýtt lögheimili barna:</Text>
        <Text variant="h4" color="blue400">
          {parent?.name}
        </Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <CheckboxController
        id={id}
        disabled={disabled}
        name={`${id}`}
        error={error}
        large={true}
        options={[
          {
            value: 'yes',
            label: 'Ég samþykki breytingu',
          },
        ]}
      />
    </>
  )
}

export default ChangeInformation
