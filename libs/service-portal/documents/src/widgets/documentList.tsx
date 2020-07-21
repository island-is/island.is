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
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

const userDocuments = [
  { date: '19.03.2020', title: 'Þjóðskrá', document: 'Skuldleysisvottorð' },
  { date: '25.05.2020', title: 'Þjóðskrá', document: 'Skuldleysisvottorð' },
  { date: '07.08.2020', title: 'Þjóðskrá', document: 'Skuldleysisvottorð' },
  { date: '19.11.2020', title: 'Þjóðskrá', document: 'Skuldleysisvottorð' },
]

const companyDocuments = [
  { date: '19.03.2020', title: 'Ríkisskattstjóri', document: 'Launaseðill' },
  { date: '25.05.2020', title: 'Ríkisskattstjóri', document: 'Launaseðill' },
]

const DocumentList = () => {
  const [{ activeSubjectId }] = useStore()
  const [mockState, setMockState] = useState<'passive' | 'render'>('passive')

  useEffect(() => {
    setMockState('passive')
    async function checkSomething() {
      await sleep(500)
      // setMockState('do-not-render')
      setMockState('render')
    }
    checkSomething()
  }, [activeSubjectId])

  const documents =
    activeSubjectId === '5401482231' ? companyDocuments : userDocuments

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
        {documents.map((document, index) => (
          <div key={index}>
            <Columns>
              <Column width="3/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    {document.date}
                  </Typography>
                </Box>
              </Column>
              <Column width="4/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    {document.title}
                  </Typography>
                </Box>
              </Column>
              <Column width="5/12">
                <Box padding={2}>
                  <Typography variant="pSmall" as="p">
                    {document.document}
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
