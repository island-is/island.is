import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import Illustration from '../../../../assets/Illustration'
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

export const ListCreated: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { slug } = application.externalData.createLists.data as { slug: string }
  return (
    <>
      <Box>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.shareList)}
        </Text>
        <CopyLink
          linkUrl={`${document.location.origin}${slug}`}
          buttonTitle={formatMessage(m.copyLink)}
        />
      </Box>

      <Box display="flex" justifyContent="center" marginY={5}>
        <Illustration />
      </Box>
    </>
  )
}

export default ListCreated
