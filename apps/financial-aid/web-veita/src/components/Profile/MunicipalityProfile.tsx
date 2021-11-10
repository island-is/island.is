import React from 'react'
import { Box, Link, Text } from '@island.is/island-ui/core'

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
  TextTableItem,
  ActivationButtonTableItem,
} from '@island.is/financial-aid-web/veita/src/components'

interface MunicipalityProfileProps {
  municipality: Municipality
}

const MunicipalityProfile = ({ municipality }: MunicipalityProfileProps) => {
  const smallText = 'small'
  const headline = 'h5'
  const aidTableBody = (value: AidType) => {
    switch (value) {
      case AidType.OWNPLACE:
        return [
          TextTableItem(headline, 'Eigin húsnæði'),
          TextTableItem(smallText, municipality.individualAid.ownPlace),
          TextTableItem(smallText, municipality.cohabitationAid.ownPlace),
        ]
      case AidType.REGISTEREDLEASE:
        return [
          TextTableItem(headline, 'Leiga með þinglýstum leigusamning'),
          TextTableItem(
            smallText,
            municipality.individualAid.registeredRenting,
          ),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.registeredRenting,
          ),
        ]
      case AidType.UNREGISTEREDLEASE:
        return [
          TextTableItem(headline, 'Býr eða leigir án þinglýsts leigusamnings'),
          TextTableItem(
            smallText,
            municipality.individualAid.unregisteredRenting,
          ),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.unregisteredRenting,
          ),
        ]
      case AidType.WITHPARENTS:
        return [
          TextTableItem(headline, 'Býr hjá foreldrum'),
          TextTableItem(smallText, municipality.individualAid.livesWithParents),
          TextTableItem(
            smallText,
            municipality.cohabitationAid.livesWithParents,
          ),
        ]
      case AidType.UNKNOWN:
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
              onClick={() => console.log('🔜')}
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
                {municipality.adminUsers?.map((item: Staff, index) => (
                  <TableBody
                    items={[
                      TextTableItem(headline, item.name),
                      TextTableItem(smallText, item.nationalId),
                      TextTableItem(smallText, item.email),
                      ActivationButtonTableItem(
                        'Óvirkja',
                        false,
                        () => console.log('🔜'),
                        true,
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
