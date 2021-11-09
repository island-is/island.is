import React from 'react'
import { Box, Button, Link, Text } from '@island.is/island-ui/core'

import * as styles from './Profile.css'
import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

import { Municipality, Staff } from '@island.is/financial-aid/shared/lib'

import {
  TableHeaders,
  TableBody,
} from '@island.is/financial-aid-web/veita/src/components'

interface MunicipalityProfileProps {
  municipality: Municipality
}

const MunicipalityProfile = ({ municipality }: MunicipalityProfileProps) => {
  const usersTableHeaders = ['Nafn', 'Kennitala', 'Netfang', 'Aðgerð']

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

          <div className={`${tableStyles.wrapper} hideScrollBar`}>
            <div className={tableStyles.smallTableWrapper}>
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
                        key={'tableHeaders-' + index}
                      />
                    ))}
                  </tr>
                </thead>

                <tbody className={tableStyles.tableBody}>
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
                      key={'tableBody-' + item.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Box>

        <Box marginBottom={7}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3" color="dark300">
              Grunnupphæðir
            </Text>
          </Box>
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
