import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { extractParentFromApplication, extractChildrenFromApplication, extractAnswersFromApplication } from '../../lib/utils'

const Review = ({ application }: FieldBaseProps) => {
  const parent = extractParentFromApplication(application)
  const parentAddress = `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
  const children = extractChildrenFromApplication(application)
  const usePluralForChildren = children.length > 1
  const answers = extractAnswersFromApplication(application)
  return (
    <>
      <Text marginBottom={4} marginTop={2}>
        Hér er yfirlit yfir samning um breytt lögheimili. <strong>Þú og {parent.name}</strong> þurfa að staðfesta og undirrita áður en málið fer í afgreiðslu hjá sýslumanni.
      </Text>
      <Box marginBottom={4}>
        {usePluralForChildren ? <Text variant="h4">Nöfn barna</Text> : <Text variant="h4">Nafn barns</Text>}
        {children.map(child => <Text>{child.name}</Text>)}
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Núverandi lögheimili {usePluralForChildren ? 'barna' : 'barns'}:</Text>
        <Text>
          {/* // TODO: Get name of applicant */}
          {application?.applicant}
        </Text>
        <Text>
          {/* TODO: Get address from applicant */}
          Missing address
        </Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Nýtt lögheimili barna:</Text>
        <Text>
          {parent?.name}
        </Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Tilhögun flutnings:</Text>
        <Text>
          {answers.durationDate ? answers.durationDate : 'Til frambúðar'}
        </Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">Áhrif umsóknar:</Text>
        <Text>
          Ég skil hvaða áhrif lögheimilisbreyting hefur
        </Text>
      </Box>
    </>
  )
}

export default Review
