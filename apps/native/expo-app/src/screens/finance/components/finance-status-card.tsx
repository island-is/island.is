import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, Linking, Pressable, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  Skeleton,
  Typography,
  blue400,
  dynamicColor,
  ExpandableCard,
} from '../../../ui'
import chevronDown from '../../../assets/icons/chevron-down.png'
import {
  ChargeType,
  GetFinanceStatusDetails,
  Organization,
} from '../../../graphql/types/finance.types'
import { useGetFinanceStatusDetailsQuery } from '../../../graphql/types/schema'
import { useRouter } from 'expo-router'
import { showPicker } from '../../../lib/show-picker'
import { SelectButton } from './select-button'
import { useBrowser } from '../../../lib/use-browser'

const Row = styled.View<{ border?: boolean }>`
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: ${({ border }) => (border ? 1 : 0)}px;
`

const Cell = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const AboutItem = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  min-width: 50%;
  flex: 1;
`

const TouchableRow = styled.TouchableHighlight`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`

const AboutBox = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  margin-top: 0px;
`

const RowItem = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;
`

const TableHeading = styled.View`
  flex-direction: row;
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`

const Total = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

export function FinanceStatusCard({
  chargeType,
  org,
}: {
  chargeType: ChargeType
  org: Organization
}) {
  const intl = useIntl()
  const theme = useTheme()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { openBrowser } = useBrowser()
  const res = useGetFinanceStatusDetailsQuery({
    variables: {
      input: {
        orgID: org.id,
        chargeTypeID: chargeType.id,
      },
    },
    skip: !open,
  })
  const financeStatusDetails: GetFinanceStatusDetails | undefined =
    res.data?.getFinanceStatusDetails

  const chargeItemSubjects = [
    ...new Set(
      (financeStatusDetails?.chargeItemSubjects ?? []).map(
        (i) => i.chargeItemSubject,
      ),
    ),
  ]
  const [selectedChargeItemSubject, setSelectedChargeItemSubject] = useState(0)

  const shouldShowAboutOrgBox =
    org.homepage || org.email || org.phone || org.name

  return (
    <ExpandableCard
      title={chargeType.name}
      icon={chevronDown}
      message={
        <FormattedMessage
          id="finance.statusCard.status"
          defaultMessage="Staða"
        />
      }
      value={`${intl.formatNumber(chargeType.totals)} kr.`}
      onPress={() => {
        setOpen((p) => !p)
      }}
      open={open}
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        <Typography
          variant="eyebrow"
          style={{ color: blue400, marginBottom: theme.spacing[1] }}
        >
          <FormattedMessage
            id="finance.statusCard.paymentBase"
            defaultMessage="Gjaldgrunnur"
          />
        </Typography>
        <SelectButton
          title={
            res.loading
              ? intl.formatMessage({
                  id: 'settings.about.codePushLoading',
                  defaultMessage: 'Hleð...',
                })
              : chargeItemSubjects[selectedChargeItemSubject]
          }
          icon={chevronDown}
          textStyle={{ flex: 1 }}
          onPress={() => {
            showPicker({
              title: intl.formatMessage({
                id: 'finance.statusCard.paymentBase',
                defaultMessage: 'Gjaldgrunnur',
              }),
              items: chargeItemSubjects.map((label, value) => ({
                label,
                value,
                id: String(value),
              })),
              selectedId: String(selectedChargeItemSubject),
              cancel: true,
            }).then((value) => {
              if (value.selectedItem) {
                setSelectedChargeItemSubject(Number(value.selectedItem.id))
              }
            })
            // void
          }}
        />
        <Row style={{ marginTop: 12 }}>
          <TableHeading>
            <Cell style={{ flex: 1 }}>
              <Typography variant="eyebrow">
                <FormattedMessage
                  id="finance.statusCard.deadline"
                  defaultMessage="Eindagi"
                />
              </Typography>
            </Cell>
            <Cell style={{ flex: 1 }}>
              <Typography variant="eyebrow" style={{ textAlign: 'right' }}>
                <FormattedMessage
                  id="finance.statusCard.amount"
                  defaultMessage="Upphæð"
                />
              </Typography>
            </Cell>
          </TableHeading>
        </Row>
        {res.loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Row key={index}>
                <Cell style={{ flex: 1 }}>
                  <Skeleton height={18} />
                </Cell>
              </Row>
            ))
          : financeStatusDetails?.chargeItemSubjects?.map((charge, index) => {
              if (
                charge.chargeItemSubject !==
                chargeItemSubjects[selectedChargeItemSubject]
              ) {
                return null
              }
              return (
                <TouchableRow
                  key={index}
                  underlayColor="rgba(128,128,128,0.1)"
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? theme.color.blue100 : theme.color.white,
                  }}
                  onPress={() => {
                    router.push({
                      pathname: '/(auth)/(tabs)/more/finance/status/[orgId]/[chargeTypeId]',
                      params: {
                        orgId: org.id,
                        chargeTypeId: chargeType.id,
                        index: String(index),
                      },
                    })
                  }}
                >
                  <>
                    <RowItem>
                      <Typography variant="body3">
                        {charge.finalDueDate}
                      </Typography>
                    </RowItem>
                    <RowItem>
                      <Typography
                        variant="body3"
                        style={{ textAlign: 'right' }}
                      >
                        {intl.formatNumber(charge.totals)} kr.
                      </Typography>
                    </RowItem>
                    <Image
                      source={chevronDown}
                      style={{
                        tintColor: theme.color.dark300,
                        transform: [{ rotate: '-90deg' }],
                      }}
                    />
                  </>
                </TouchableRow>
              )
            })}
        <Row>
          <Cell style={{ flex: 1, alignItems: 'flex-end' }}>
            <Total variant="eyebrow">
              <FormattedMessage
                id="finance.statusCard.total"
                defaultMessage="Samtals"
              />
            </Total>
            {res.loading ? (
              <Skeleton height={18} />
            ) : (
              <Typography variant="body3">
                {intl.formatNumber(chargeType.totals)} kr.
              </Typography>
            )}
          </Cell>
        </Row>
      </View>
      {shouldShowAboutOrgBox && !res.loading && (
        <AboutBox>
          <Typography variant="eyebrow">
            <FormattedMessage
              id="finance.statusCard.organization"
              defaultMessage="Þjónustuaðili"
            />
          </Typography>
          {res.loading ? (
            <>
              <Skeleton height={18} style={{ marginTop: theme.spacing[1] }} />
              <Skeleton height={18} style={{ marginTop: theme.spacing[1] }} />
            </>
          ) : (
            <Typography
              variant="body3"
              style={{ paddingTop: theme.spacing.smallGutter }}
            >
              {org.name}
            </Typography>
          )}
          <Row>
            {org.homepage ? (
              <AboutItem style={{ flexWrap: 'nowrap' }}>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="finance.statusCard.organizationWebsite"
                    defaultMessage="Vefur"
                  />
                  :
                </Typography>
                <Pressable
                  onPress={() =>
                    openBrowser(
                      `https://${org.homepage.replace(/https?:\/\//, '')}`,
                    )
                  }
                >
                  <Typography
                    variant="eyebrow"
                    style={{
                      paddingTop: theme.spacing.smallGutter,
                      color: blue400,
                    }}
                  >
                    {org.homepage}
                  </Typography>
                </Pressable>
              </AboutItem>
            ) : null}
            {org.email ? (
              <AboutItem>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="finance.statusCard.organizationEmail"
                    defaultMessage="Netfang"
                  />
                  :
                </Typography>
                <Pressable
                  onPress={() => Linking.openURL(`mailto:${org.email}`)}
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Typography
                    variant="eyebrow"
                    style={{
                      paddingTop: theme.spacing.smallGutter,
                      color: blue400,
                    }}
                  >
                    {org.email}
                  </Typography>
                </Pressable>
              </AboutItem>
            ) : null}
            {org.phone ? (
              <AboutItem>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="finance.statusCard.organizationPhone"
                    defaultMessage="Sími"
                  />
                  :
                </Typography>
                <Pressable
                  onPress={() => Linking.openURL(`tel:${org.phone}`)}
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Typography
                    variant="eyebrow"
                    style={{
                      paddingTop: theme.spacing.smallGutter,
                      color: blue400,
                    }}
                  >
                    {org.phone}
                  </Typography>
                </Pressable>
              </AboutItem>
            ) : null}
          </Row>
        </AboutBox>
      )}
    </ExpandableCard>
  )
}
