import React, { useEffect, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
type Props = {
  application: Application
}
export const Logo = ({ application }: Props) => {
  const [logo, setLogo] = useState<string>()
  console.log(application.externalData)
  const nationalId = getValueViaPath<string>(
    application.externalData,
    'nationalRegistry.data.nationalId',
  )
  console.log(nationalId)

  useEffect(() => {
    const getLogo = async () => {
      if (nationalId === '0101302399') {
        const svgLogo = await import(`./akureyri.svg`)
        setLogo(svgLogo.default)
      } else {
        const svgLogo = await import(`./akrahreppur.svg`)
        setLogo(svgLogo.default)
      }
    }
    getLogo()
  }, [])
  return <img src={logo} alt="Municipality logo" />
}
