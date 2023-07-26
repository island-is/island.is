import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserInfo } from '@island.is/auth/react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import {
  formatNationalId,
  NotFound,
  UserInfoLine,
  m,
  IntroHeader,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import ChildRegistrationModal from './ChildRegistrationModal'
import * as styles from './Child.css'
import { TwoColumnUserInfoLine } from '../../components/TwoColumnUserInfoLine/TwoColumnUserInfoLine'
import { formatNameBreaks } from '../../helpers/formatting'
import { spmm } from '../../lib/messages'
import { useNationalRegistryChildrenQuery } from './Child.generated'

type UseParams = {
  nationalId: string
}

const Child = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const [showTooltip, setShowTooltip] = useState(false)
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const userInfo = useUserInfo()
  const { nationalId } = useParams() as UseParams

  const { data, loading, error } = useNationalRegistryChildrenQuery({
    variables: {
      input: 'v3',
    },
  })

  const dataNotFoundMessage = defineMessage({
    id: 'sp.family:data-not-found',
    defaultMessage: 'Gögn fundust ekki',
  })

  const editLink = defineMessage({
    id: 'sp.family:edit-link',
    defaultMessage: 'Breyta hjá Þjóðskrá',
  })

  const child =
    data?.nationalRegistryPerson?.children?.find(
      (x) => x.nationalId === nationalId,
    ) || null

  const parent1 = child?.birthParents ? child.birthParents[0] : undefined
  const parent2 = child?.birthParents ? child.birthParents[1] : undefined

  const custodian1 = data?.nationalRegistryPerson
  const custodian2 = child?.otherParent

  const isChild = nationalId === userInfo.profile.nationalId

  /* Should show name breakdown tooltip? */
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalNameBreakdownEnabled`,
        false,
      )
      if (ffEnabled) {
        setShowTooltip(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
  }, [])

  if (!nationalId || error || (!loading && !child))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <Box className={styles.pageWrapper}>
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
            title={child?.fullName ?? ''}
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
                {!loading && !isChild && (
                  <>
                    <ChildRegistrationModal
                      data={{
                        parentName:
                          data?.nationalRegistryPerson?.fullName || '',
                        parentNationalId: userInfo.profile.nationalId || '',
                        childName: child?.fullName || '',
                        childNationalId: nationalId,
                      }}
                    />

                    <Button
                      variant="utility"
                      size="small"
                      onClick={() => window.print()}
                      icon="print"
                      iconType="filled"
                    >
                      {formatMessage(m.print)}
                    </Button>
                  </>
                )}
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={6}>
        <Stack component="ul" space={2}>
          <UserInfoLine
            title={formatMessage(m.myRegistration)}
            label={formatMessage(m.fullName)}
            translate="no"
            content={child?.fullName || '...'}
            tooltip={
              showTooltip
                ? formatNameBreaks(child?.name ?? undefined, {
                    givenName: formatMessage(spmm.givenName),
                    middleName: formatMessage(spmm.middleName),
                    lastName: formatMessage(spmm.lastName),
                  })
                : undefined
            }
            loading={loading}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    skipOutboundTrack: true,
                    url:
                      'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                  }
                : undefined
            }
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.natreg)}
            content={formatNationalId(nationalId)}
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={defineMessage(m.legalResidence)}
            content={child?.address?.streetName || ''}
            loading={loading}
            className={styles.printable}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    skipOutboundTrack: true,
                    url: 'https://skra.is/folk/flutningur/flutningur-barna/',
                  }
                : undefined
            }
          />
          <Box printHidden>
            <Divider />
          </Box>
        </Stack>
        <Stack component="ul" space={2}>
          <UserInfoLine
            title={formatMessage(m.baseInfo)}
            label={formatMessage({
              id: 'sp.family:birthplace',
              defaultMessage: 'Fæðingarstaður',
            })}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : child?.birthplace?.location || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.religion)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : child?.religion?.name || ''
            }
            loading={loading}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    skipOutboundTrack: true,
                    url:
                      'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                  }
                : undefined
            }
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.gender)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : child?.genderText || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.citizenship)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : child?.citizenship?.name || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          {child?.fate && (
            <>
              <UserInfoLine
                label={formatMessage({
                  id: 'sp.family:fate',
                  defaultMessage: 'Afdrif',
                })}
                content={
                  error ? formatMessage(dataNotFoundMessage) : child?.fate || ''
                }
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
            </>
          )}
        </Stack>
        {(parent1 || parent2 || loading) && (
          <Stack component="ul" space={2}>
            <TwoColumnUserInfoLine
              title={formatMessage({
                id: 'sp.family:parents',
                defaultMessage: 'Foreldrar',
              })}
              label={formatMessage(m.name)}
              firstValue={parent1?.fullName}
              secondValue={parent2?.fullName}
              loading={loading}
              className={styles.printable}
            />
            <Box printHidden>
              <Divider />
            </Box>
            <TwoColumnUserInfoLine
              label={formatMessage(m.natreg)}
              firstValue={parent1 ? formatNationalId(parent1.nationalId) : ''}
              secondValue={parent2 ? formatNationalId(parent2.nationalId) : ''}
              loading={loading}
              className={styles.printable}
            />
            <Box printHidden>
              <Divider />
            </Box>
          </Stack>
        )}
        {!child?.fate && !error && (
          <Stack component="ul" space={2}>
            <TwoColumnUserInfoLine
              title={formatMessage({
                id: 'sp.family:custody-parents',
                defaultMessage: 'Forsjáraðilar',
              })}
              label={formatMessage({
                id: 'sp.family:name',
                defaultMessage: 'Nafn',
              })}
              firstValue={custodian1?.fullName}
              secondValue={custodian2?.fullName}
              loading={loading}
              className={styles.printable}
            />
            <Box printHidden>
              <Divider />
            </Box>
            <TwoColumnUserInfoLine
              label={formatMessage(m.natreg)}
              firstValue={
                custodian1 ? formatNationalId(custodian1.nationalId) : ''
              }
              secondValue={
                custodian2 ? formatNationalId(custodian2.nationalId) : ''
              }
              loading={loading}
              className={styles.printable}
            />
            <Box printHidden>
              <Divider />
            </Box>
            <TwoColumnUserInfoLine
              label={formatMessage({
                id: 'sp.family:custody-status',
                defaultMessage: 'Staða forsjár',
              })}
              firstValue={custodian1.}
              secondValue={custodian2?.custodyText}
              loading={loading}
              className={styles.printable}
            />
            <Box printHidden>
              <Divider />
            </Box>
            {/*!loading &&
              guardianship.residenceParent &&
              guardianship.residenceParent.length > 0 && (
                <>
                  <TwoColumnUserInfoLine
                    label={formatMessage({
                      id: 'sp.family:residence-parent',
                      defaultMessage: 'Búsetuforeldri',
                    })}
                    firstValue={livingArrangment(
                      guardianship?.residenceParent ?? [],
                      person?.parent1 ?? '',
                    )}
                    secondValue={livingArrangment(
                      guardianship?.residenceParent ?? [],
                      person?.parent2 ?? '',
                    )}
                  />
                  <Divider />
                </>
                    )*/}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default Child
