import React, { useState } from 'react'
import gql from 'graphql-tag'

import { Application } from '../../graphql/schema'
import { withApollo } from '../../graphql'
import { useI18n } from '../../i18n'
import {
  GridContainer,
  Input,
  Select,
  Typography,
  Checkbox,
} from '@island.is/gjafakort-ui'

interface PropTypes {
  application: Application
}

const GetApplicationQuery = gql`
  query GetApplication {
    getApplication {
      id
    }
  }
`

function HomePage({ application }: PropTypes) {
  const { t } = useI18n()
  const [checkbox, setCheckbox] = useState(false)
  return (
    <GridContainer>
      <Typography variant="eyebrow">Hi yo whatup</Typography>
      <h1>
        {t('intro.welcome')} {application.id}
      </h1>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t1" />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t2" disabled />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Input
          label="Nafn tengiliðar"
          placeholder="test"
          name="t3"
          value="test"
          disabled
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t4" hasError />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Input
          label="Nafn tengiliðar"
          placeholder="test"
          name="t5"
          hasError
          errorMessage="obbosí"
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Select
          name="s1"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[
            {
              label: 'Ferðaskipuleggjandi',
              value: '0',
            },
            {
              label: 'Ferðaskrifstofa',
              value: '1',
            },
            {
              label: 'Safn á hover',
              value: '2',
            },
            {
              label: 'Veitingastaður',
              value: '3',
            },
          ]}
          noOptionsMessage="Enginn valmöguleiki"
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Select
          name="s2"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[]}
          noOptionsMessage="Enginn valmöguleiki"
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Select
          disabled
          name="s2"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[
            {
              label: 'Ferðaskipuleggjandi',
              value: '0',
            },
            {
              label: 'Ferðaskrifstofa',
              value: '1',
            },
            {
              label: 'Safn á hover',
              value: '2',
            },
            {
              label: 'Veitingastaður',
              value: '3',
            },
          ]}
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Select
          disabled
          name="s2"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[]}
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Checkbox
          name="c1"
          label="Hér er einn möguleiki sem hægt er að velja"
          onChange={(e) => {
            setCheckbox(e.target.checked)
          }}
          checked={checkbox}
        />
      </div>
      <div style={{ paddingTop: 25, paddingBottom: 25 }}>
        <Checkbox name="c1" label="Og þessi er valinn" checked />
      </div>
      <div style={{ marginBottom: 500 }}></div>
    </GridContainer>
  )
}

HomePage.getInitialProps = async ({ apolloClient }) => {
  const {
    data: { getApplication: application },
  } = await apolloClient.query({
    query: GetApplicationQuery,
  })

  return { application }
}

export default withApollo(HomePage)
