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
  children?: ReactNode
}

const CollapsibleProfileUnit = ({
  heading,
  info,
  className,
  children,
}: Props) => {
  const [toggle, setToggle] = useState<boolean>(true)

  return (
    <>
      <button
        className={cn({
          [`${styles.toggleButton}`]: true,
          [`${className}`]: className,
        })}
        onClick={() => setToggle((toggle) => !toggle)}
      >
        <Box className={`${styles.toggleWrapper} `}>
          <Box
            background="purple100"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={cn({
              [`${styles.iconContainer} `]: true,
              [`${styles.rotate}`]: toggle,
            })}
            printHidden
          >
            <Icon icon={'chevronUp'} color="purple400" />
          </Box>
          <Box
            display="flex"
            width="full"
            className={`${styles.headlineBorder} hideOnPrintBorderBottom`}
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

export default CollapsibleProfileUnit
