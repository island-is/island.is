import React, { useContext } from 'react'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import SpouseDataGathering from './spouseDataGathering'
import ApplicantDataGathering from './applicantDataGathering'

const DataGathering = () => {
  const { user } = useContext(AppContext)

  return (
    <>
      {user?.spouse?.hasPartnerApplied ? (
        <SpouseDataGathering />
      ) : (
        <ApplicantDataGathering />
      )}
    </>
  )
}

export default DataGathering
