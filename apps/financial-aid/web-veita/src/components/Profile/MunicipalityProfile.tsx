import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'

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
      </Box>
    </Box>
  )
}

export default MunicipalityProfile
