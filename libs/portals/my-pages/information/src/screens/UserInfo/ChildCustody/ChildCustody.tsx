import { useUserInfo } from '@island.is/react-spa/bff'
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
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  formatNationalId,
  IntroWrapper,
  LinkButton,
  m,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { unmaskString } from '@island.is/shared/utils'
import { useParams } from 'react-router-dom'
import { TwoColumnUserInfoLine } from '../../../components/TwoColumnUserInfoLine/TwoColumnUserInfoLine'
import { formatNameBreaks } from '../../../helpers/formatting'
import { natRegGenderMessageDescriptorRecord } from '../../../helpers/localizationHelpers'
import { spmm, urls } from '../../../lib/messages'
import { useNationalRegistryChildCustodyQuery } from './ChildCustody.generated'
import { useEffect, useState } from 'react'

type UseParams = {
  baseId: string
}

const ChildCustody = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const { baseId } = useParams() as UseParams
  const [unmaskedBaseId, setUnmaskedBaseId] = useState<string | null>(null)

  useEffect(() => {
    const decrypt = async () => {
      try {
        const decrypted = await unmaskString(
          baseId,
          userInfo.profile.nationalId,
        )
        setUnmaskedBaseId(decrypted)
      } catch (error) {
        console.error('Error encrypting text:', error)
      }
    }

    decrypt()
  }, [baseId, userInfo])

  const { data, loading, error } = useNationalRegistryChildCustodyQuery({
    variables: {
      childNationalId: unmaskedBaseId,
    },
    skip: !unmaskedBaseId,
  })

  const child = data?.nationalRegistryPerson?.childCustody?.[0]?.details

  const nationalId = child?.nationalId

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
    <IntroWrapper
      title={child?.fullName ?? ''}
      intro={formatMessage(spmm.childIntro)}
      serviceProviderSlug={THJODSKRA_SLUG}
      serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {(!baseId || noChildFound) && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
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
                        <LinkButton
                          to={formatMessage(urls.contactThjodskra)}
                          text={formatMessage(spmm.childRegisterModalButton)}
                          variant="utility"
                          icon="receipt"
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
    </IntroWrapper>
  )
}

export default ChildCustody
