import { FC, useContext } from 'react'

import { Box } from '@island.is/island-ui/core'
import { InstitutionType } from '@island.is/judicial-system-web/src/graphql/schema'

import { UserContext } from '../UserProvider/UserProvider'
import LandWightsLogo from './LandWightsLogo'
import PoliceStar from './PoliceStar'
import * as styles from './Logo.css'

interface Props {
  defaultInstitution?: string | null
}

const Logo: FC<Props> = ({ defaultInstitution = '' }) => {
  const { user } = useContext(UserContext)
  if (!user) {
    return null
  }

  const institutionName = user?.institution?.name ?? defaultInstitution ?? ''
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
  const isPolice = institutionType === InstitutionType.POLICE_PROSECUTORS_OFFICE

  return (
    <Box display="flex">
      <Box marginRight={2}>
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
