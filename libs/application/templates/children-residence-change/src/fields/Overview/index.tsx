import React from 'react'
import HtmlParser from 'react-html-parser'
import { FieldBaseProps } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
  constructParentAddressString,
  extractApplicantFromApplication,
} from '../../lib/utils'
import { contract } from '../../lib/messages'

const Overview = ({ application }: FieldBaseProps) => {
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const usePluralForChildren = children.length > 1
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useLocale()
  const description = formatMessage(contract.general.description, {
    otherParent: parent.name,
  })
  return (
    <>
      <Box marginTop={2}>
        <AlertMessage
          type="info"
          title="Upphafsdagur samnings"
          message="Breyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur afgreitt hana."
        />
      </Box>
      <Text marginBottom={4} marginTop={2}>
        {description}
      </Text>
      <Box marginBottom={4}>
        {usePluralForChildren ? (
          <Text variant="h4">Nöfn barna</Text>
        ) : (
          <Text variant="h4">Nafn barns</Text>
        )}
        {children.map((child) => (
          <Text key={child.name}>{child.name}</Text>
        ))}
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">
          Núverandi lögheimili {usePluralForChildren ? 'barna' : 'barns'}:
        </Text>
        <Text>{applicant?.fullName}</Text>
        <Text>{applicant?.legalResidence}</Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Nýtt lögheimili barna:</Text>
        <Text>{parent?.name}</Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Tilhögun flutnings:</Text>
        <Text>
          {answers.durationDate ? answers.durationDate : 'Til frambúðar'}
        </Text>
      </Box>
    </>
  )
}

export default Overview
