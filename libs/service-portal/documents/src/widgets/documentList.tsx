import React, { FC, useState, useEffect } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

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
        <Typography variant="h3" as="h3">
          Rafræn skjöl
        </Typography>
        <Box border="standard" padding={2} marginTop={1}>
          <Typography variant="h3" as="h3">
            Greiðsluseðill (Bifr.gjöld) - Ríkissjóðsinnheimtur
          </Typography>
        </Box>
      </>
    )
  }

  return null
}

export default DocumentList
