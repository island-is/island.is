import React, { FC } from 'react'
import * as styles from './Location.treat'
import {
  Box,
  Typography,
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  Logo,
} from '@island.is/island-ui/core'

export interface LocationProps {
  title: string
  subTitle: string
  address: string
  link?: { url: string; text: string }
  background: { url: string }
}

export const Location: FC<LocationProps> = ({
  title,
  subTitle,
  address,
  link,
  background,
}) => {
  return (
    <div className={styles.container}>
      {console.log(title, background, subTitle, link)}
{background &&      <Box
        className={styles.background}
        style={{ backgroundImage: `url(${background.url})` }}
      >
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '4/12', '3/12']}
              offset={['0', '0', '0', '1/12']}
            >
              <Box
                borderRadius="large"
                overflow="hidden"
                className={styles.content}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className={styles.image}
                >
                  <Logo iconOnly width={116} solid solidColor="white" />
                </Box>
                <Box padding={3} background="white">
                  <Stack space={1}>
                    <div>
                      {title && (
                        <Typography variant="h4" as="h4">
                          {title}
                        </Typography>
                      )}
                      {subTitle && (
                        <Typography variant="p">{subTitle}</Typography>
                      )}
                    </div>
                    {address && (
                      <div>
                        {address
                          .split(/\r\n|\r|\n/g)
                          .filter(Boolean)
                          .map((line, i) => (
                            <Typography key={i} variant="pSmall">
                              {line}
                            </Typography>
                          ))}
                      </div>
                    )}
                    {link && (
                      <a href={link.url}>
                        <Typography variant="eyebrow" as="span" color="blue400">
                          {link.text}
                        </Typography>
                      </a>
                    )}
                  </Stack>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
  }  </div>
  )
}
