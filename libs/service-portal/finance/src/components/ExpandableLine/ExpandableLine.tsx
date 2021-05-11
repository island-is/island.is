import React, { useState, useCallback, FC } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { Table as T } from '@island.is/island-ui/core'
import { FinanceStatusOrganizationType } from '../../screens/FinanceStatus/FinanceStatusData.types'

import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  Columns,
  Column,
  GridContainer,
} from '@island.is/island-ui/core'
import * as styles from './ExpandableLine.treat'

interface Props {
  organization: FinanceStatusOrganizationType
}

const ExpandableLine: FC<Props> = ({ organization }) => {
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  const currencyKr = (kr: number) =>
    typeof kr === 'number' ? `${kr.toLocaleString('de-DE')} kr.` : ''

  return (
    <>
      <Box
        background={closed && !expanded ? 'transparent' : 'blue100'}
        className={cn(styles.line, {
          [styles.sideLine]: closed && !expanded,
        })}
        paddingY={2}
        paddingX={1}
      >
        <GridRow>
          <GridColumn span={'4/12'}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={['flexEnd', 'flexStart']}
              height="full"
              paddingX={1}
              marginBottom={1}
            >
              <Text variant="small">{organization.id}</Text>
            </Box>
          </GridColumn>
          <GridColumn span={'4/12'}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={1}
              paddingBottom={[1, 0]}
              overflow="hidden"
            >
              <Text variant="small">{organization.name}</Text>
            </Box>
          </GridColumn>
          <GridColumn span={'3/12'}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={1}
              overflow="hidden"
            >
              <Text variant="small">
                {currencyKr(organization.statusTotals)}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '1/12']}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="full"
            >
              <Button
                circle
                colorScheme="light"
                icon={expanded ? 'remove' : 'add'}
                iconType="filled"
                onBlur={function noRefCheck() {}}
                onClick={() => toggleExpand(!expanded)}
                onFocus={function noRefCheck() {}}
                preTextIconType="filled"
                size="small"
                title="Sundurliðun"
                type="button"
                variant="primary"
              />
            </Box>
          </GridColumn>
        </GridRow>
        <AnimateHeight
          onAnimationEnd={(props: { newHeight: number }) =>
            handleAnimationEnd(props.newHeight)
          }
          duration={300}
          height={expanded ? 'auto' : 0}
        >
          <Box background="white" marginTop={[1, 3]}>
            <T.Table>
              <T.Head>
                <T.Row>
                  {[
                    'Gjaldgrunnur',
                    'Ár og tímabil',
                    'Gjalddagi',
                    'Eindagi',
                    'Höfuðstóll',
                    'Vextir',
                    'Kostnaður',
                    'Greiðslur',
                    'Staða',
                  ].map((item, i) => (
                    <T.HeadData key={i} text={{ truncate: true }}>
                      <Text fontWeight="semiBold" variant="small">
                        {item}
                      </Text>
                    </T.HeadData>
                  ))}
                </T.Row>
              </T.Head>
              <T.Body>
                {organization.chargeTypes.map((row) => (
                  <T.Row key={row.id}>
                    {[
                      '---',
                      '---',
                      '---',
                      '---',
                      currencyKr(row.principal),
                      currencyKr(row.interest),
                      currencyKr(row.cost),
                      currencyKr(row.dueTotals),
                      currencyKr(row.totals),
                    ].map((item, i) => (
                      <T.Data key={i} text={{ truncate: true }}>
                        <Text variant="small">{item}</Text>
                      </T.Data>
                    ))}
                  </T.Row>
                ))}
              </T.Body>
            </T.Table>
            <Box padding={2} background="blue100">
              <Columns>
                <Column width="content">
                  <Text fontWeight="semiBold" variant="small">
                    Tengiliða upplýsingar
                  </Text>
                </Column>
              </Columns>
              <Box>
                {organization.homepage && (
                  <Box display="inlineBlock" marginRight={2}>
                    <Text variant="small" as="span">
                      Heimasíða:
                    </Text>{' '}
                    <a href={`//${organization.homepage}`} target="_blank">
                      <Text color="blue400" variant="small" as="span">
                        {organization.homepage}
                      </Text>
                    </a>
                  </Box>
                )}
                {organization['e-mail'] && (
                  <Box display="inlineBlock" marginRight={2}>
                    <Text variant="small" as="span">
                      Netfang:
                    </Text>{' '}
                    <a
                      href={`mailto:${organization['e-mail']}`}
                      target="_blank"
                    >
                      <Text color="blue400" variant="small" as="span">
                        {organization['e-mail']}
                      </Text>
                    </a>
                  </Box>
                )}
                {/* TODO: Format tel display and href?? */}
                {organization.phone && (
                  <Box display="inlineBlock">
                    <Text variant="small" as="span">
                      Sími:
                    </Text>{' '}
                    <a href={`tel:${organization.phone}`} target="_blank">
                      <Text color="blue400" variant="small" as="span">
                        {organization.phone}
                      </Text>
                    </a>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </AnimateHeight>
      </Box>
    </>
  )
}

export default ExpandableLine
