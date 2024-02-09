import { useParams } from 'react-router-dom'
import { useUserInfo } from '@island.is/auth/react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  NotFound,
  UserInfoLine,
  m,
  IntroHeader,
  THJODSKRA_SLUG,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  Stack,
} from '@island.is/island-ui/core'
import ChildRegistrationModal from './ChildRegistrationModal'
import { TwoColumnUserInfoLine } from '../../components/TwoColumnUserInfoLine/TwoColumnUserInfoLine'
import { formatNameBreaks } from '../../helpers/formatting'
import { spmm } from '../../lib/messages'
import { useNationalRegistryChildCustodyQuery } from './Child.generated'
import { natRegGenderMessageDescriptorRecord } from '../../helpers/localizationHelpers'
import { unmaskString } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  baseId: string
}

const Child = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const { baseId } = useParams() as UseParams

  const { data, loading, error } = useNationalRegistryChildCustodyQuery({
    variables: {
      api: 'v3',
      childNationalId: unmaskString(baseId, userInfo.profile.nationalId),
    },
  })

  const child = data?.nationalRegistryPerson?.childCustody?.[0]?.details
  const nationalId = child?.nationalId

  const parent1 = child?.birthParents ? child.birthParents[0] : undefined
  const parent2 = child?.birthParents ? child.birthParents[1] : undefined

  const custodian1 = child?.custodians?.[0]
  const custodian2 = child?.custodians?.[1]

  //Either the user is the child or a parent of the child being vieweds
  const isChild = nationalId === userInfo.profile.nationalId
  const isChildOfUser = child?.custodians?.some(
    (c) => c.nationalId === userInfo.profile.nationalId,
  )

  const isChildOrChildOfUser = isChild || isChildOfUser
  const noChildFound = !loading && !isChildOrChildOfUser && !error

  return (
    <>
      <IntroHeader
        hideImgPrint
        title={child?.fullName ?? ''}
        intro={formatMessage(spmm.childIntro)}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />

      {error && !loading && <Problem error={error} noBorder={false} />}
      {(!baseId || noChildFound) && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noDataFoundVariableSingular, {
            arg: formatMessage(spmm.child).toLowerCase(),
          })}
          message={formatMessage(m.noDataFoundVariableDetailVariation, {
            arg: formatMessage(spmm.child).toLowerCase(),
          })}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || isChildOrChildOfUser) && (
        <>
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
                            childNationalId: nationalId || '',
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
                printable
                content={child?.fullName || '...'}
                tooltip={formatNameBreaks(child?.name ?? undefined, {
                  givenName: formatMessage(spmm.givenName),
                  middleName: formatMessage(spmm.middleName),
                  lastName: formatMessage(spmm.lastName),
                })}
                tooltipFull
                loading={loading}
                editLink={
                  !isChild
                    ? {
                        title: formatMessage(spmm.editLink),
                        external: true,
                        skipOutboundTrack: true,
                        url: 'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                      }
                    : undefined
                }
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={formatMessage(m.natreg)}
                content={nationalId ? formatNationalId(nationalId) : ''}
                loading={loading}
                printable
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={defineMessage(m.legalResidence)}
                content={child?.housing?.address?.streetAddress || ''}
                loading={loading}
                printable
                editLink={
                  !isChild
                    ? {
                        title: formatMessage(spmm.editLink),
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
                content={child?.birthplace?.location || ''}
                loading={loading}
                printable
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={formatMessage(m.religion)}
                content={child?.religion || ''}
                loading={loading}
                editLink={
                  !isChild
                    ? {
                        title: formatMessage(spmm.editLink),
                        external: true,
                        skipOutboundTrack: true,
                        url: 'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                      }
                    : undefined
                }
                printable
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={formatMessage(m.gender)}
                content={
                  child?.gender
                    ? formatMessage(
                        natRegGenderMessageDescriptorRecord[child.gender],
                      )
                    : ''
                }
                loading={loading}
                printable
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={formatMessage(m.citizenship)}
                content={child?.citizenship?.name || ''}
                loading={loading}
                printable
              />
            </Stack>
            {(parent1 || parent2 || loading) && (
              <Stack component="ul" space={2}>
                <TwoColumnUserInfoLine
                  title={formatMessage(spmm.parent)}
                  label={formatMessage(m.name)}
                  firstValue={parent1?.fullName}
                  secondValue={parent2?.fullName}
                  loading={loading}
                  printable
                />
                <Box printHidden>
                  <Divider />
                </Box>
                <TwoColumnUserInfoLine
                  label={formatMessage(m.natreg)}
                  firstValue={
                    parent1 ? formatNationalId(parent1.nationalId) : ''
                  }
                  secondValue={
                    parent2 ? formatNationalId(parent2.nationalId) : ''
                  }
                  loading={loading}
                  printable
                />
                <Box printHidden>
                  <Divider />
                </Box>
              </Stack>
            )}
            {!error && (
              <Stack component="ul" space={2}>
                <TwoColumnUserInfoLine
                  title={formatMessage(spmm.custodians)}
                  label={formatMessage(m.name)}
                  firstValue={custodian1?.fullName}
                  secondValue={custodian2?.fullName}
                  loading={loading}
                  printable
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
                  printable
                />
                <Box printHidden>
                  <Divider />
                </Box>
                <TwoColumnUserInfoLine
                  label={formatMessage(spmm.custodyStatus)}
                  firstValue={custodian1?.text}
                  secondValue={custodian2?.text}
                  loading={loading}
                  printable
                />
                <Box printHidden>
                  <Divider />
                </Box>
              </Stack>
            )}
          </Stack>
        </>
      )}
    </>
  )
}

export default Child
