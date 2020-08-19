import React, {
  FC,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import cn from 'classnames'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import {
  Typography,
  Stack,
  Box,
  Button,
  ContentBlock,
} from '@island.is/island-ui/core'
import Dots from './Dots'

import * as styles from './FrontpageTabs.treat'

type ImageProps = {
  title: string
  url: string
  contentType: string
  width: number
  height: number
}

type TabsProps = {
  subtitle: string
  title: string
  content: string
  image?: ImageProps
  link?: string
}

export interface FrontpageTabsProps {
  tabs: TabsProps[]
  searchContent: ReactNode
}

export interface TabBulletProps {
  selected?: boolean
}

const TabBullet: FC<TabBulletProps> = ({ selected }) => {
  return (
    <div
      className={cn(styles.tabBullet, {
        [styles.tabBulletSelected]: selected,
      })}
    />
  )
}

export const FrontpageTabs: FC<FrontpageTabsProps> = ({
  tabs,
  searchContent,
}) => {
  const [image, setImage] = useState<ImageProps | null>(null)
  const tab = useTabState({
    baseId: 'frontpage-tab',
  })

  const selectedIndex = tab.items.findIndex((x) => x.id === tab.currentId)

  const updateImage = useCallback(() => {
    if (selectedIndex >= 0) {
      setImage(tabs[selectedIndex].image)
    }
  }, [selectedIndex, tabs])

  useEffect(() => {
    updateImage()
  }, [updateImage])

  return (
    <div className={styles.container}>
      <TabList {...tab} aria-label="My tabs" className={styles.tabWrapper}>
        {tabs.map(({ subtitle }, index) => {
          const selected = tab.selectedId === `frontpage-tab-${index + 1}`

          return (
            <Tab key={index} {...tab} className={cn(styles.tabContainer)}>
              <TabBullet selected={selected} />
              <span className={styles.srOnly}>{subtitle}</span>
            </Tab>
          )
        })}
      </TabList>
      <div className={styles.content}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          marginRight={[0, 0, 0, 3]}
          width="full"
        >
          {tabs.map(({ title, subtitle, content, link }, index) => {
            return (
              <TabPanel
                key={index}
                {...tab}
                style={{
                  minHeight: '300px',
                  // display: 'block',
                }}
                // className={cn(styles.tabPanel, {})}
              >
                <Box paddingY={3}>
                  <Stack space={3}>
                    <Typography variant="eyebrow" as="h2" color="purple400">
                      {subtitle}
                    </Typography>
                    <Typography variant="h1" as="h1">
                      {title}
                    </Typography>
                    <Typography variant="p" as="p">
                      <span>{content}</span>
                      {link ? (
                        <span>
                          {` `}
                          <Button variant="text" icon="arrowRight">
                            Sjá nánar
                          </Button>
                        </span>
                      ) : null}
                    </Typography>
                  </Stack>
                </Box>
              </TabPanel>
            )
          })}

          <Box
            display="inlineFlex"
            alignItems="center"
            width="full"
            borderRadius="large"
            background="blue100"
            paddingX={[1, 1, 3]}
            paddingY={[1, 1, 4]}
          >
            {searchContent}
          </Box>
        </Box>

        <div className={styles.imageContainer}>
          <div className={styles.dots}>
            <Dots />
          </div>
          <div className={styles.image}>
            {image ? <img src={image.url} alt={image.title} /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrontpageTabs
