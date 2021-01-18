import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { extractParentFromApplication } from '../../lib/utils'

const DomicileChangeInformation = ({ application }: FieldBaseProps) => {
  const parent = extractParentFromApplication(application)
  const parentAddress = `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
  return (
    <>
      <Text marginBottom={2}>
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
      <Box marginBottom={2}>
        <Text variant="h4">Nýtt lögheimili barna:</Text>
        <Text variant="h4" color="blue400">
          {parent?.name}
        </Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
    </>
  )
}

export default DomicileChangeInformation
