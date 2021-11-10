import React from 'react'
import { Box, Button, Link, Text } from '@island.is/island-ui/core'

import * as styles from './Profile.css'
import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

import {
  AidType,
  Municipality,
  Staff,
} from '@island.is/financial-aid/shared/lib'

import {
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'

interface MunicipalityProfileProps {
  municipality: Municipality
}

const MunicipalityProfile = ({ municipality }: MunicipalityProfileProps) => {
  const usersTableHeaders = ['Nafn', 'Kennitala', 'Netfang', 'Aðgerð']
  const aidTableHeaders = ['Búsetskilyrði', 'Einstaklingar', 'Hjón/Sambúð']

  const staffName = (staff: Staff) => {
    return <Text variant="h5">{staff.name}</Text>
  }
  const staffNationalId = (staff: Staff) => {
    return <Text variant="h5">{staff.nationalId}</Text>
  }

  const staffEmail = (staff: Staff) => {
    return <Text variant="h5">{staff.email}</Text>
  }
  const activationButton = (staff: Staff) => {
    return (
      <Box>
        <Button
          onClick={(event) => {
            event.stopPropagation()
          }}
          variant="text"
          loading={false}
        >
          Óvirkja
        </Button>
      </Box>
    )
  }

  const aidTableBody = (value: AidType) => {
    switch (value) {
      case AidType.OWNPLACE:
        return [
          <Text variant="h5">Eigin húsnæði</Text>,
          <Text variant="small">{municipality.individualAid.ownPlace}</Text>,
          <Text variant="small">{municipality.cohabitationAid.ownPlace}</Text>,
        ]
      case AidType.REGISTEREDLEASE:
        return [
          <Text variant="h5">Leiga með þinglýstum leigusamning</Text>,
          <Text variant="small">
            {municipality.individualAid.registeredRenting}
          </Text>,
          <Text variant="small">
            {municipality.cohabitationAid.registeredRenting}
          </Text>,
        ]
      case AidType.UNREGISTEREDLEASE:
        return [
          <Text variant="h5">Býr eða leigir án þinglýsts leigusamnings</Text>,
          <Text variant="small">
            {municipality.individualAid.unregisteredRenting}
          </Text>,
          <Text variant="small">
            {municipality.cohabitationAid.unregisteredRenting}
          </Text>,
        ]
      case AidType.WITHPARENTS:
        return [
          <Text variant="h5">Býr hjá foreldrum</Text>,
          <Text variant="small">
            {municipality.individualAid.livesWithParents}
          </Text>,
          <Text variant="small">
            {municipality.cohabitationAid.livesWithParents}
          </Text>,
        ]
      case AidType.UNKNOWN:
        return [
          <Text variant="h5">Ekkert að ofantöldu</Text>,
          <Text variant="small">{municipality.individualAid.unknown}</Text>,
          <Text variant="small">{municipality.cohabitationAid.unknown}</Text>,
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
          <Text as="h1" variant="h1" marginBottom={2}>
            {municipality.name}
          </Text>

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
              onClick={() => console.log('bla')}
              className={headerStyles.button}
            >
              {municipality.active ? 'Óvirkja' : 'Virkja'}
            </button>
          </Box>
        </Box>
        <Box marginBottom={7}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3" color="dark300">
              Stjórnendur
            </Text>
          </Box>

          <div className={`${tableStyles.smallTableWrapper} hideScrollBar`}>
            <table
              className={cn({
                [`${tableStyles.tableContainer}`]: true,
              })}
            >
              <thead className={`contentUp delay-50`}>
                <tr>
                  {usersTableHeaders.map((item, index) => (
                    <TableHeaders
                      header={{ title: item }}
                      index={index}
                      key={`usersTableHeaders-${index}`}
                    />
                  ))}
                </tr>
              </thead>

              <tbody>
                {municipality.adminUsers?.map((item: Staff, index) => (
                  <TableBody
                    items={[
                      staffName(item),
                      staffNationalId(item),
                      staffEmail(item),
                      activationButton(item),
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

        <Box>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3" color="dark300">
              Grunnupphæðir
            </Text>
          </Box>
          <div className={`${tableStyles.smallTableWrapper} hideScrollBar`}>
            <table
              className={cn({
                [`${tableStyles.tableContainer}`]: true,
              })}
            >
              <thead className={`contentUp delay-50`}>
                <tr>
                  {aidTableHeaders.map((item, index) => (
                    <TableHeaders
                      header={{ title: item }}
                      index={index}
                      key={`aidTableHeaders-${index}`}
                    />
                  ))}
                </tr>
              </thead>

              <tbody>
                {Object.values(AidType).map((value, index) => (
                  <TableBody
                    items={aidTableBody(value)}
                    index={index}
                    identifier={value}
                    key={`aidTableBody-${value}`}
                    hasMaxWidth={false}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box marginBottom={3}>
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
            <Link
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={municipality.rulesHomepage}
            >
              {municipality.rulesHomepage}
            </Link>
          </Box>
        )}
        {municipality.email && (
          <Box marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h5" variant="h5" color="dark400">
                Almennt netfang sveitarfélagsins (félagsþjónusta)
              </Text>
            </Box>
            <Link
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={`mailto: ${municipality.email}`}
            >
              {municipality.email}
            </Link>
          </Box>
        )}
        {municipality.homepage && (
          <Box marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h5" variant="h5" color="dark400">
                Vefur sveitarfélagsins
              </Text>
            </Box>
            <Link
              color="blue400"
              underline="small"
              underlineVisibility="always"
              href={municipality.homepage}
            >
              {municipality.homepage}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MunicipalityProfile
