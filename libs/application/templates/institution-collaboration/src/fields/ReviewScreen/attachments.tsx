import {
  Application,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Box,
  Divider,
  Icon,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect, useState } from 'react'
import { institutionApplicationMessages as m } from '../../lib/messages'
import * as styles from './attachments.treat'
import { useMutation } from '@apollo/client'

import { CREATE_SIGNED_URL } from '@island.is/application/graphql'

interface Props {
  application: Application
  refetch?: () => void
}

export const Attachments: FC<Props> = ({ application, refetch }) => {
  const { formatMessage } = useLocale()
  const [createSignedUrl] = useMutation(CREATE_SIGNED_URL)
  const [signedAttachments, setAttchments] = useState<
    Array<{ url: string; name: string }>
  >([])

  const attachments = getValueViaPath(
    application.answers,
    'attachments',
  ) as Array<{ key: string; name: string }>

  const hasattachments = attachments && attachments?.length > 0

  const getSignedUrl = async (url?: string) => {
    try {
      if (!url) {
        return ''
      }
      const { data } = await createSignedUrl({ variables: { url } })
      return data.createSignedUrl
    } catch (error) {
      return ''
    }
  }

  const prepareAttachments = async () => {
    try {
      const rawAttachments = await Promise.all(
        attachments.map(async ({ key, name }) => {
          const url = (application.attachments as {
            [key: string]: string
          })[key]
          const signedUrl = await getSignedUrl(url)

          return { name, url: signedUrl }
        }),
      )
      setAttchments(rawAttachments)
    } catch (error) {}
  }

  useEffect(() => {
    if (
      hasattachments &&
      Object.keys(application.attachments).length === 0 &&
      refetch
    ) {
      refetch()
    } else if (
      hasattachments &&
      Object.keys(application.attachments).length > 0 &&
      signedAttachments.length === 0
    ) {
      prepareAttachments()
    }
  }, [application.attachments, hasattachments, prepareAttachments, refetch])

  return hasattachments ? (
    <>
      <Box>
        <Text variant="h5">
          {formatText(
            m.project.attachmentsSubtitle,
            application,
            formatMessage,
          )}
        </Text>
        <Box marginTop={3}>
          <Stack space={2}>
            {signedAttachments.map(({ url = '', name = '' }) => (
              <Link
                className={styles.attachmentLink}
                color="blue400"
                underlineVisibility="always"
                underline="small"
                key={url}
                href={url}
              >
                {name}
                <Icon icon="attach" />
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
      <Divider />
    </>
  ) : null
}
