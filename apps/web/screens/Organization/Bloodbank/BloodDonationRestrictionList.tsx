import { type ReactNode, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  FocusableBox,
  GridContainer,
  Inline,
  Input,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  FilterTag,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  OrganizationPage,
  Query,
  QueryGetBloodDonationRestrictionGenericTagsArgs,
  QueryGetBloodDonationRestrictionsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import {
  GET_BLOOD_DONATION_RESTRICTION_GENERIC_TAGS_QUERY,
  GET_BLOOD_DONATION_RESTRICTIONS_QUERY,
} from '../../queries/BloodDonationRestrictions'
import { getSubpageNavList } from '../SubPage'
import { m } from './messages.strings'

const ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME_IN_MS = 300

// Utility function to wrap matches in <mark>
const highlightMatch = (text: string, query: string): ReactNode => {
  if (!query) return text

  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part,
  )
}

interface BloodDonationRestrictionListProps {
  totalItems: number
  currentPage: number
  items: Query['getBloodDonationRestrictions']['items']
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  tags: { key: string; label: string }[]
}

const BloodDonationRestrictionList: CustomScreen<
  BloodDonationRestrictionListProps
> = ({
  totalItems,
  items,
  organizationPage,
  namespace,
  tags,
  customPageData,
}) => {
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const [queryString, setQueryString] = useQueryState(
    'q',
    parseAsString
      .withOptions({ shallow: true, clearOnDefault: true })
      .withDefault(''),
  )
  const [tagKeys, setTagKeys] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString).withOptions({
      shallow: true,
      clearOnDefault: true,
    }),
  )
  const [currentPage, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: true,
        clearOnDefault: true,
        scroll: true,
        history: 'push',
      })
      .withDefault(1),
  )
  const { activeLocale } = useI18n()
  const initialRender = useRef(true)
  const queryVariablesRef = useRef({
    queryString,
    tagKeys,
    page: currentPage,
    lang: activeLocale,
  })

  useLocalLinkTypeResolver()

  const trimmedQueryString = queryString.trim()

  const [data, setData] = useState({
    totalItems,
    items,
  })

  const [fetchRestrictions, { loading, error }] = useLazyQuery<
    Query,
    QueryGetBloodDonationRestrictionsArgs
  >(GET_BLOOD_DONATION_RESTRICTIONS_QUERY, {
    onCompleted(data) {
      const input = { ...data.getBloodDonationRestrictions.input }
      delete input['__typename']
      if (!isEqual(input, queryVariablesRef.current)) {
        return
      }
      setData({
        totalItems: data.getBloodDonationRestrictions.total,
        items: data.getBloodDonationRestrictions.items,
      })
    },
  })

  useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false
        return
      }
      fetchRestrictions({
        variables: {
          input: {
            lang: activeLocale,
            page: currentPage,
            queryString,
            tagKeys,
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [queryString, tagKeys, currentPage],
  )

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        items: getSubpageNavList(organizationPage, router),
        title: n('navigationTitle', 'Efnisyfirlit'),
      }}
      pageTitle={formatMessage(m.listPage.mainHeading)}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
      ]}
    >
      <Box paddingBottom={3} className="rs_read">
        <GridContainer>
          <Stack space={5}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.listPage.mainHeading)}
              </Text>
              <Webreader marginTop={0} marginBottom={0} readClass="rs_read" />
            </Stack>

            {typeof customPageData?.content?.length === 'number' &&
              customPageData.content.length > 0 && (
                <Box>{webRichText(customPageData.content)}</Box>
              )}

            <Stack space={3}>
              <Input
                name="restriction-search-input"
                icon={{
                  name: 'search',
                }}
                size="sm"
                placeholder={formatMessage(m.listPage.searchInputPlaceholder)}
                value={queryString}
                onChange={(ev) => {
                  setQueryString(ev.target.value)

                  // Make sure we don't create a new history entry when the user is already on page 1
                  if (currentPage !== 1) {
                    setPage(null)
                  }

                  queryVariablesRef.current.queryString = ev.target.value
                  queryVariablesRef.current.page = 1
                }}
                loading={loading}
              />

              {tags.length > 0 && (
                <>
                  <Box>
                    <Inline space={1} alignY="top">
                      {!!tagKeys && tagKeys.length > 0 && (
                        <Text>
                          {activeLocale === 'is'
                            ? 'Síað eftir:'
                            : 'Filtered by:'}
                        </Text>
                      )}
                      <Inline space={1}>
                        {tagKeys?.map((value) => (
                          <FilterTag
                            key={value}
                            active={true}
                            onClick={() => {
                              setPage(null)
                              queryVariablesRef.current.page = 1
                              setTagKeys((prev) => {
                                let updatedTagKeys:
                                  | string[]
                                  | undefined
                                  | null = prev?.filter((tag) => tag !== value)
                                if (!updatedTagKeys?.length) {
                                  updatedTagKeys = null
                                }
                                queryVariablesRef.current.tagKeys =
                                  updatedTagKeys
                                return updatedTagKeys
                              })
                            }}
                          >
                            {tags.find((tag) => tag.key === value)?.label}
                          </FilterTag>
                        ))}
                      </Inline>
                    </Inline>
                  </Box>
                  <Inline space={1} alignY="center">
                    {tags
                      .filter((tag) => !tagKeys?.includes(tag.key))
                      .map((tag) => (
                        <Tag
                          key={tag.key}
                          active={false}
                          onClick={() => {
                            setPage(null)
                            queryVariablesRef.current.page = 1
                            setTagKeys((prev) => {
                              const updatedTagKeys = [...(prev || []), tag.key]
                              queryVariablesRef.current.tagKeys = updatedTagKeys
                              return updatedTagKeys
                            })
                          }}
                        >
                          {tag.label}
                        </Tag>
                      ))}
                  </Inline>
                </>
              )}
            </Stack>

            {!!error && (
              <AlertMessage
                type="error"
                title={formatMessage(m.listPage.errorTitle)}
                message={formatMessage(m.listPage.errorDescription)}
              />
            )}

            <Stack space={4}>
              {data.items.map((item) => (
                <FocusableBox
                  key={item.id}
                  href={`${
                    new URL(router.asPath, 'https://island.is').pathname
                  }/${item.id}`}
                  borderRadius="standard"
                  borderColor="blue200"
                  borderWidth="standard"
                  paddingX={3}
                  paddingY={2}
                  width="full"
                  display="flex"
                  flexDirection="column"
                  rowGap={2}
                  columnGap={2}
                >
                  <Text variant="h4" color="blue400">
                    {item.title}
                  </Text>
                  {Boolean(item.description) && (
                    <Text variant="medium">
                      {highlightMatch(item.description, trimmedQueryString)}
                    </Text>
                  )}
                  {item.hasCardText && (
                    <Box
                      background="dark100"
                      paddingX={3}
                      paddingY={2}
                      borderRadius="standard"
                      width="full"
                    >
                      <Text variant="h5">
                        {formatMessage(m.listPage.cardSubheading)}
                      </Text>
                      <Text as="div">{webRichText(item.cardText)}</Text>
                      {item.hasDetailedText && (
                        <Button
                          size="small"
                          variant="text"
                          icon="arrowForward"
                          unfocusable={true}
                          as="span"
                        >
                          {formatMessage(m.listPage.arrowLinkLabel)}
                        </Button>
                      )}
                    </Box>
                  )}
                  {Boolean(item.keywordsText) && (
                    <Text variant="small">
                      {formatMessage(m.listPage.keywordsTextPrefix)}
                      {highlightMatch(item.keywordsText, trimmedQueryString)}
                    </Text>
                  )}
                  {item.effectiveDate && (
                    <Text variant="small">
                      {formatMessage(m.listPage.effectiveDatePrefix)}
                      {format(new Date(item.effectiveDate), 'd. MMMM yyyy')}
                    </Text>
                  )}
                </FocusableBox>
              ))}
            </Stack>
            {data.totalItems > ITEMS_PER_PAGE && (
              <Pagination
                variant="blue"
                page={currentPage}
                totalItems={data.totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      queryVariablesRef.current.page = page
                      setPage(page)
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            )}
          </Stack>
        </GridContainer>
      </Box>
    </OrganizationWrapper>
  )
}

