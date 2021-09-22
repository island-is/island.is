import React from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'
import { useQuery } from '@apollo/client'
import { GetMunacipalityHomePageQuery } from '@island.is/financial-aid-web/veita/graphql'
import { useRouter } from 'next/router'
import { LoadingDots } from '@island.is/island-ui/core'

interface MunicipalityData {
  municipality: {
    id: string
    settings: {
      homePage: string
    }
  }
}

interface LogoProps {
  className?: string
}

const LogoMunicipality = ({ className }: LogoProps) => {
  const router = useRouter()

  //TODO when more muncipalities have been added to system
  const municipaliyId = router.query.sveitarfelag
    ? (router.query.sveitarfelag as string)
    : 'hfj'

  const { data } = useQuery<MunicipalityData>(GetMunacipalityHomePageQuery, {
    variables: {
      input: {
        id: municipaliyId,
      },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  if (!data) {
    return <LoadingDots />
  }

  return (
    <a
      href={data.municipality.settings.homePage}
      target="_blank"
      rel="noopener noreferrer"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={data.municipality.id} />
    </a>
  )
}

export default LogoMunicipality
