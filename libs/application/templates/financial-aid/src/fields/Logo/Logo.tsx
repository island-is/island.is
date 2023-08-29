import React, { useEffect, useState } from 'react'

import { logoKeyFromMunicipalityCode } from '@island.is/financial-aid/shared/lib'
import { Box } from '@island.is/island-ui/core'

import { FAFieldBaseProps } from '../../lib/types'
import * as styles from './Logo.css'

const withLogo =
  (Component: React.ComponentType<React.PropsWithChildren<FAFieldBaseProps>>) =>
  (props: FAFieldBaseProps) => {
    const [logo, setLogo] = useState<string>()
    const municipality = props.application.externalData.municipality.data

    useEffect(() => {
      const getLogo = async () => {
        const svgLogo = await import(
          `../../svg/${
            logoKeyFromMunicipalityCode[
              municipality ? municipality.municipalityId : ''
            ]
          }`
        )
        setLogo(svgLogo.default)
      }
      getLogo()
    }, [])

    return (
      <>
        <Component {...props} />
        <Box marginTop={[10, 10, 12]} display="flex" justifyContent="flexEnd">
          <a
            href={municipality?.homepage}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.logo}
          >
            <img src={logo} alt="" />
          </a>
        </Box>
      </>
    )
  }

export default withLogo
