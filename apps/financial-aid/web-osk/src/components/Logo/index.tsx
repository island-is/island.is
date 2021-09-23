import React, { useContext, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import LogoSvg from './LogoSvg'
import { MunicipalityContext } from '../MunicipalityProvider/MunicipalityProvider'

interface LogoProps {
  className?: string
}

// const LogoHfj = dynamic(() =>
//   import('@island.is/financial-aid/shared/components'),
// )

// const importIcon = (icon: any) =>
//   dynamic(() =>
//     import(`@island.is/financial-aid/shared/components`)
//       .then((c) => {
//         console.log(c)
//         return c
//       })
//       .catch((err) => {
//         console.log(c)
//         return () => <span />
//       }),
//   )
const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(MunicipalityContext)
  console.log(municipality)

  // const [name, setName] = useState('sis')

  // import { FileList } from '@island.is/financial-aid/shared/components'

  // const [icon, setIcon] = useState(null)
  // console.log(icon)

  // // // Lazy load all icons!
  // useEffect(() => {
  //   async function load() {
  //     const LoadedIcon = await importIcon('LogoHfj')
  //     return <LoadedIcon />
  //   }

  //   load().then((e) => {
  //     if (!icon) {
  //       setIcon(e)
  //     }
  //   })
  // }, [icon])

  return (
    <a
      href={'https://www.samband.is/'}
      target="_blank"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={municipality?.id ? municipality.id : 'sis'} />
    </a>
  )
}

export default Logo
