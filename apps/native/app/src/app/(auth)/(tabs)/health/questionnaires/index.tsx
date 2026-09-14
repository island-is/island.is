import { useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, Image, Pressable, RefreshControl } from 'react-native'
import { ContextMenu } from 'react-native-platform-components'
import { useTheme } from 'styled-components/native'

import { StackScreen } from '@/components/stack-screen'
import {
  GetQuestionnairesQueryResult,
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  useGetQuestionnairesQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import { Problem, QuestionnaireCard, Skeleton } from '@/ui'
import { createSkeletonArr } from '@/utils/create-skeleton-arr'
import { getQuestionnaireOrganizationLabelId } from '@/utils/questionnaire-utils'

type Item = NonNullable<
  NonNullable<
    NonNullable<GetQuestionnairesQueryResult['data']>['questionnairesList']
  >['questionnaires']
>[number]

export default function QuestionnairesScreen() {
  const router = useRouter()

  const theme = useTheme()
  const intl = useIntl()
  const locale = useLocale()

  const { data, loading, error, refetch, networkStatus } =
    useGetQuestionnairesQuery({
      variables: {
        locale,
      },
    })

  const isInitialLoading = loading && !data
  const [refetching, setRefetching] = useState(false)
  const [showExpired, setShowExpired] = useState(false)
  const [showContext, setShowContext] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefetching(true)
    try {
      await refetch()
    } finally {
      setRefetching(false)
    }
  }, [refetch])

  const openDetail = useCallback(
    (
      id: string,
      organization?: QuestionnaireQuestionnairesOrganizationEnum,
      title?: string,
    ) => {
      router.navigate({
        pathname: '/health/questionnaires/[id]',
        params: { id, organization, title },
      })
    },
    [router],
  )

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const open = () =>
        openDetail(item.id, item.organization ?? undefined, item.title)
      return (
        <QuestionnaireCard
          key={item.id}
          title={item.title}
          organization={
            item.senderGroupName ||
            intl.formatMessage({
              id: getQuestionnaireOrganizationLabelId(item.organization),
            })
          }
          date={new Date(item.sentDate)}
          status={
            item.status ?? QuestionnaireQuestionnairesStatusEnum.NotAnswered
          }
          onPress={open}
          style={{
            marginBottom: theme.spacing[2],
          }}
        />
      )
    },
    [intl, openDetail],
  )

  const questionnaires = useMemo(() => {
    const seen = new Set<string>()
    const result: Item[] = []
    for (const item of data?.questionnairesList?.questionnaires ?? []) {
      if (!item?.id || seen.has(item.id)) continue
      if (
        !showExpired &&
        item.status === QuestionnaireQuestionnairesStatusEnum.Expired
      ) {
        continue
      }
      seen.add(item.id)
      result.push(item)
    }
    return result
  }, [data, showExpired])

  return (
    <>
      <StackScreen
        networkStatus={networkStatus}
        options={{
          headerRightItems: isInitialLoading
            ? []
            : [
                {
                  type: 'custom',
                  element: (
                    <ContextMenu
                      trigger="tap"
                      android={{ visible: showContext }}
                      actions={[
                        {
                          id: 'toggle-expired',
                          title: intl.formatMessage({
                            id: showExpired
                              ? 'health.questionnaires.action.hide-expired'
                              : 'health.questionnaires.action.show-expired',
                          }),
                        },
                      ]}
                      onPressAction={(id) => {
                        if (id === 'toggle-expired') {
                          setShowExpired((v) => !v)
                        }
                      }}
                      onMenuClose={() => setShowContext(false)}
                    >
                      <Pressable onPress={() => setShowContext(true)}>
                        <Image
                          source={require('@/assets/icons/Ellipsis-vertical.png')}
                          width={24}
                          height={24}
                          tintColor={theme.color.blue400}
                        />
                      </Pressable>
                    </ContextMenu>
                  ),
                },
              ],
        }}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{
          paddingHorizontal: theme.spacing[2],
          flex: 1,
        }}
        initialNumToRender={6}
        data={questionnaires}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <>
            {!loading && error && questionnaires.length === 0 ? (
              <Problem error={error} withContainer />
            ) : null}

            {!loading && !error && questionnaires.length === 0 ? (
              <Problem type="no_data" withContainer />
            ) : null}
            {isInitialLoading
              ? createSkeletonArr(4).map((item) => (
                  <Skeleton
                    key={item.id}
                    active
                    backgroundColor={{
                      dark: theme.shades.dark.shade300,
                      light: theme.color.blue100,
                    }}
                    overlayColor={{
                      dark: theme.shades.dark.shade200,
                      light: theme.color.blue200,
                    }}
                    overlayOpacity={1}
                    height={140}
                    style={{
                      borderRadius: 8,
                      marginBottom: theme.spacing[2],
                    }}
                  />
                ))
              : null}
          </>
        }
      />
    </>
  )
}
