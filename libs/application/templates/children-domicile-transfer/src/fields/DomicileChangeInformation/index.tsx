import React from 'react'
import {
  FieldBaseProps, Field
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { extractParentFromApplication } from '../../lib/utils'

interface AdditionalProps {
  someProp: string
}

interface FieldBasePropsWithAdditionalProps extends FieldBaseProps {
  field: Field & {
    props: AdditionalProps
  }
}

const TextComponent = ({ application }: FieldBasePropsWithAdditionalProps) => {
  const parent = extractParentFromApplication(application)
  const parentAddress = `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
  return (
    <>
    <Box marginBottom={4}>
      <Text variant="h4">
        Núverandi lögheimili barna:
      </Text>
      <Text variant="h4" color="blue400">
        {/* // TODO: Get name of applicant */}
        {application?.applicant}
      </Text>
      <Text fontWeight="light">
        {/* TODO: Get address from applicant */}
        Missing address
      </Text>
    </Box>
    <Box marginBottom={2}>
      <Text variant="h4">
        Nýtt lögheimili barna:
      </Text>
      <Text variant="h4" color="blue400">
        {parent?.name}
      </Text>
      <Text fontWeight="light">
        {parentAddress}
      </Text>
    </Box>
    </>
  )
}

export default TextComponent
