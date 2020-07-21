import React, { FC, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Columns,
  Column,
  Divider,
  Icon,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

const DocumentList: FC<{}> = () => {
  const [mockState, setMockState] = useState<
    'passive' | 'render' | 'do-not-render'
  >('passive')

  useEffect(() => {
    async function checkSomething() {
      await sleep(500)
      // setMockState('do-not-render')
      setMockState('render')
    }
    checkSomething()
  }, [])

  if (mockState === 'render') {
    return (
      <>
        <Box background="dark100" boxShadow="small">
          <Columns>
            <Column width="3/12">
              <Box padding={2}>
                <Typography variant="pSmall" as="p">
                  Dagsetning
                </Typography>
              </Box>
            </Column>
            <Column width="4/12">
              <Box padding={2}>
                <Typography variant="pSmall" as="p">
                  Útgefandi
                </Typography>
              </Box>
            </Column>
            <Column width="5/12">
              <Box padding={2}>
                <Typography variant="pSmall" as="p">
                  Skjal
                </Typography>
              </Box>
            </Column>
          </Columns>
        </Box>
        {[...Array(4)].map((_key, index) => (
          <div key={index}>
            <Columns>
              <Column width="3/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    19.03.2020
                  </Typography>
                </Box>
              </Column>
              <Column width="4/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    Þjóðskrá
                  </Typography>
                </Box>
              </Column>
              <Column width="5/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    Skuldleysisvottorð
                  </Typography>
                </Box>
              </Column>
            </Columns>
            <Divider />
          </div>
        ))}
        <Box marginTop={3} textAlign="right">
          <Link to="/rafraen-skjol">
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Typography variant="tag" color="blue400">
                Fara í rafræn skjöl
              </Typography>
              <Box marginLeft={1}>
                <Icon type="arrowRight" width="10" height="10" fill="blue400" />
              </Box>
            </Box>
          </Link>
        </Box>
      </>
    )
  }

  return null
}

export default DocumentList
