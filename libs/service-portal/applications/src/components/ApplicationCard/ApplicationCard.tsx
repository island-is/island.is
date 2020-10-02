import React, { FC } from 'react'
import {
  Box,
  Stack,
  Inline,
  Icon,
  Typography,
  Tag,
  Button,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import * as styles from './ApplicationCard.treat'
import ProgressBar from '../ProgressBar/ProgressBar'

interface Props {
  name: string
  date: string
  isComplete: boolean
  url: string
  progress: number
}

const ApplicationCard: FC<Props> = ({
  name,
  date,
  isComplete,
  url,
  progress,
}) => {
  return (
    <Box
      className={styles.wrapper}
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
    >
      <Stack space={1}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={1}
        >
          <Inline space={2} alignY="bottom">
            <Icon type="article" width={24} height={24} />
            <Typography variant="h3">{name}</Typography>
          </Inline>
          <Tag variant={isComplete ? 'mint' : 'purple'}>
            {status ? 'Lokið' : 'Í ferli'}
          </Tag>
        </Box>
        <Typography variant="p">
          {`Þú hefur ${
            !status ? 'ekki ' : ''
          } lokið umsóknarferli fyrir ${name}`}
        </Typography>
        <Columns space={8} alignY="center">
          <Column width="8/12">
            <ProgressBar progress={progress} />
          </Column>
          <Column width="4/12">
            <Box display="flex" justifyContent="flexEnd">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button variant="text">
                  {status ? 'Skoða umsókn' : 'Halda áfram'}
                </Button>
              </a>
            </Box>
          </Column>
        </Columns>
      </Stack>
    </Box>
  )
}

export default ApplicationCard
