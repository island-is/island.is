import React from 'react'

import { Box, Divider, Link, Stack, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { UserInfoLine } from '@island.is/service-portal/core'
import { LawAndOrderGroup } from '@island.is/api/schema'
import * as styles from './InfoLines.css'

interface Props {
  groups: Array<LawAndOrderGroup>
  loading?: boolean
}

const InfoLines: React.FC<React.PropsWithChildren<Props>> = (props) => {
  useNamespaces('sp.law-and-order')

  return (
    <Stack space={1}>
      {props.groups.map((x) => {
        return (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            <Box marginTop={4} />
            {x.items?.map((y, i) => {
              return (
                <>
                  <UserInfoLine
                    loading={props.loading}
                    title={x.label && i === 0 ? x.label : undefined}
                    label={y.label ?? ''}
                    content={y.value ?? ''}
                    renderContent={() =>
                      y.link ? (
                        <Link
                          underline="normal"
                          underlineVisibility="always"
                          href={y.link + y.value}
                          color="blue400"
                          className={styles.link}
                        >
                          {y.value}
                        </Link>
                      ) : (
                        <Text>{y.value}</Text>
                      )
                    }
                    labelColumnSpan={['1/1', '6/12']}
                    valueColumnSpan={
                      y.action?.title ? ['1/1', '3/12'] : ['1/1', '6/12']
                    }
                    editLink={
                      y.action?.type !== 'popup' &&
                      y.action?.title &&
                      y.action.data
                        ? {
                            title: y.action?.title,
                            url: y.action?.data ?? '',
                            icon: 'arrowForward',
                          }
                        : undefined
                    }
                  />
                  <Divider />
                </>
              )
            })}
          </>
        )
      })}
    </Stack>
  )
}

export default InfoLines
