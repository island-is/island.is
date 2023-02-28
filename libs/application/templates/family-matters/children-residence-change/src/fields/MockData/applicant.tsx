import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { CRCFieldBaseProps } from '../../types'

const applicantDefault = {
  fullName: 'Applicant Mockname',
  address: {
    streetAddress: 'Borgartún 26',
    postalCode: '105',
    city: 'Reykjavík',
  },
}

const MockApplicant = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { answers } = application
  const applicant = answers.mockData?.applicant || applicantDefault

  return (
    <Box marginTop={5}>
      <Box marginBottom={3}>
        <Text>Umsækjandi</Text>
        <Box marginTop={2}>
          <InputController
            id={`${id}.nationalId`}
            name={`${id}.nationalId`}
            label="Kennitala"
            format="######-####"
          />
        </Box>
        <Box marginTop={2}>
          <InputController
            id={`${id}.fullName`}
            name={`${id}.fullName`}
            label="Nafn"
            defaultValue={applicant.fullName}
          />
        </Box>
        <Box marginTop={2}>
          <InputController
            id={`${id}.address.streetAddress`}
            name={`${id}.address.streetAddress`}
            label="Heimilisfang"
            defaultValue={applicant.address?.streetAddress || ''}
          />
        </Box>
        <Box marginTop={2}>
          <InputController
            id={`${id}.address.postalCode`}
            name={`${id}.address.postalCode`}
            label="Póstnúmer"
            defaultValue={applicant.address?.postalCode || ''}
          />
        </Box>
        <Box marginTop={2}>
          <InputController
            id={`${id}.address.city`}
            name={`${id}.address.city`}
            label="Borg"
            defaultValue={applicant.address?.locality || ''}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default MockApplicant
