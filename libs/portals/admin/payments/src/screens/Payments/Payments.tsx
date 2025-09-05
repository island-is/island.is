import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { useQuery } from '@apollo/client'

import { useLocale } from '@island.is/localization'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import {
  AsyncSearchInput,
  Box,
  Stack,
  toast,
  ActionCard,
  SkeletonLoader,
  AlertMessage,
  LoadingDots,
} from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'
import { PaymentsPaths } from '../../lib/paths'
import * as styles from './Payments.css'
import { getPaymentStatusTag } from '../../utils/paymentStatusTag'
import { Card } from '../../components/Card'
import {
  GetPaymentFlowsDocument,
  GetPaymentFlowsQuery,
} from './Payments.generated'

const PAGE_SIZE = 10

type PaymentFlow = NonNullable<
  GetPaymentFlowsQuery['paymentsGetFlows']
>['data'][0]

const Payments = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams?.get('q')
  const [searchInput, setSearchInput] = useState(() => searchQuery || '')
  const [focused, setFocused] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)

  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { data, loading, error, fetchMore } = useQuery(
    GetPaymentFlowsDocument,
    {
      variables: {
        input: {
          search: searchQuery || '',
          limit: PAGE_SIZE,
        },
      },
      fetchPolicy: 'network-only',
      skip: !searchQuery,
    },
  )

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  useEffect(() => {
    if (error) {
      toast.error(formatMessage(m.errorDefault))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  useEffect(() => {
    if (loading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const { hasNextPage, endCursor } =
          data?.paymentsGetFlows?.pageInfo || {}
        if (entries[0].isIntersecting && hasNextPage && !loadingMore) {
          setLoadingMore(true)
          fetchMore({
            variables: {
              input: {
                search: searchQuery || '',
                limit: PAGE_SIZE,
                after: endCursor,
              },
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev
              return {
                paymentsGetFlows: {
                  ...fetchMoreResult.paymentsGetFlows,
                  data: [
                    ...(prev.paymentsGetFlows?.data ?? []),
                    ...(fetchMoreResult.paymentsGetFlows?.data ?? []),
                  ],
                },
              }
            },
          }).finally(() => {
            setLoadingMore(false)
          })
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    )

    triggerRef.current && observer.observe(triggerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [
    loading,
    data?.paymentsGetFlows?.pageInfo,
    searchQuery,
    loadingMore,
    fetchMore,
  ])

  const handleSearch = () => {
    if (searchInput) {
      setSearchParams(
        (params) => {
          params.set('q', searchInput)
          return params
        },
        { replace: true },
      )
    }
  }

  return (
    <>
      <IntroHeader
        title={formatMessage(m.payment)}
        intro={formatMessage(m.paymentsDescription)}
      />
      <Box display={['inline', 'inline', 'flex']} className={styles.search}>
        <AsyncSearchInput
          hasFocus={focused}
          loading={loading}
          inputProps={{
            name: 'searchQuery',
            value: searchInput,
            inputSize: 'medium',
            onChange: (event) => setSearchInput(event.target.value),
            onBlur,
            onFocus,
            placeholder: formatMessage(m.searchBy),
            colored: true,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch()
              }
            },
          }}
          buttonProps={{
            type: 'button',
            disabled: !searchInput,
            onClick: handleSearch,
          }}
        />
      </Box>
      <Box marginTop={4}>
        <Box className={styles.relative}>
          {loading && !data?.paymentsGetFlows?.data ? (
            <Stack space={3}>
              <SkeletonLoader
                height={80}
                repeat={3}
                space={2}
                borderRadius="large"
              />
            </Stack>
          ) : error ? (
            <AlertMessage
              title={formatMessage(m.errorDefault)}
              message={formatMessage(m.errorDefault)}
              type="error"
            />
          ) : searchQuery && !data?.paymentsGetFlows?.data?.length ? (
            <Card
              title={
                kennitala.isValid(searchQuery)
                  ? formatNationalId(searchQuery)
                  : searchQuery
              }
              description={formatMessage(m.noContent)}
              bgGrey
            />
          ) : (
            <Stack space={3}>
              {data?.paymentsGetFlows?.data?.map((payment: PaymentFlow) => (
                <Box key={`payment-${payment.id}`}>
                  <ActionCard
                    heading={payment.productTitle}
                    text={formatMessage(m.payer, {
                      name: payment.payerName,
                      nationalId: formatNationalId(payment.payerNationalId),
                    })}
                    eyebrow={format(
                      new Date(payment.updatedAt),
                      "d. MMM yyyy 'kl.' HH:mm",
                    )}
                    tag={{
                      label: getPaymentStatusTag(
                        payment.paymentStatus,
                        formatMessage,
                      ).message,
                      variant: getPaymentStatusTag(
                        payment.paymentStatus,
                        formatMessage,
                      ).variant,
                      outlined: false,
                    }}
                    cta={{
                      label: formatMessage(m.viewDetails),
                      variant: 'text',
                      icon: 'arrowForward',
                      onClick: () =>
                        navigate(
                          replaceParams({
                            href: PaymentsPaths.Payment,
                            params: {
                              paymentId: payment.id,
                            },
                          }),
                        ),
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
          {(loading && data?.paymentsGetFlows?.data) || loadingMore ? (
            <Box display="flex" justifyContent="center" marginTop={4}>
              <LoadingDots />
            </Box>
          ) : null}
          <div ref={triggerRef} />
        </Box>
      </Box>
    </>
  )
}

export default Payments
