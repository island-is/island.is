import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  LinkV2,
  Text,
  toast,
  ToastContainer,
} from '@island.is/island-ui/core'
import {
  AidTypeHomeCircumstances,
  Municipality,
  Staff,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import {
  TableHeaders,
  TableBody,
  TextTableItem,
  ActivationButtonTableItem,
  NewUserModal,
  MultiSelectionAdmin,
} from '@island.is/financial-aid-web/veita/src/components'
import { useStaff } from '@island.is/financial-aid-web/veita/src/utils/useStaff'
import { useLazyQuery } from '@apollo/client'
import { AdminUsersQuery } from '@island.is/financial-aid-web/veita/graphql'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import { useMutation } from '@apollo/client'
import { MunicipalityActivityMutation } from '@island.is/financial-aid-web/veita/graphql'
import cn from 'classnames'

import * as styles from './Profile.css'
import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import * as tableStyles from '../../sharedStyles/Table.css'
interface MunicipalityProfileProps {
  municipality: Municipality
  getMunicipality: () => void
}

const MunicipalityProfile = ({
  municipality,
  getMunicipality,
}: MunicipalityProfileProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { changeUserActivity, staffActivationLoading } = useStaff()
  const [adminUsers, setAdminUsers] = useState(municipality.adminUsers)
  const { admin } = useContext(AdminContext)

  const [getAdminUsers, { data: adminUsersData, loading: AdminUsersLoading }] =
    useLazyQuery<{ municipality: Municipality }, { input: { id: string } }>(
      AdminUsersQuery,
      { fetchPolicy: 'no-cache' },
    )

  useEffect(() => {
    if (adminUsersData?.municipality.adminUsers) {
      setAdminUsers(adminUsersData.municipality.adminUsers)
    }
  }, [adminUsersData])

  const refreshList = () => {
    setIsModalVisible(false)
    getMunicipality()
  }

  const [municipalityActivity] = useMutation(MunicipalityActivityMutation)

  const changeMunicipalityActivity = async (id: string, active: boolean) => {
    await municipalityActivity({
      variables: {
        input: {
          id,
          active,
        },
      },
    })
      .then(() => {
        getMunicipality()
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra sveitarfélag, vinsamlega reynið aftur síðar',
        )
      })
  }

  const smallText = 'small'
  const headline = 'h5'

  const isLoggedInUser = (staff: Staff) =>
    admin?.nationalId === staff.nationalId

  const aidTableBody = (value: AidTypeHomeCircumstances) => {
    switch (value) {
      case AidTypeHomeCircumstances.OWNPLACE:
        return [
          TextTableItem(headline, 'Eigið húsnæði'),
          TextTableItem(smallText, municipality.individualAid.ownPlace),
          TextTableItem(smallText, municipality.cohabitationAid.ownPlace),
        ]
      case AidTypeHomeCircumstances.REGISTEREDLEASE:
        return [
          TextTableItem(headline, 'Leiga með þinglýstan leigusamning'),
          TextTableItem(
            smallText,
            municipality.individualAid.registeredRenting,
          ),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.registeredRenting,
          ),
        ]
      case AidTypeHomeCircumstances.UNREGISTEREDLEASE:
        return [
          TextTableItem(headline, 'Leiga með óþinglýstan leigusamning'),
          TextTableItem(
            smallText,
            municipality.individualAid.unregisteredRenting,
          ),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.unregisteredRenting,
          ),
        ]
      case AidTypeHomeCircumstances.WITHOTHERS:
        return [
          TextTableItem(
            headline,
            'Býr eða leigir hjá öðrum án þinglýsts leigusamnings',
          ),
          TextTableItem(smallText, municipality.individualAid.withOthers),
          TextTableItem(smallText, municipality.cohabitationAid.withOthers),
        ]
      case AidTypeHomeCircumstances.WITHPARENTS:
        return [
          TextTableItem(headline, 'Býr hjá foreldrum'),
          TextTableItem(smallText, municipality.individualAid.livesWithParents),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.livesWithParents,
          ),
        ]
      case AidTypeHomeCircumstances.UNKNOWN:
        return [
          TextTableItem(headline, 'Ekkert að ofantöldu'),
          TextTableItem(smallText, municipality.individualAid.unknown),
          TextTableItem(smallText, municipality.cohabitationAid.unknown),
        ]
      default:
        return [<></>]
    }
  }
  return (
    <Box
      marginTop={15}
      marginBottom={15}
      className={`${styles.applicantWrapper} ${styles.widthAlmostFull}`}
    >
      <Box className={`${styles.widthAlmostFull}`}>
        <Box className={`contentUp delay-25`} marginBottom={[3, 3, 7]}>
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Text as="h1" variant="h1" marginBottom={2}>
              {municipality.name}
            </Text>
            <Button
              size="small"
              icon="add"
              variant="ghost"
              onClick={() => setIsModalVisible(true)}
            >
              Nýr stjórnandi
            </Button>
          </Box>

          <Box display="flex" marginRight={1} marginTop={5}>
            <Box marginRight={1}>
              <Text variant="small" fontWeight="semiBold" color="dark300">
                Staða
              </Text>
            </Box>
            <Box marginRight={1}>
              <Text variant="small">
                Sveitarfélag er {municipality.active ? 'virkt' : 'óvirkt'}
              </Text>
            </Box>
            <button
              onClick={() =>
                changeMunicipalityActivity(
                  municipality.id,
                  !municipality.active,
                )
              }
              className={headerStyles.button}
            >
              {municipality.active ? 'Óvirkja' : 'Virkja'}
            </button>
          </Box>
        </Box>
        <Box marginBottom={7} className={`contentUp delay-50`}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3" color="dark300">
              Stjórnendur
            </Text>
          </Box>
          <div className={`${tableStyles.smallTableWrapper} hideScrollBar`}>
            <table
              className={cn({
                [`${tableStyles.tableContainer} contentUp delay-75`]: true,
              })}
            >
              <thead>
                <tr>
                  {['Nafn', 'Kennitala', 'Netfang', 'Aðgerð'].map(
                    (item, index) => (
                      <TableHeaders
                        header={{ title: item }}
                        index={index}
                        key={`usersTableHeaders-${index}`}
                      />
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {adminUsers?.map((item: Staff, index) => (
                  <TableBody
                    items={[
                      TextTableItem(
                        headline,
                        `${item.name} ${isLoggedInUser(item) ? '(Þú)' : ''}`,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      TextTableItem(
                        smallText,
                        item.nationalId,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      TextTableItem(
                        smallText,
                        item.email,
                        item.active ? 'dark400' : 'dark300',
                      ),
                      isLoggedInUser(item) === false &&
                        ActivationButtonTableItem(
                          item.active ? 'Óvirkja' : 'Virkja',
                          staffActivationLoading || AdminUsersLoading,
                          () =>
                            changeUserActivity(!item.active, item.id).then(
                              () => {
                                getAdminUsers({
                                  variables: {
                                    input: { id: municipality.municipalityId },
                                  },
                                })
                              },
                            ),
                          item.active,
                        ),
                    ]}
                    index={index}
                    identifier={item.id}
                    key={`usersTableBody-${item.id}`}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box marginBottom={3} className={`contentUp delay-100`}>
          {municipality?.allAdminUsers && (
            <>
              <Text as="h3" variant="h3" color="dark300" marginBottom={3}>
                Bæta við stjórnanda úr lista
              </Text>

              <MultiSelectionAdmin
                admins={municipality.allAdminUsers}
                onUpdate={refreshList}
              />
            </>
          )}

          <Text as="h3" variant="h3" color="dark300">
            Grunnupphæðir
          </Text>
          <div className={`${tableStyles.smallTableWrapper} hideScrollBar`}>
            <table
              className={cn({
                [`${tableStyles.tableContainer} contentUp delay-125`]: true,
              })}
            >
              <thead>
                <tr>
                  {['Búsetskilyrði', 'Einstaklingar', 'Hjón/Sambúð'].map(
                    (item, index) => (
                      <TableHeaders
                        header={{ title: item }}
                        index={index}
                        key={`aidTableHeaders-${index}`}
                      />
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {Object.values(AidTypeHomeCircumstances).map((value, index) => (
                  <TableBody
                    items={aidTableBody(value)}
                    index={index}
                    identifier={value}
                    key={`aidTableBody-${value}`}
                    hasMaxWidth={false}
                    animationDelay={55 * index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box marginBottom={3} className={`contentUp delay-125`}>
          <Text as="h3" variant="h3" color="dark300">
            Aðrar stillingar
          </Text>
        </Box>
        {municipality.rulesHomepage && (
          <Box marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h5" variant="h5" color="dark400">
                Hlekkur á reglur fjárhagsaðstoðar sveitarfélagsins
              </Text>
            </Box>
            <LinkV2
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={municipality.rulesHomepage}
            >
              {municipality.rulesHomepage}
            </LinkV2>
          </Box>
        )}
        {municipality.email && (
          <Box marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h5" variant="h5" color="dark400">
                Almennt netfang sveitarfélagsins (félagsþjónusta)
              </Text>
            </Box>
            <LinkV2
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={`mailto: ${municipality.email}`}
            >
              {municipality.email}
            </LinkV2>
          </Box>
        )}
        {municipality.homepage && (
          <Box marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h5" variant="h5" color="dark400">
                Vefur sveitarfélagsins
              </Text>
            </Box>
            <LinkV2
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={municipality.homepage}
            >
              {municipality.homepage}
            </LinkV2>
          </Box>
        )}
      </Box>
      <NewUserModal
        isVisible={isModalVisible}
        setIsVisible={(visible) => {
          setIsModalVisible(visible)
        }}
        onStaffCreated={refreshList}
        predefinedRoles={[StaffRole.ADMIN]}
      />
      <ToastContainer />
    </Box>
  )
}

export default MunicipalityProfile
