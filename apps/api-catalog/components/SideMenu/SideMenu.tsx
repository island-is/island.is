import React from 'react'
import FocusLock from 'react-focus-lock'
import * as styles from './SideMenu.treat'
import cn from 'classnames'
import { Box, FocusableBox, Icon, Typography } from '@island.is/island-ui/core';
import { useKey } from 'react-use';


export interface SideMenuLink {
    title: string
    url: string
}

export interface SideMenuProps {
    title?: string
    links: SideMenuLink[]
    isVisible:boolean
    handleClose: () => void
}

export const SideMenu = (props: SideMenuProps) => {
    useKey('Escape', props.handleClose)

    return (
        <FocusLock>
        <Box
          className={cn(props.isVisible? styles.root : styles.hidden)}
          background="white"
          boxShadow="subtle"
          height="full"
        >
        <Box display="flex" paddingBottom={1} justifyContent="flexEnd">
            <Box display="flex" paddingBottom={3} flexGrow={1} justifyContent="spaceBetween">
                <div className={cn(styles.title)}>
                    {props?.title}
                </div>
                <FocusableBox
                component="button"
                onClick={props.handleClose}
                tabIndex={-1}
                padding={1}
                >
                <Icon type="close" />
                </FocusableBox>
            </Box>
          </Box>

          <div className={styles.linksContent}>
                  {props.links.map((link, index) => (
                    <Typography
                      variant="sideMenu"
                      color="blue400"
                      key={index}
                      paddingBottom={index + 1 === props.links.length ? 0 : 2}
                    >
                      <FocusableBox href={link.url}>{link.title}</FocusableBox>
                    </Typography>
                  ))}
                </div>

        </Box>
        </FocusLock>
    )

}