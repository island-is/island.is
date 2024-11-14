import React from 'react'

import { Box, Divider, Link, Stack, Text } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import { InfoLine } from '@island.is/portals/my-pages/core'
import {
  LawAndOrderActionTypeEnum,
  LawAndOrderGroup,
} from '@island.is/api/schema'

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
          <>
            <Box marginTop={4} />
            {x.items?.map((y, i) => {
              return (
                <>
                  {x.label && i === 0 && (
                    <Text
                      variant="eyebrow"
                      color="purple400"
                      marginBottom={[0, 2]}
                    >
                      {x.label}
                    </Text>
                  )}
                  <InfoLine
                    loading={props.loading}
                    label={y.label ?? ''}
                    content={y.value ?? ''}
                    labelColumnSpan={['1/1', '5/12']}
                    valueColumnSpan={['1/1', '4/12']}
                    buttonColumnSpan={['3/12']}
                    renderContent={() =>
                      y.link ? (
                        <Link
                          underline="normal"
                          underlineVisibility="always"
                          href={y.link + y.value}
                          color="blue400"
                        >
                          {y.value}
                        </Link>
                      ) : (
                        <Text>{y.value}</Text>
                      )
                    }
                    button={
                      y.action?.type === LawAndOrderActionTypeEnum.url &&
                      y.action?.title &&
                      y.action.data
                        ? {
                            type: 'link',
                            to: y.action?.data,
                            label: y.action?.title,
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
