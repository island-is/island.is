import {
  Box,
  Icon,
  SkeletonLoader,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, LinkResolver, m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { ApiScope } from '@island.is/auth/scopes'
import { useGetHealthConversationsQuery } from '../../../HealthConversations/HealthConversations.generated'
import ConversationAvatar from '../../../HealthConversations/components/ConversationAvatar'
import { HealthPaths } from '../../../../lib/paths'
import { messages } from '../../../../lib/messages'
import * as styles from './HealthConversationsBox.css'

interface Props {
  limit: number
}

const StateMessage = ({
  title,
  text,
  imgSrc,
}: {
  title: string
  text?: string
  imgSrc: string
}) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    paddingTop={2}
    rowGap={2}
    paddingX={[2, 4, 0]}
  >
    <Text variant="h4" textAlign="center">
      {title}
    </Text>
    {text && (
      <Text textAlign="center" whiteSpace="preLine">
        {text}
      </Text>
    )}
    <Box paddingTop={2}>
      <img src={imgSrc} alt="" className={styles.stateImage} />
    </Box>
  </Box>
)

export const HealthConversationsBox = ({ limit }: Props) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const hasHealthScope = !!userInfo?.scopes?.includes(ApiScope.health)

  const { data, loading, error } = useGetHealthConversationsQuery({
    variables: { input: {} },
    skip: !hasHealthScope,
  })

  const conversations = (
    data?.healthDirectorateHealthConversations ?? []
  ).slice(0, limit)

  return (
    <Box
      position="relative"
      background="white"
      borderRadius="large"
      borderWidth="standard"
      borderColor="blue200"
      paddingTop={3}
      paddingBottom={3}
      paddingX={[0, 0, 4]}
      height="full"
    >
      {!loading && !hasHealthScope && (
        <span className={styles.lock} aria-hidden="true">
          <Icon icon="lockClosed" type="outline" color="blue600" size="small" />
        </span>
      )}

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
        paddingX={[2, 4, 0]}
      >
        <LinkResolver href={HealthPaths.HealthConversations}>
          <Box
            display="flex"
            alignItems="center"
            columnGap={2}
            overflow="hidden"
          >
            <Icon icon="mail" type="outline" color="blue400" size="medium" />
            <Text variant="h4" as="h2" color="blue400" truncate>
              {formatMessage(messages.healthConversationsBoxTitle)}
            </Text>
          </Box>
        </LinkResolver>
      </Box>

      {loading && (
        <Box marginTop={4} paddingX={[4, 4, 0]}>
          <SkeletonLoader
            space={2}
            repeat={4}
            display="block"
            width="full"
            height={56}
          />
        </Box>
      )}

      {!loading && !hasHealthScope && (
        <StateMessage
          title={formatMessage(m.accessNeeded)}
          text={formatMessage(m.accessDeniedText)}
          imgSrc="./assets/images/jobsGrid.svg"
        />
      )}

      {!loading && hasHealthScope && error && (
        <StateMessage
          title={formatMessage(m.errorTitle)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}

      {!loading && hasHealthScope && !error && conversations.length === 0 && (
        <Problem type="no_data" size="small" noBorder />
      )}

      {!loading &&
        hasHealthScope &&
        !error &&
        conversations.map((item) => {
          const unread = !item.isRead
          return (
            <LinkResolver
              key={item.id}
              href={HealthPaths.HealthConversationsDetail.replace(
                ':id',
                item.id,
              )}
              className={styles.conversationLink}
            >
              <Box
                display="flex"
                alignItems="center"
                columnGap={2}
                paddingX={[2, 4, 2]}
                borderTopWidth="standard"
                borderColor="blue200"
                style={{ paddingTop: 12, paddingBottom: 12 }}
                className={unread ? styles.unreadRow : undefined}
              >
                <ConversationAvatar
                  variant="organization"
                  logoUrl={item.organization?.logoUrl ?? undefined}
                />
                <Box flexGrow={1} overflow="hidden">
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                    columnGap={2}
                  >
                    <Box overflow="hidden">
                      <Text variant="medium" truncate>
                        {item.organization?.name}
                      </Text>
                    </Box>
                    {item.lastMessageSentAt && (
                      <Box flexShrink={0}>
                        <Text variant="medium" color="dark400">
                          {formatDate(item.lastMessageSentAt)}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Text
                    color="blue400"
                    fontWeight={unread ? 'medium' : 'regular'}
                    truncate
                  >
                    {item.title}
                    {unread && (
                      <VisuallyHidden>
                        {` - ${formatMessage(m.notificationUnread)}`}
                      </VisuallyHidden>
                    )}
                  </Text>
                </Box>
              </Box>
            </LinkResolver>
          )
        })}
    </Box>
  )
}

export default HealthConversationsBox
