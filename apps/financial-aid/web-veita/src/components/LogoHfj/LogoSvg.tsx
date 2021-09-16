import React, { useEffect, useState } from 'react'
import cn from 'classnames'

// import { FileList } from './../../../public/svg'
import test from '../../../public/svg/hfj.svg'
import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'

import dynamic from 'next/dynamic'

interface LogoSvgProps {
  name?: string
  className?: string
}

const importIcon = (icon: any) =>
  dynamic(() =>
    import(`../../../public/svg/${icon}`)
      .then((c) => {
        return c
      })
      .catch((err) => {
        return () => <span />
      }),
  )

const LogoSvg = ({ name, className }: LogoSvgProps) => {
  const [icon, setIcon] = useState(null)
  console.log(icon, test)

  // Lazy load all icons!
  useEffect(() => {
    async function load() {
      const LoadedIcon = await importIcon('hfj.svg')
      return <LoadedIcon />
    }

    load().then((e: any) => {
      if (!icon) {
        setIcon(e)
      }
    })
  }, [icon])

  return (
    <div
      className={cn({
        [`test`]: true,
        [`${className}`]: className,
      })}
    >
      <img src={icon} alt="" />
    </div>
  )
}

export default LogoSvg
