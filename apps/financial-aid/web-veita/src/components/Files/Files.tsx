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

interface Props {
  heading?: string
  filesArr?: [string]
  className?: string
}

const Files: React.FC<Props> = ({ heading, filesArr, className }) => {
  const router = useRouter()
  // const { isAuthenticated, setUser, user } = useContext(UserContext)

  return (
    <Box className={cn({ [`${className}`]: true })}>
      {' '}
      <Text variant="eyebrow" marginBottom={1}>
        {heading}
      </Text>
      {filesArr && (
        <>
          {filesArr.map((item, index) => {
            return (
              <a
                aria-label={item}
                href={item}
                target="_blank"
                className={styles.filesLink}
                key={'files-' + index}
                // download
              >
                <div className={styles.container}>
                  <div className={styles.type}>
                    <Text color="dark300" fontWeight="semiBold" variant="small">
                      {getFileType(item)}
                    </Text>
                  </div>
                  <div className={styles.name}>
                    <Text variant="small">{item}</Text>
                  </div>
                  <Text variant="small">Skjal • 184 KB</Text>
                  <Text variant="small">45 mínútur</Text>
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
