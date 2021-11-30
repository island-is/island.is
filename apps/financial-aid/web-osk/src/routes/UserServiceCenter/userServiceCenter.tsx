import { serviceCenters } from '@island.is/financial-aid/shared/data'
import { useRouter } from 'next/router'
import React from 'react'
import { ServiceCenter } from '../../components'

const UserServiceCenter = () => {
  const router = useRouter()
  const municipalityId = router.query.id as string
  const serviceCenter = serviceCenters.find(
    (serviceCenter) => serviceCenter.number === Number(municipalityId),
  )
  return <ServiceCenter serviceCenter={serviceCenter} />
}

export default UserServiceCenter
