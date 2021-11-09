import React from 'react'
import { Box, Link, Text } from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'
import { Municipality } from '@island.is/financial-aid/shared/lib'

import cn from 'classnames'

interface MunicipalityProfileProps {
  municipality: Municipality
}

const MunicipalityProfile = ({ municipality }: MunicipalityProfileProps) => {
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
