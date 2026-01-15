import { useEffect, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m as coreMessage,
  CardLoader,
  VEGAGERDIN_SLUG,
  formatDateWithTime,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
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
import { messages as m } from '../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'
import UsageTable from '../../components/UsageTable/UsageTable'
import { AirDiscountSchemeDiscount } from '@island.is/portals/my-pages/graphql'
import { Problem } from '@island.is/react-spa/shared'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'

const AirDiscountQuery = gql`
  query AirDiscountQuery {
    airDiscountSchemeDiscounts {
      nationalId
      discountCode
      connectionDiscountCodes {
        code
        flightId
        flightDesc
        validUntil
      }
      expiresIn
      user {
        name
        fund {
          credit
          used
          total
        }
      }
    }
  }
`

const AirDiscountFlightLegsQuery = gql`
  query AirDiscountFlightLegsQuery {
    airDiscountSchemeUserAndRelationsFlights {
      travel
      flight {
        bookingDate
        user {
          name
        }
      }
    }
  }
`

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

  const { data, loading, error } = useQuery<Query>(AirDiscountQuery)
  const { data: flightLegData } = useQuery<Query>(AirDiscountFlightLegsQuery)

  const [copiedCodes, setCopiedCodes] = useState<CopiedCode[]>([])
  const airDiscounts: AirDiscountSchemeDiscount[] | undefined =
    data?.airDiscountSchemeDiscounts
  const flightLegs = flightLegData?.airDiscountSchemeUserAndRelationsFlights
  const connectionCodes: AirDiscountSchemeDiscount[] | undefined =
    airDiscounts?.filter((x) => x.connectionDiscountCodes.length > 0)

  const noRights =
    airDiscounts?.filter(
      (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
    ).length === airDiscounts?.length

  const copy = (code?: string | null) => {
    if (code) {
      copyToClipboard(code)
      const newCode: CopiedCode = { code: code, copied: true }
      setCopiedCodes([...copiedCodes, newCode])
      toast.success(formatMessage(m.codeCopiedSuccess))
      setTimeout(() => {
        const codes = copiedCodes
        const currentCodeIndex = codes.findIndex((item) => item.code === code)
        copiedCodes.slice(currentCodeIndex, 0)
        setCopiedCodes(copiedCodes)
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
              <Button variant="text">{str}</Button>
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
      serviceProviderSlug={VEGAGERDIN_SLUG}
      serviceProviderTooltip={formatMessage(coreMessage.airDiscountTooltip)}
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
                    <Button variant="text">{str}</Button>
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
              ?.filter(
                (x) => !(x.user.fund?.used === 0 && x.user.fund.credit === 0),
              )
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
            {connectionCodes?.map((item) => {
              return item.connectionDiscountCodes.map((code, codeIndex) => {
                const isCopied = copiedCodes.find(
                  (x) => x.code === code.code,
                )?.copied
                return (
                  <ActionCard
                    key={`loftbru-item-connection-code-${codeIndex}`}
                    heading={item.user.name}
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
