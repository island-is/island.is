import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Bullet, BulletList, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Approved } from '@island.is/application/ui-components'
import { CopyLink } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import School from '../../assets/School'

const ListSubmited: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const createdList = application.externalData.createEndorsementList.data as any
  const baseUrlForm = `${document.location.origin}/medmaelendalistar/`

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
      <Text marginBottom={2} variant="h3">
        {formatMessage(m.listSubmitted.bulletListTitle)}
      </Text>
      <BulletList type="ul">
        <Bullet>
          <Link
            href={formatMessage(m.listSubmitted.bulletLink1)}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {formatMessage(m.listSubmitted.bulletLink1Title)}
          </Link>
        </Bullet>
        <Bullet>
          <Link
            href={formatMessage(m.listSubmitted.bulletLink2)}
            color="blue400"
            underline="small"
            underlineVisibility="always"
          >
            {formatMessage(m.listSubmitted.bulletLink2Title)}
          </Link>
        </Bullet>
      </BulletList>
      <Box height="full" marginTop={8} marginBottom={10}>
        <School />
      </Box>
    </>
  )
}

export default ListSubmited
