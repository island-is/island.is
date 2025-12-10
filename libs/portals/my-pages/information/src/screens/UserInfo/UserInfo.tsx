import { defineMessage } from 'react-intl'
import { checkDelegation } from '@island.is/shared/utils'
import { info } from 'kennitala'
import { Problem } from '@island.is/react-spa/shared'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  formatNationalId,
  IntroHeader,
  m,
  THJODSKRA_SLUG,
  InfoLine,
  InfoLineStack,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'

import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'
import { spmm, urls } from '../../lib/messages'
import { formatAddress, formatNameBreaks } from '../../helpers/formatting'
import { useNationalRegistryPersonQuery } from './UserInfo.generated'

const SubjectInfo = () => {
  useNamespaces('sp.family')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  const { data, loading, error } = useNationalRegistryPersonQuery()

  const { nationalRegistryPerson } = data || {}
  const isDelegation = userInfo && checkDelegation(userInfo)

  const isUserAdult = info(userInfo.profile.nationalId).age >= 18

  return (
    <>
      <IntroHeader
        title={nationalRegistryPerson?.name?.fullName || ''}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.nationalRegistryPerson && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noDataFound)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || data?.nationalRegistryPerson) && (
        <>
          <InfoLineStack label={formatMessage(m.myRegistration)}>
            <InfoLine
              label={m.fullName}
              loading={loading}
              content={nationalRegistryPerson?.name?.fullName ?? ''}
              translate="no"
              tooltip={formatNameBreaks(
                nationalRegistryPerson?.name ?? undefined,
                {
                  givenName: formatMessage(spmm.givenName),
                  middleName: formatMessage(spmm.middleName),
                  lastName: formatMessage(spmm.lastName),
                },
              )}
              tooltipFull
              button={{
                type: 'link',
                label: spmm.changeInNationalReg,
                to: formatMessage(urls.editAdult),
              }}
            />

            <InfoLine
              label={m.natreg}
              loading={loading}
              content={formatNationalId(userInfo.profile.nationalId)}
            />

            <InfoLine
              label={m.legalResidence}
              tooltip={formatMessage(spmm.legalResidenceTooltip)}
              content={
                formatAddress(
                  nationalRegistryPerson?.housing?.address ?? null,
                ) || ''
              }
              loading={loading}
              button={{
                type: 'link',
                label: spmm.changeInNationalReg,
                to: formatMessage(urls.editResidence),
              }}
            />
          </InfoLineStack>
          <InfoLineStack label={formatMessage(m.baseInfo)}>
            <InfoLine
              label={m.birthPlace}
              content={nationalRegistryPerson?.birthplace?.location || ''}
              loading={loading}
            />

            <InfoLine
              label={m.familyNumber}
              content={nationalRegistryPerson?.housing?.domicileId || ''}
              loading={loading}
              tooltip={formatMessage({
                id: 'sp.family:family-number-tooltip',
                defaultMessage: `Lögheimilistengsl er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.`,
              })}
            />
            {isUserAdult && (
              <InfoLine
                label={m.maritalStatus}
                content={
                  nationalRegistryPerson?.maritalStatus
                    ? formatMessage(
                        natRegMaritalStatusMessageDescriptorRecord[
                          nationalRegistryPerson?.maritalStatus
                        ],
                      )
                    : ''
                }
                loading={loading}
              />
            )}

            <InfoLine
              label={defineMessage(m.religion)}
              content={nationalRegistryPerson?.religion || ''}
              loading={loading}
              button={{
                type: 'link',
                label: spmm.changeInNationalReg,
                to: formatMessage(urls.editReligion),
              }}
            />

            <InfoLine
              label={m.banMarking}
              content={
                nationalRegistryPerson?.exceptionFromDirectMarketing
                  ? formatMessage({
                      id: 'sp.family:yes',
                      defaultMessage: 'Já',
                    })
                  : formatMessage({
                      id: 'sp.family:no',
                      defaultMessage: 'Nei',
                    })
              }
              tooltip={formatMessage({
                id: 'sp.family:ban-marking-tooltip',
                defaultMessage:
                  'Bannmerktir einstaklingar koma t.d. ekki fram á úrtakslistum úr þjóðskrá og öðrum úrtökum í markaðssetningarskyni.',
              })}
              loading={loading}
              button={{
                type: 'link',
                label: spmm.changeInNationalReg,
                to: formatMessage(urls.editBanmarking),
              }}
            />

            <InfoLine
              label={m.gender}
              content={
                nationalRegistryPerson?.gender
                  ? formatMessage(
                      natRegGenderMessageDescriptorRecord[
                        nationalRegistryPerson.gender
                      ],
                    )
                  : ''
              }
              loading={loading}
            />
            {nationalRegistryPerson?.citizenship?.name && (
              <InfoLine
                label={m.citizenship}
                content={nationalRegistryPerson.citizenship.name}
                loading={loading}
              />
            )}
          </InfoLineStack>
          {!isDelegation && (
            <InfoLineStack
              label={formatMessage(spmm.userFamilyMembersOnNumber)}
            >
              <InfoLine
                label={userInfo.profile.name}
                translateLabel="no"
                content={formatNationalId(userInfo.profile.nationalId)}
                loading={loading}
              />

              {nationalRegistryPerson?.housing?.domicileInhabitants?.map(
                (item) => (
                  <InfoLine
                    key={item.nationalId}
                    translateLabel="no"
                    label={item.fullName ?? ''}
                    content={formatNationalId(item.nationalId)}
                    loading={loading}
                  />
                ),
              )}
            </InfoLineStack>
          )}
        </>
      )}

      <FootNote serviceProviderSlug={THJODSKRA_SLUG} />
    </>
  )
}

export default SubjectInfo
