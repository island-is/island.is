import React, { useState, useCallback, FC } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { Table as T } from '@island.is/island-ui/core'

import { Box, Text, Button, GridRow, GridColumn, Columns, Column } from '@island.is/island-ui/core'
import * as styles from './ExpandableLine.treat'

interface Props {
  organization: object
}

const tableData = [
  [2202692289, "2019/08", "01.08.2019", "30.08.2019", "11.667 kr.", "1.402 kr.", "0 kr.", "0 kr.", "13.223 kr."],
  [2202692289, "2019/08", "01.08.2019", "30.08.2019", "11.667 kr.", "1.402 kr.", "0 kr.", "0 kr.", "13.223 kr."],
  [2202692289, "2019/08", "01.08.2019", "30.08.2019", "11.667 kr.", "1.402 kr.", "0 kr.", "0 kr.", "13.223 kr."],
]
const ExpandableLine: FC<Props> = ({
  organization,
}) => {

  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

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
          <GridColumn span={['1/1', '4/12']} order={[2, 1]}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={['flexEnd', 'flexStart']}
              height="full"
              paddingX={1}
              marginBottom={1}
            >
              <Text variant="small">
                {organization?.id}
              </Text>
            </Box>
          </GridColumn>
          <GridColumn
            span={['1/1', '4/12']}
            order={[2, 3]}
          >
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={1}
              paddingBottom={[1, 0]}
              overflow="hidden"
            >
              <Text variant="small">
                {organization?.name}
            </Text>
            </Box>
          </GridColumn>
          <GridColumn
            span={['1/1', '3/12']}
            order={[1, 3]}
          >
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={1}
              overflow="hidden"
            >
              <Text variant="small">{organization?.statusTotals}</Text>
            </Box>
          </GridColumn>
          <GridColumn
            span={['1/1', '1/12']}
            order={[1, 3]}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="full"
            >
              <Button
                circle
                colorScheme="light"
                icon={expanded ? "remove" : "add"}
                iconType="filled"
                onBlur={function noRefCheck() { }}
                onClick={() => toggleExpand(!expanded)}
                onFocus={function noRefCheck() { }}
                preTextIconType="filled"
                size="small"
                title="Go forward"
                type="button"
                variant="primary"
              />
            </Box>
          </GridColumn>
        </GridRow>
        <AnimateHeight
          onAnimationEnd={(props: { newHeight: number }) => handleAnimationEnd(props.newHeight)}
          duration={300}
          height={expanded ? 'auto' : 0}
        >
          <Box background="white" marginTop={[1, 3]}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Gjaldgrunnur</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Ár og tímabil</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Gjalddagi</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Eindagi</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Höfuðstóll</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Vextir</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Kostnaður</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Greiðslur</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text fontWeight="semiBold" variant="small">Staða</Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {
                  tableData.map((row, i) => (
                    <T.Row key={i}>
                      {
                        row.map((item, ii) => (
                          <T.Data key={ii}>
                            <Text variant="small">{item}</Text>
                          </T.Data>
                        ))
                      }
                    </T.Row>
                  ))
                }
              </T.Body>
            </T.Table>
            <Box
              padding={2}
              background="blue100"
            >
              <Columns>
                <Column width="content">
                  <Text fontWeight="semiBold" variant="small">
                    Tengiliða upplýsingar
                  </Text>
                </Column>
              </Columns>
              <Columns space={4}>
                <Column width="content">
                  <Text variant="small" as="span">
                    Heimasíða:
                  </Text>
                  {' '}
                  <a href="https://www.rsk.is" target="_blank">
                    <Text color="blue400" variant="small" as="span">
                      www.rsk.is
                      </Text>
                  </a>
                </Column>
                <Column width="content">
                  <Text variant="small" as="span">
                    Netfang:
                  </Text>
                  {' '}
                  <a href="https://www.rsk.is" target="_blank">
                    <Text color="blue400" variant="small" as="span">
                      rsk@rsk.is
                      </Text>
                  </a>
                </Column>
                <Column width="content">
                  <Text variant="small" as="span">
                    Sími:
                  </Text>
                  {' '}
                  <a href="https://www.rsk.is" target="_blank">
                    <Text color="blue400" variant="small" as="span">
                      +354 442 1250
                      </Text>
                  </a>
                </Column>
              </Columns>
            </Box>
          </Box>
        </AnimateHeight>
      </Box>
    </>
  )
}

export default ExpandableLine
