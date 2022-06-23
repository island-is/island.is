import React, { ReactNode, useState } from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import Unit from './Unit'
import ProfileUnit from './ProfileUnit'
import { ApplicationProfileInfo } from '@island.is/financial-aid/shared/lib'

interface Props {
  heading: string
  info: ApplicationProfileInfo[]
  className?: string
  children?: ReactNode
  isPrint?: boolean
}

const CollapsibleProfileUnit = ({
  heading,
  info,
  className,
  children,
  isPrint = false,
}: Props) => {
  const [toggle, setToggle] = useState<boolean>(true)

  if (isPrint) {
    return (
      <ProfileUnit
        heading={heading}
        info={info}
        className={cn({
          [`${className}`]: className,
        })}
      >
        {children}
      </ProfileUnit>
    )
  }

  return (
    <>
      <button
        className={cn({
          [`${styles.toggleButton}`]: true,
          [`${className}`]: className,
        })}
        onClick={() => setToggle((toggle) => !toggle)}
      >
        <Box className={styles.toggleWrapper}>
          <Box
            background="purple100"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={cn({
              [`${styles.iconContainer} `]: true,
              [`${styles.rotate}`]: toggle,
            })}
          >
            <Icon icon={'chevronUp'} color="purple400" />
          </Box>
          <Box display="flex" width="full" className={styles.headlineBorder}>
            <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
              {heading}
            </Text>
          </Box>
        </Box>
      </button>
      <AnimateHeight
        duration={250}
        height={toggle ? 'auto' : 0}
        className={cn({
          [`${styles.fullWidth} ${styles.animatedHeight}`]: true,
          [`${className}`]: className,
        })}
      >
        {info.length > 0 && <Unit info={info} />}
        {children && children}
      </AnimateHeight>
      <Box
        marginBottom={3}
        className={cn({
          [`${styles.fullWidth} `]: true,
        })}
      />
    </>
  )
}

export default CollapsibleProfileUnit
