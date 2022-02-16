import React, { useState } from 'react'
import { Text, Box, Link, Icon, Button } from '@island.is/island-ui/core'

import * as styles from './ProfileUnitCollapsible.css'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'

interface Props {
  className?: string
}

const ProfileUnitCollapsible = ({ className }: Props) => {
  const [toggle, setToggle] = useState<boolean>(false)

  return (
    <>
      <button
        className={cn({
          [`${styles.toggleButton} rotateButton`]: true,
          [`rotate `]: toggle,
        })}
        onClick={() => setToggle(!toggle)}
      >
        <Box
          display="flex"
          justifyContent="spaceBetween"
          borderBottomWidth="standard"
          borderColor="dark200"
        >
          <Text as="h2" variant="h4" color="dark300" marginBottom={1}>
            Upplýsingar um staðgreiðslu
          </Text>
          <Button
            circle
            icon={'chevronUp'}
            size="small"
            variant="ghost"
            unfocusable={true}
          />
        </Box>
      </button>
      <AnimateHeight duration={300} height={toggle ? 'auto' : 0}>
        <Box
        // className={cn({
        //   [`${styles.toggleContent}`]: true,
        //   [`${styles.showContent} `]: toggle,
        // })}
        >
          hér kemur eitthvað magic
        </Box>
      </AnimateHeight>
    </>
  )
}

export default ProfileUnitCollapsible
