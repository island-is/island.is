import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
  Link,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './Files.treat'
import cn from 'classnames'
import { calcDifferenceInDate, getFileType } from '../../utils/formHelper'
import { ApplicationFile } from '@island.is/financial-aid/shared'

interface Props {
  heading?: string
  filesArr: ApplicationFile[]
}

const Files: React.FC<Props> = ({ heading, filesArr }) => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <Box>
      {' '}
      <Text variant="eyebrow" marginBottom={1}>
        {heading}
      </Text>
      {filesArr && (
        <>
          {filesArr.map((item) => {
            let sizeInKilo = Math.floor(item.size / 1000)

            return (
              <a
                href={item.name}
                target="_blank"
                className={styles.filesLink}
                download
              >
                <div className={styles.container}>
                  <div className={styles.type}>
                    <Text color="dark300" fontWeight="semiBold" variant="small">
                      {getFileType(item.name)}
                    </Text>
                  </div>
                  <div className={styles.name}>
                    <Text variant="small">{item.name}</Text>
                  </div>
                  <Text variant="small">{`Skjal • ${sizeInKilo} KB`}</Text>
                  <Text variant="small"> {`${item.created}`}</Text>
                </div>
              </a>
            )
          })}
        </>
      )}
    </Box>
  )
}

export default Files
