import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'

import {
  ActionCard,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  createColumnHelper,
  formatDateWithTime,
  InlineLink,
  IntroWrapper,
  m as coreMessage,
  PortalTable,
  VEGAGERDIN_SLUG,
} from '@island.is/portals/my-pages/core'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

import { messages as m } from '../../lib/messages'
import {
  AirDiscountMembersQuery,
  useAirDiscountMembersQuery,
} from './AirDiscountOverview.generated'

type CopiedCode = {
  code: string
  copied: boolean
}

type Member = AirDiscountMembersQuery['airDiscountSchemeMembers'][number]
type UsageRow = Member['usedFlightLegsThisPeriod'][number] & { name: string }

const columnHelper = createColumnHelper<UsageRow>()

export const AirDiscountOverview = () => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  useEffect(() => {
    const isFlagEnabled = async () => {
      const isPageDisabled = await featureFlagClient.getValue<boolean>(
        'isPortalAirDiscountPageDisabled',
        false,
      )
      if (isPageDisabled) {
        setIsDisabled(isPageDisabled)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, loading, error } = useAirDiscountMembersQuery()
  const members = data?.airDiscountSchemeMembers
  const benefits =
    members
      ?.map(({ name, benefit }) => (benefit ? { name, ...benefit } : null))
      .filter(isDefined) ?? []
  const withConnectionCodes = benefits.filter(
    (benefit) => benefit.connectionDiscountCodes.length > 0,
  )
  const usageRows: UsageRow[] =
    members?.flatMap((member) =>
      member.usedFlightLegsThisPeriod.map((leg) => ({
        ...leg,
        name: member.name,
      })),
    ) ?? []
  const noRights = !!members?.length && benefits.length === 0

  const [copiedCodes, setCopiedCodes] = useState<CopiedCode[]>([])
  const copyTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const usageColumns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'user',
        header: formatMessage(m.user),
        enableSorting: false,
      }),
      columnHelper.accessor('travel', {
        header: formatMessage(m.flight),
        enableSorting: false,
      }),
      columnHelper.accessor('bookingDate', {
        id: 'date',
        header: formatMessage(m.date),
        cell: ({ getValue }) => formatDateWithTime(getValue()),
        enableSorting: false,
      }),
    ],
    [formatMessage],
  )

  useEffect(() => {
    const timers = copyTimers.current
    return () => Object.values(timers).forEach(clearTimeout)
  }, [])

  const copy = (code?: string | null) => {
    if (code) {
      copyToClipboard(code)
      setCopiedCodes((prev) => [
        ...prev.filter((item) => item.code !== code),
        { code, copied: true },
      ])
      toast.success(formatMessage(m.codeCopiedSuccess))
      clearTimeout(copyTimers.current[code])
      copyTimers.current[code] = setTimeout(() => {
        setCopiedCodes((prev) => prev.filter((item) => item.code !== code))
      }, 5000)
    }
  }

  if (isDisabled) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(m.noFundingTitle)}
        message={formatMessage(m.noFunding, {
          link: (str: ReactNode) => (
            <InlineLink to={formatMessage(m.noFundingMoreInfoLink)}>
              {str}
            </InlineLink>
          ),
        })}
        imgSrc="./assets/images/coffee.svg"
      />
    )
  }

  return (
    <IntroWrapper
      title={formatMessage(m.introTitle)}
      desktopContentSpan="10/12"
      serviceProvider={{
        slug: VEGAGERDIN_SLUG,
        tooltip: formatMessage(coreMessage.airDiscountTooltip),
      }}
    >
      <Box marginBottom={[3, 4, 5]}>
        <GridRow>
          <GridColumn span={['8/8', '8/8']} order={1}>
            <Text variant="default" paddingTop={2}>
              {formatMessage(m.introLink, {
                link: (str: ReactNode) => (
                  <InlineLink to={formatMessage(m.termsLink)}>{str}</InlineLink>
                ),
              })}
            </Text>
            <GridColumn
              span={['12/12', '12/12', '7/8']}
              order={3}
              paddingTop={4}
            >
              <BulletList>
                <Bullet>{formatMessage(m.discountTextFirst)}</Bullet>
                <Bullet>{formatMessage(m.discountTextSecond)}</Bullet>
              </BulletList>
            </GridColumn>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && <CardLoader />}
      {!loading && error && <Problem error={error} noBorder={false} />}
      {!loading && !error && members?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!loading && !error && noRights && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noRights)}
          message={formatMessage(m.noRightsText)}
          imgSrc="./assets/images/coffee.svg"
        />
      )}
      {!loading && !error && benefits.length > 0 && (
        <Box marginBottom={5}>
          <Text as="h2" paddingBottom={3} fontWeight="medium">
            {formatMessage(m.myRights)}
          </Text>
          <Stack space={2}>
            {benefits.map((item, index) => {
              const message = [
                formatMessage(m.remainingAirfares),
                item.fund.credit,
                formatMessage(m.of),
                item.fund.total,
              ]
                .filter((x) => x !== null)
                .join(' ')
              const isCopied = copiedCodes.find(
                (x) => x.code === item.discountCode,
              )?.copied
              return (
                <ActionCard
                  key={`loftbru-item-${index}`}
                  heading={item.name}
                  text={message}
                  subText={
                    item.fund.credit === 0
                      ? undefined
                      : item.discountCode
                      ? item.discountCode
                      : formatMessage(m.codeGenFailed)
                  }
                  cta={
                    item.fund.credit === 0 || !item.discountCode
                      ? undefined
                      : {
                          label: formatMessage(m.copyCode),
                          ariaLabel: formatMessage(m.copyCodeFor, {
                            name: item.name,
                          }),
                          onClick: () => copy(item.discountCode),
                          icon: isCopied ? 'checkmark' : 'copy',
                        }
                  }
                />
              )
            })}
          </Stack>
        </Box>
      )}
      {!loading && !error && withConnectionCodes.length > 0 && (
        <Box marginBottom={5}>
          <Text as="h2" paddingBottom={3} fontWeight="medium">
            {formatMessage(m.activeConnectionCodes)}
          </Text>
          <Stack space={2}>
            {withConnectionCodes.map((item, itemIndex) => {
              return item.connectionDiscountCodes.map((code, codeIndex) => {
                const isCopied = copiedCodes.find(
                  (x) => x.code === code.code,
                )?.copied
                return (
                  <ActionCard
                    key={`loftbru-item-connection-code-${itemIndex}-${codeIndex}`}
                    heading={item.name}
                    headingVariant="h4"
                    text={formatMessage(m.flight) + ': ' + code.flightDesc}
                    subText={code.code}
                    tag={{
                      label:
                        formatMessage(m.validTo) +
                        ': ' +
                        formatDateWithTime(code.validUntil),
                    }}
                    cta={{
                      label: formatMessage(m.copyCode),
                      ariaLabel: formatMessage(m.copyConnectionCodeFor, {
                        name: item.name,
                        flight: code.flightDesc,
                      }),
                      onClick: () => copy(code.code),
                      icon: isCopied ? 'checkmark' : 'copy',
                    }}
                  />
                )
              })
            })}
          </Stack>
        </Box>
      )}
      {!loading && !error && usageRows.length > 0 && (
        <Box marginBottom={5}>
          <Text as="h2" paddingBottom={3} fontWeight="medium">
            {formatMessage(m.airfaresUsage)}
          </Text>
          <Box marginBottom={4}>
            <PortalTable
              columns={usageColumns}
              data={usageRows}
              emptyMessage=""
              mobileTitleKey="user"
              srCaption={formatMessage(m.airfaresUsage)}
            />
          </Box>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default AirDiscountOverview
