import React, { useContext } from 'react'

import { Box } from '@island.is/island-ui/core'
import { InstitutionType } from '@island.is/judicial-system-web/src/graphql/schema'

import { UserContext } from '../UserProvider/UserProvider'
import LandWightsLogo from './LandWightsLogo'
import PoliceStar from './PoliceStar'
import * as styles from './Logo.css'

interface Props {
  defaultInstitution?: string
}

const Logo: React.FC<React.PropsWithChildren<Props>> = ({
  defaultInstitution = '',
}) => {
  const { user } = useContext(UserContext)
  const institutionName = user?.institution?.name ?? defaultInstitution
  const institutionNameArr = institutionName.split(' ')
  const institutionNameFirstHalf = institutionNameArr.slice(
    0,
    institutionNameArr.length < 4
      ? institutionNameArr.length - 1
      : institutionNameArr.length - 2,
  )
  const institutionNameSecondHalf = institutionNameArr.slice(
    institutionNameArr.length < 4
      ? institutionNameArr.length - 1
      : institutionNameArr.length - 2,
  )
  const institutionType = user?.institution?.type
  const isPolice =
    institutionType === InstitutionType.PROSECUTORS_OFFICE &&
    institutionName !== 'Héraðssaksóknari' &&
    institutionName !== 'Ríkissaksóknari'

  return (
    <Box display="flex">
      <Box marginRight={2} marginBottom={[0, 0, 1, 0]}>
        {isPolice ? <PoliceStar /> : <LandWightsLogo />}
      </Box>
      <p className={styles.logoText}>
        <span>{institutionNameFirstHalf.join(' ')}</span>
        <span>{institutionNameSecondHalf.join(' ')}</span>
      </p>
    </Box>
  )
}

export default Logo
