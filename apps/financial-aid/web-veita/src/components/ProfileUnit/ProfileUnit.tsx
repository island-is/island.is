import React, { ReactNode, useState } from 'react'
import { Text, Box, Link, Button } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'

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
  const [toggle, setToggle] = useState<boolean>(false)

  return (
    <>
      {collapsible ? (
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
      ) : (
        <Box
          className={cn({
            [`${styles.headings} `]: true,
            [`${className}`]: true,
          })}
          marginBottom={[2, 2, 3]}
          borderBottomWidth="standard"
          borderColor="dark200"
        >
          <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
            {heading}
          </Text>
        </Box>
      )}

      <div
        className={cn({
          [`${styles.container} hideScrollBar`]: true,
          [`${className}`]: true,
        })}
      >
        {info.map((item, index) => {
          return (
            <Box key={'profile-' + index}>
              <Text variant="eyebrow" marginBottom={1}>
                {item.title}
              </Text>

              {item.link && (
                <Link href={item.link} color="blue400" onClick={item.onclick}>
                  {item.content}
                </Link>
              )}

              {item.onclick && (
                <button onClick={item.onclick} className={styles.button}>
                  {item.content}
                </button>
              )}

              {!item.link && !item.onclick && <Text>{item.content}</Text>}

              {item.other && (
                <Box
                  background="blue100"
                  borderRadius="large"
                  padding={2}
                  marginTop={1}
                >
                  <Text variant="small">
                    „<em>{item.other}</em>“
                  </Text>
                </Box>
              )}
            </Box>
          )
        })}
      </div>

      {collapsible && (
        <AnimateHeight duration={300} height={toggle ? 'auto' : 0}>
          {children}
        </AnimateHeight>
      )}
    </>
  )
}

export default ProfileUnit
