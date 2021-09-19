import React from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'
import { useQuery } from '@apollo/client'
import { GetMunicipalityIdQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'

interface MunicipalityData {
  municipality: {
    id: string
  }
}

interface LogoProps {
  className?: string
}

const LogoHfj = ({ className }: LogoProps) => {
  const router = useRouter()

  const municipaliyId = router.query.sveitarfelag
    ? (router.query.sveitarfelag as string)
    : 'hfj'

  const { data } = useQuery<MunicipalityData>(GetMunicipalityIdQuery, {
    variables: {
      input: {
        id: municipaliyId,
      },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return (
    <a
      href="https://www.hafnarfjordur.is/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn({ [`${className}`]: true })}
    >
      {data && <LogoSvg name={data.municipality.id} />}
    </a>
  )
}

export default LogoHfj
