import { ApolloError } from 'apollo-client'
import React, { FC, useEffect, useState } from 'react'
import { defineMessage } from 'react-intl'

import { NationalRegistryChild } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Inline,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  IntroHeader,
  m,
  NotFound,
  UserInfoLine,
} from '@island.is/service-portal/core'

import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { FeatureFlagClient } from '@island.is/feature-flags'

import { Parents } from '../../components/Parents/Parents'
import ChildRegistrationModal from '../../screens/FamilyMember/ChildRegistrationModal'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const editLink = defineMessage({
  id: 'sp.family:edit-link',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

interface Props {
  nationalId?: string
  userNationalId?: string
  userName?: string
  error?: ApolloError
  person?: NationalRegistryChild | null
  loading?: boolean
  isChild?: boolean
  hasDetails?: boolean
}

const ChildView: FC<Props> = ({
  nationalId,
  error,
  loading,
  person,
  isChild,
  hasDetails,
  userNationalId,
  userName,
}) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const [print, setPrint] = useState(false)

  const onPrint = () => {
    setPrint(true)
    window.print()
    setPrint(false)
  }

  /**
   * The ChildRegistration module is feature flagged
   * Please remove all code when fully released.
   */
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [modalFlagEnabled, setModalFlagEnabled] = useState<boolean>(false)
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `servicePortalChildrenFamilyNotification`,
        false,
      )
      setModalFlagEnabled(ffEnabled as boolean)
    }
    isFlagEnabled()
  }, [])

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )
  return (
    <>
      {loading ? (
        <Box marginBottom={6}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <LoadingDots />
            </GridColumn>
          </GridRow>
        </Box>
      ) : (
        <Box printHidden>
          <IntroHeader
            hideImgPrint
            title={person?.fullName ?? ''}
            intro={{
              id: 'sp.family:data-info-child',
              defaultMessage:
                'Hér fyrir neðan eru gögn um fjölskyldumeðlim. Þú hefur kost á að gera breytingar á eftirfarandi upplýsingum ef þú kýst.',
            }}
          />
        </Box>
      )}
      <Box printHidden>
        <GridRow>
          <GridColumn paddingBottom={4} span="12/12">
            <Box
              display="flex"
              justifyContent="flexStart"
              flexDirection={['column', 'row']}
            >
              <Inline space={2}>
                <Box>
                  {!loading && !isChild && modalFlagEnabled && (
                    <ChildRegistrationModal
                      data={{
                        parentName: userName || '',
                        parentNationalId: userNationalId || '',
                        childName: person?.fullName || '',
                        childNationalId: nationalId,
                      }}
                    />
                  )}
                </Box>
                <Button
                  variant="utility"
                  size="small"
                  onClick={onPrint}
                  icon="print"
                  iconType="filled"
                >
                  {formatMessage(m.print)}
                </Button>
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={print ? 0 : 2} dividers={true}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={formatMessage(m.fullName)}
          content={person?.fullName || '...'}
          loading={loading}
          paddingBottom={'none'}
          paddingY={'none'}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                }
              : undefined
          }
        />
        <UserInfoLine
          label={formatMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <UserInfoLine
          label={defineMessage(m.legalResidence)}
          content={person?.legalResidence || ''}
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url: 'https://skra.is/folk/flutningur/flutningur-barna/',
                }
              : undefined
          }
        />
        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={formatMessage({
            id: 'sp.family:birthplace',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.birthplace || ''
          }
          loading={loading}
        />
        <UserInfoLine
          label={formatMessage(m.religion)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.religion || ''
          }
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                }
              : undefined
          }
        />
        <UserInfoLine
          label={formatMessage(m.gender)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.genderDisplay || ''
          }
          loading={loading}
        />
        <UserInfoLine
          label={formatMessage(m.citizenship)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.nationality || ''
          }
          loading={loading}
        />
        {person?.fate && (
          <UserInfoLine
            label={formatMessage({
              id: 'sp.family:fate',
              defaultMessage: 'Afdrif',
            })}
            content={
              error ? formatMessage(dataNotFoundMessage) : person?.fate || ''
            }
            loading={loading}
          />
        )}
        {(person?.parent1 || person?.parent2 || loading) && (
          <>
            <Parents
              title={formatMessage({
                id: 'sp.family:custody-and-parents',
                defaultMessage: 'Forsjá & foreldrar',
              })}
              label={formatMessage({
                id: 'sp.family:parents',
                defaultMessage: 'Foreldrar',
              })}
              parent1={person?.nameParent1}
              parent2={person?.nameParent2}
              loading={loading}
            />
            <Parents
              label={formatMessage(m.natreg)}
              parent1={person?.parent1 ? formatNationalId(person.parent1) : ''}
              parent2={person?.parent2 ? formatNationalId(person.parent2) : ''}
              loading={loading}
            />
          </>
        )}
        {!person?.fate && !error && hasDetails && (
          <>
            <Parents
              label={formatMessage({
                id: 'sp.family:custody-parents',
                defaultMessage: 'Forsjáraðilar',
              })}
              parent1={person?.nameCustody1}
              parent2={person?.nameCustody2}
              loading={loading}
            />
            <Parents
              label={formatMessage(m.natreg)}
              parent1={
                person?.custody1 ? formatNationalId(person.custody1) : ''
              }
              parent2={
                person?.custody2 ? formatNationalId(person.custody2) : ''
              }
              loading={loading}
            />
            <Parents
              label={formatMessage({
                id: 'sp.family:custody-status',
                defaultMessage: 'Staða forsjár',
              })}
              parent1={person?.custodyText1}
              parent2={person?.custodyText2}
              loading={loading}
            />
          </>
        )}
        {
          //for the final divider
          ' '
        }
      </Stack>
    </>
  )
}
export default ChildView
