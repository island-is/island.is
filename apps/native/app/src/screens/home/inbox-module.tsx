import {
  Typography,
  Heading,
  ChevronRight,
  ListItemSkeleton,
  EmptyCard,
} from '@ui'

import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, SafeAreaView, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import leCompanys3 from '../../assets/illustrations/le-company-s3.png'
import { navigateTo } from '../../lib/deep-linking'
import { useListDocumentsQuery } from '../../graphql/types/schema'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { InboxCard } from '@ui/lib/card/inbox-card'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const EmptyWrapper = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

export const InboxModule = React.memo(() => {
  const theme = useTheme()
  const intl = useIntl()
  const { getOrganizationLogoUrl } = useOrganizationsStore()

  const { data, loading, error } = useListDocumentsQuery({
    variables: { input: { page: 1, pageSize: 3 } },
  })

  if (error && !data) {
    return null
  }

  const documents = data?.documentsV2?.data ?? []

  return (
    <SafeAreaView style={{ marginTop: theme.spacing[2] }}>
      <Host>
        <TouchableOpacity
          disabled={!documents.length}
          onPress={() => navigateTo(`/inbox`)}
          style={{ marginHorizontal: theme.spacing[2] }}
        >
          <Heading
            button={
              documents.length === 0 ? null : (
                <TouchableOpacity
                  onPress={() => navigateTo('/inbox')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography weight="400" color={theme.color.blue400}>
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <ChevronRight />
                </TouchableOpacity>
              )
            }
          >
            <FormattedMessage id="home.inbox" />
          </Heading>
        </TouchableOpacity>
        {loading && !data ? (
          Array.from({ length: 3 })
            .map((_, id) => ({
              id: String(id),
            }))
            .map((item) => <ListItemSkeleton key={item.id} />)
        ) : documents.length === 0 ? (
          <EmptyWrapper>
            <EmptyCard
              text={intl.formatMessage({
                id: 'inbox.cardNoInboxDocuments',
              })}
              image={
                <Image
                  source={leCompanys3}
                  resizeMode="contain"
                  style={{ height: 72, width: 55 }}
                />
              }
              link={null}
            />
          </EmptyWrapper>
        ) : (
          documents.map((item, index) => (
            <InboxCard
              key={item.id}
              subject={item.subject}
              publicationDate={item.publicationDate}
              id={`${item.id}-${index}`}
              unread={!item.opened}
              bookmarked={item.bookmarked}
              senderName={item.sender.name}
              icon={
                item.sender.name && getOrganizationLogoUrl(item.sender.name, 75)
              }
              onPress={() =>
                navigateTo(`/inbox/${item.id}`, {
                  title: item.sender.name,
                })
              }
            />
          ))
        )}
      </Host>
    </SafeAreaView>
  )
})
