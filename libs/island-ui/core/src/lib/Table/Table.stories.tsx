import React from 'react'

import * as T from './Table'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import { Button } from '../Button/Button'

const { Table, Head, Row, HeadData, Body, Data } = T

const description = `
Table elements are nested inside the \`Table\` import

\`\`\`jsx
import { Table as T } from '@island.is/island-ui/core'

<T.Table>
  <T.Head>
    <T.Row>
      <T.HeadData>Header</T.HeadData>
    </T.Row>
  </T.Head>
  <T.Body>
    <T.Row>
      <T.Data>Data</T.Data>
    </T.Row>
  </T.Body>
  <T.Foot>
    <T.Row>
      <T.Data>Foot</T.Data>
    </T.Row>
  </T.Foot>
</T.Table>
\`\`\`
`

export default {
  title: 'Core/Table',
  component: Table,
  subcomponents: T,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
}

const dummy = [
  {
    school: 'Menntamálaráðuneytið',
    programme: 'Kennararéttindi',
    date: '2010-09-01',
  },
  {
    school: 'Viðskiptaráð',
    programme: 'Próf í verðbréfaviðskiptum',
    date: '2005-05-25',
  },
  {
    school: 'Menntamálaráðuneytið',
    programme: 'Kennararéttindi',
    date: '2010-09-01',
  },
  {
    school: 'Viðskiptaráð',
    programme: 'Próf í verðbréfaviðskiptum',
    date: '2005-05-25',
  },
  {
    school: 'Menntamálaráðuneytið',
    programme: 'Kennararéttindi',
    date: '2010-09-01',
  },
  {
    school: 'Viðskiptaráð',
    programme: 'Próf í verðbréfaviðskiptum',
    date: '2005-05-25',
  },
]

export const BasicTable = () => {
  return (
    <Table>
      <Head>
        <Row>
          <HeadData>Skóli</HeadData>
          <HeadData>Námsbraut</HeadData>
          <HeadData>Dagsetning</HeadData>
          <HeadData box={{ textAlign: 'right' }}>Skjöl</HeadData>
        </Row>
      </Head>
      <Body>
        {dummy.map((license, index) => (
          <Row key={index}>
            <Data>{license.school}</Data>
            <Data>{license.programme}</Data>
            <Data>{license.date}</Data>
            <Data
              box={{
                textAlign: 'right',
                paddingTop: 'none',
                paddingBottom: 'none',
              }}
            >
              <DropdownMenu
                disclosure={
                  <Button
                    icon="ellipsisVertical"
                    circle
                    colorScheme="negative"
                    title="Aðgerðir"
                    inline
                  />
                }
                items={[
                  {
                    title: 'Sækja',
                    onClick: () => {
                      console.log('sækja')
                    },
                  },
                  {
                    title: 'Deila',
                    onClick: () => {
                      console.log('deila')
                    },
                  },
                  {
                    title: 'Skoða',
                    onClick: () => {
                      console.log('skoða')
                    },
                  },
                ]}
              />
            </Data>
          </Row>
        ))}
      </Body>
    </Table>
  )
}
