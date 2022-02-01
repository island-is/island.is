import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import School from '../../assets/School'

const ListSubmited: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const createdList = application.externalData.createEndorsementList.data as any
  const baseUrl =
    document.location.origin === 'http://localhost:4242'
      ? 'http://localhost:4200'
      : document.location.origin
  const baseUrlForm = `${baseUrl}/medmaelendalistar/`

  return (
    <>
      <Approved
        title={formatMessage(m.listSubmitted.approvedTitle)}
        subtitle={formatMessage(m.listSubmitted.approvedSubtitle)}
      />
      <Text marginBottom={2} variant="h3">
        {'Hlekkur á lista'}
      </Text>
      <Box marginBottom={2}>
        <CopyLink
          linkUrl={baseUrlForm + createdList?.id}
          buttonTitle={formatMessage(m.endorsementList.copyLinkButton)}
        />
      </Box>
      <Box height="full" marginTop={8} marginBottom={10}>
        <School />
      </Box>
    </>
  )
}

export default ListSubmited