BloodDonationRestrictionList.getProps = async ({
  query,
  apolloClient,
  customPageData,
  locale,
}) => {
  let page = parseAsInteger.parseServerSide(query.page) ?? 1
  if (page < 1) {
    page = 1
  }

  const queryString = parseAsString.parseServerSide(query.q)
  const tagKeys = parseAsArrayOf(parseAsString).parseServerSide(query.tags)

  if (!customPageData?.configJson?.showListPage) {
    throw new CustomNextError(
      404,
      'Blood donation restriction list page has been turned off in the CMS',
    )
  }

  const organizationPageSlug =
    locale === 'is' ? 'blodbankinn' : 'icelandic-blood-bank'

  const [
    bloodDonationRestrictionResponse,
    bloodDonationRestrictionGenericTagsResponse,
    organizationPageResponse,
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetBloodDonationRestrictionsArgs>({
      query: GET_BLOOD_DONATION_RESTRICTIONS_QUERY,
      variables: {
        input: {
          page,
          lang: locale,
          queryString,
          tagKeys,
        },
      },
    }),
    apolloClient.query<Query, QueryGetBloodDonationRestrictionGenericTagsArgs>({
      query: GET_BLOOD_DONATION_RESTRICTION_GENERIC_TAGS_QUERY,
      variables: {
        input: {
          lang: locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationPageSlug,
          lang: locale,
          subpageSlugs: [
            locale === 'is' ? 'ahrif-a-blodgjof' : 'affecting-factors',
          ],
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!organizationPageResponse.data.getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: "${organizationPageSlug}" was not found`,
    )
  }

  return {
    totalItems:
      bloodDonationRestrictionResponse.data.getBloodDonationRestrictions.total,
    currentPage: page,
    items:
      bloodDonationRestrictionResponse.data.getBloodDonationRestrictions.items,
    organizationPage: organizationPageResponse.data.getOrganizationPage,
    namespace,
    tags: bloodDonationRestrictionGenericTagsResponse.data
      .getBloodDonationRestrictionGenericTags.items,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.BloodDonationRestrictions,
    BloodDonationRestrictionList,
  ),
  {
    footerVersion: 'organization',
  },
)
