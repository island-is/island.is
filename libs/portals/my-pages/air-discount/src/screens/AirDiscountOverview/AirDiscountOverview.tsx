import { useEffect, useRef, useState } from 'react'
import copyToClipboard from 'copy-to-clipboard'

import {
  ActionCard,
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDateWithTime,
  IntroWrapper,
  m as coreMessage,
  VEGAGERDIN_SLUG,
} from '@island.is/portals/my-pages/core'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import { Problem } from '@island.is/react-spa/shared'

import UsageTable from '../../components/UsageTable/UsageTable'
import { messages as m } from '../../lib/messages'
import {
  AirDiscountQuery,
  useAirDiscountFlightLegsQuery,
  useAirDiscountQuery,
} from './AirDiscountOverview.generated'

type CopiedCode = {
  code: string
  copied: boolean
}

export const AirDiscountOverview = () => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  useEffect(() => {
    const isFlagEnabled = async () => {
      const isPageDisabled = await featureFlagClient.getValue(
        'isPortalAirDiscountPageDisabled',
        false,
      )
      if (isPageDisabled) {
        setIsDisabled(isPageDisabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, loading, error } = useAirDiscountQuery()
  const { data: flightLegData } = useAirDiscountFlightLegsQuery()

  const [copiedCodes, setCopiedCodes] = useState<CopiedCode[]>([])
  const copyTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const airDiscounts = data?.airDiscountSchemeDiscounts
  const flightLegs = flightLegData?.airDiscountSchemeUserAndRelationsFlights
  const connectionCodes = airDiscounts?.filter(
    (x) => x.connectionDiscountCodes.length > 0,
  )

  const hasNoRights = (
    item: AirDiscountQuery['airDiscountSchemeDiscounts'][number],
  ) =>
    !item.user.fund ||
    (item.user.fund.credit === 0 && item.user.fund.used === 0)

  const noRights =
    !!airDiscounts && airDiscounts.length > 0 && airDiscounts.every(hasNoRights)

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link: (str: any) => (
            <a
              href={formatMessage(m.noFundingMoreInfoLink)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="text" as="span" unfocusable>
                {str}
              </Button>
            </a>
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                link: (str: any) => (
                  <a
                    href="https://island.is/loftbru/notendaskilmalar-vegagerdarinnar-fyrir-loftbru"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="text" as="span" unfocusable>
                      {str}
                    </Button>
                  </a>
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

      {loading && !error && <CardLoader />}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && noRights && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noRights)}
          message={formatMessage(m.noRightsText)}
          imgSrc="./assets/images/coffee.svg"
        />
      )}
      {data && !noRights && (
        <Box marginBottom={5}>
          <Text paddingBottom={3} fontWeight="medium">
            {formatMessage(m.myRights)}
          </Text>
          <Stack space={2}>
            {airDiscounts
              ?.filter((x) => !hasNoRights(x))
              .map((item, index) => {
                const message = [
                  formatMessage(m.remainingAirfares),
                  item.user.fund?.credit,
                  formatMessage(m.of),
                  item.user.fund?.total,
                ]
                  .filter((x) => x !== null)
                  .join(' ')
                const isCopied = copiedCodes.find(
                  (x) => x.code === item.discountCode,
                )?.copied
                return (
                  <ActionCard
                    key={`loftbru-item-${index}`}
                    heading={item.user.name}
                    text={message}
                    subText={
                      item.user.fund?.credit === 0
                        ? undefined
                        : item.discountCode
                        ? item.discountCode
                        : formatMessage(m.codeGenFailed)
                    }
                    cta={
                      item.user.fund?.credit === 0 || !item.discountCode
                        ? undefined
                        : {
                            label: formatMessage(m.copyCode),
                            ariaLabel: formatMessage(m.copyCodeFor, {
                              name: item.user.name,
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
      {connectionCodes && connectionCodes?.length > 0 && (
        <Box marginBottom={5}>
          <Text paddingBottom={3} fontWeight="medium">
            {formatMessage(m.activeConnectionCodes)}
          </Text>
          <Stack space={2}>
            {connectionCodes?.map((item, itemIndex) => {
              return item.connectionDiscountCodes.map((code, codeIndex) => {
                const isCopied = copiedCodes.find((x) => x.code === code.code)
                  ?.copied
                return (
                  <ActionCard
                    key={`loftbru-item-connection-code-${itemIndex}-${codeIndex}`}
                    heading={item.user.name}
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
                        name: item.user.name,
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
      {!loading && !error && airDiscounts?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {flightLegs && flightLegs.length > 0 && (
        <Box marginBottom={5}>
          <Text paddingBottom={3} fontWeight="medium">
            {formatMessage(m.airfaresUsage)}
          </Text>
          <UsageTable data={flightLegs} />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default AirDiscountOverview
