import React, { useState, useEffect } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { DocumentProvidersSearch } from '../../components/DocumentProviders/DocumentProviders'

const DocumentProviders: ServicePortalModuleComponent = ({ userInfo }) => {
  interface Data {
    name: string
    id: string
  }
  const { formatMessage } = useLocale()

  useEffect(() => {
    //TODO: Set up real data
    handleFetch()
  }, [])

  const [data, setData] = useState<Data[]>([])

  const handleFetch = () => {
    //TODO: Set up real data
    setData([
      {
        name: 'Þjóðskrá Íslands',
        id: 'dsadg232-dsadsa12-dsadas56',
      },
      {
        name: 'Ríkisskattstjóri',
        id: 'dsdsdsa22-dsadsa12-dsadas56',
      },
      {
        name: 'Heilbrigðisstofnun Vesturlands',
        id: '3232dsadsa-dsadsa12-dsadas56',
      },
    ])
  }

  return (
    <Box marginBottom={[2, 3, 5]}>
      <Box marginBottom={[2, 3]}>
        <Text variant="h1" as="h1">
          {formatMessage(m.documentProvidersTitle)}
        </Text>
      </Box>
      <Box marginBottom={[2, 3]}>
        <Text as="p">{formatMessage(m.documentProvidersDescription)}</Text>
      </Box>

      {data.length !== 0 && <DocumentProvidersSearch data={data} />}
    </Box>
  )
}

export default DocumentProviders
