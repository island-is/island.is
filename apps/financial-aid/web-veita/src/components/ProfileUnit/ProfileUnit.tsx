import React, { ReactNode, useState } from 'react'
import { Text, Box, Icon } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import Unit from './Unit'

interface Props {
  heading: string
  info: {
    title: string
    content?: string
    link?: string
    onclick?: () => void
    other?: string
  }[]
  className?: string
  collapsible?: boolean
  children?: ReactNode
}

const ProfileUnit = ({
  heading,
  info,
  className,
  collapsible = false,
  children,
}: Props) => {
  const [toggle, setToggle] = useState<boolean>(true)

  if (collapsible) {
    return (
      <>
        <button
          className={cn({
            [`${styles.toggleButton}`]: true,
            [`${className}`]: className,
          })}
          onClick={() => setToggle(!toggle)}
        >
          <Box className={styles.toggleWrapper}>
            <Box
              background="purple100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={cn({
                [`${styles.iconContainer}`]: true,
                [`${styles.rotate}`]: toggle,
              })}
            >
              <Icon icon={'chevronUp'} color="purple400" />
            </Box>
            <Box
              display="flex"
              borderBottomWidth="standard"
              borderColor="dark200"
              width="full"
            >
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
          <Unit info={info} />
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
  return (
    <>
      <Box
        className={cn({
          [`${styles.fullWidth} `]: true,
          [`${className}`]: className,
        })}
        marginBottom={[2, 2, 3]}
        borderBottomWidth="standard"
        borderColor="dark200"
      >
        <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
          {heading}
        </Text>
      </Box>
      <Unit info={info} className={className} />

      {children && children}
    </>
  )
}

export default ProfileUnit
