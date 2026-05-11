import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { getInitials, m } from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import HealthMessageActionBar from './HealthMessageActionBar'

type UseParams = {
  id: string
}

const MOCK_MESSAGES: Record<
  string,
  {
    id: string
    organization: string
    dateTime: string
    category: string
    subject: string
    body: string
    attachments: string[]
    starred: boolean
    archived: boolean
  }
> = {
  '1': {
    id: '1',
    organization: 'Heilsugæslan Glæsibæ',
    dateTime: '6. febrúar 2026, 15:23',
    category: 'Heilsa',
    subject: 'Eftirfylgni meðferðar',
    body: 'Sæl Lísa, hér er með afrit af nst.\n\nÞetta kemur allt vel út, blóðmagn, nýru, sölt, blóðsykur, blóðfitur, járnmagn, B12, lifrarprof, skjaldkirtils og efni sem mælir bólgur og sýkingar er alveg eðl.\n\nMeð kveðju,\n\nJón Gunnarsson, heimilislæknir',
    attachments: ['lisajons.blpr'],
    starred: false,
    archived: false,
  },
  '2': {
    id: '2',
    organization: 'Meltingarsetrið',
    dateTime: '27. október 2025, 09:00',
    category: 'Heilsa',
    subject: 'Leiðbeiningar fyrir magaspeglun',
    body: 'Góðan dag.\n\nHér eru leiðbeiningar fyrir komandi magaspeglun.\n\nMeð kveðju,\nMeltingarsetrið',
    attachments: [],
    starred: false,
    archived: false,
  },
}

// Placeholder initials — in production this would come from user profile
const USER_INITIALS = 'LJ'
const REPLY_DATETIME = '6. febrúar 2026, 18:14'

const CircleLogo = ({ organization }: { organization: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="blue100"
    borderColor="blue200"
    borderWidth="standard"
    style={{ width: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {getInitials(organization)}
    </Text>
  </Box>
)

const UserInitialsAvatar = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    background="blueberry100"
    style={{ width: 48, height: 48, flexShrink: 0 }}
  >
    <Text variant="h5" as="p">
      {USER_INITIALS}
    </Text>
  </Box>
)

const HealthMessageDetail = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const item = MOCK_MESSAGES[id]

  const [starred, setStarred] = useState(item?.starred ?? false)
  const [archived, setArchived] = useState(item?.archived ?? false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  if (!item) {
    return (
      <Box padding={6}>
        <Text>{formatMessage(messages.healthMessageNotFound)}</Text>
      </Box>
    )
  }

  return (
    <GridContainer>
      <GridRow marginTop={2}>
        <GridColumn span={['12/12', '12/12', '10/12']}>
          <Box
            background="white"
            borderColor="blue200"
            borderWidth="standard"
            borderRadius="large"
            paddingTop={3}
            paddingBottom={5}
            paddingX={5}
          >
            {/* Header: subject + actions */}
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={3}
            >
              <Text variant="h3" as="h1">
                {item.subject}
              </Text>
              <HealthMessageActionBar
                bookmarked={starred}
                archived={archived}
                onReply={() => setReplyOpen((v) => !v)}
                onFav={() => setStarred((v) => !v)}
                onStash={() => setArchived((v) => !v)}
              />
            </Box>

            {/* Sender info */}
            <Box
              display="flex"
              alignItems="center"
              columnGap={2}
              marginBottom={replyOpen ? 3 : 4}
            >
              <CircleLogo organization={item.organization} />
              <Box>
                <Text fontWeight="semiBold">{item.organization}</Text>
                <Box display="flex" alignItems="center" columnGap={2}>
                  <Text color="dark400" variant="small">
                    {item.dateTime}
                  </Text>
                  <Box
                    borderLeftWidth="standard"
                    borderColor="blue200"
                    style={{ height: 14 }}
                  />
                  <Tag variant="blue" outlined>
                    {item.category}
                  </Tag>
                </Box>
              </Box>
            </Box>

            {!replyOpen && (
              <>
                {/* Body */}
                <Box marginBottom={4}>
                  {item.body.split('\n\n').map((paragraph, i) => (
                    <Text key={i} marginBottom={2}>
                      {paragraph}
                    </Text>
                  ))}
                </Box>

                {/* Attachments */}
                {item.attachments.length > 0 && (
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    columnGap={2}
                    marginBottom={5}
                  >
                    {item.attachments.map((file) => (
                      <Button
                        key={file}
                        size="small"
                        variant="utility"
                        icon="document"
                        iconType="outline"
                        onClick={() => undefined}
                      >
                        {file}
                      </Button>
                    ))}
                  </Box>
                )}

                {/* Reply button */}
                <Button
                  variant="ghost"
                  size="medium"
                  iconType="outline"
                  icon="undo"
                  onClick={() => setReplyOpen(true)}
                >
                  {formatMessage(m.replyDocument)}
                </Button>
              </>
            )}

            {replyOpen && (
              <>
                <Divider />

                {/* Reply header */}
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="flexStart"
                  paddingTop={3}
                  marginBottom={3}
                >
                  <Box display="flex" alignItems="center" columnGap={2}>
                    <UserInitialsAvatar />
                    <Box>
                      <Text fontWeight="semiBold">
                        {formatMessage(messages.healthMessageTo, {
                          arg: item.organization,
                        })}
                      </Text>
                      <Box display="flex" alignItems="center" columnGap={2}>
                        <Text color="dark400" variant="small">
                          {REPLY_DATETIME}
                        </Text>
                        <Box
                          borderLeftWidth="standard"
                          borderColor="blue200"
                          style={{ height: 14 }}
                        />
                        <Tag variant="blue" outlined>
                          {item.category}
                        </Tag>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    circle
                    icon="close"
                    colorScheme="light"
                    onClick={() => setReplyOpen(false)}
                  />
                </Box>

                {/* Reply textarea */}
                <Box marginBottom={3}>
                  <Input
                    textarea
                    rows={6}
                    name="reply-message"
                    label={formatMessage(m.messages)}
                    backgroundColor="blue"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </Box>

                {/* Reply footer */}
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                >
                  <Button
                    variant="utility"
                    icon="share"
                    iconType="outline"
                    onClick={() => undefined}
                  >
                    {formatMessage(messages.healthMessageUploadFile)}
                  </Button>
                  <Button onClick={() => undefined}>
                    {formatMessage(messages.healthMessageSend)}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default HealthMessageDetail
