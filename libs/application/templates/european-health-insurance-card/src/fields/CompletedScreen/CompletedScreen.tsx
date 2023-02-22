import { Box, Button, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { europeanHealthInsuranceCardApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import Link from 'next/link'
import { TempData } from '../../lib/types'
import { base64ToArrayBuffer } from '../../lib/helpers/applicantHelper'

const CompletedScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  console.log(application)
  const tempData = application.externalData.getTemporaryCard?.data as TempData[]
  console.log(tempData, 'tempData')
  let links: JSX.Element[] = []

  if (tempData) {
    for (let i = 0; i < tempData.length; i++) {
      const byte = base64ToArrayBuffer(tempData[i].data)
      const blob = new Blob([byte], { type: tempData[i].contentType })
      // return URL.createObjectURL(blob)
      const uri = URL.createObjectURL(blob)
      links.push(
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={() => window.open(uri, '_blank')}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
        >
          {tempData[i].fileName}
        </Button>,
      )
    }
  }
  // if (tempData) {<Link href={tempData.uri}>{tempData.fileName}</Link>}
  return (
    <Stack space={1}>
      <Box marginBottom={2} marginTop={2}>
        {links}

        <Text lineHeight="lg">TODO: Hér koma PDF tenglar</Text>
      </Box>
    </Stack>
  )
}
export default CompletedScreen
