import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import RecommendationTable from './RecommendationTable'

const SIGNATURES = [
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
  },
  {
    date: '21.01.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalRegistry: '1991921335',
    address: 'Miðskógar 17',
  },
  {
    date: '21.01.2021',
    name: 'Stefán Haukdal',
    nationalRegistry: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: true,
  },
  {
    date: '21.01.2021',
    name: 'Brian Johannesen',
    nationalRegistry: '1991921335',
    address: 'Reykjavík',
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
  },
]

// Todo look into if this exists as util somewhere..
const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

const Recommendations: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={8}>
      <FieldDescription description={'Hér er hlekkur til að afrita'} />
      <Box
        background="blue100"
        display="flex"
        justifyContent="spaceBetween"
        padding={3}
        marginY={3}
        borderRadius="large"
      >
        <Text variant="h5" color="blue400">
          www.island.is/listabókstafur/128877634/
        </Text>
        <Box>
          <Button
            onClick={() =>
              copyToClipboard('www.island.is/listabókstafur/128877634/')
            }
            type="button"
            variant="text"
          >
            Afrita tengil
          </Button>
        </Box>
      </Box>
      <Text variant="h3">{`${SIGNATURES.length} nöfn á lista (300)`}</Text>
      <Box marginTop={3}>
        <RecommendationTable
          application={application}
          signatures={SIGNATURES}
        />
      </Box>
    </Box>
  )
}

export default Recommendations
