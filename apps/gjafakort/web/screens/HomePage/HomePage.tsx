import React, { useState } from 'react'
import gql from 'graphql-tag'

import { Application } from '../../graphql/schema'
import { withApollo } from '../../graphql'
import { useI18n } from '../../i18n'
import {
  Box,
  Input,
  Select,
  Typography,
  Checkbox,
  ContentBlock,
} from '@island.is/island-ui/core'

interface PropTypes {
  application: Application
}

const GetApplicationQuery = gql`
  query GetApplication {
    getApplication(ssn: "2101932009") {
      id
    }
  }
`

function HomePage({ application }: PropTypes) {
  const { t } = useI18n()
  const [checkbox, setCheckbox] = useState(false)
  return (
    <ContentBlock width="large">
      <Typography variant="eyebrow">Hi yo whatup</Typography>
      <h1>
        {t('intro.welcome')} {application.id}
      </h1>
      <Box paddingY={[1, 2, 3]}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t1" />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t2" disabled />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Input
          label="Nafn tengiliðar"
          placeholder="test"
          name="t3"
          value="test"
          disabled
        />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Input label="Nafn tengiliðar" placeholder="test" name="t4" hasError />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Input
          label="Nafn tengiliðar"
          placeholder="test"
          name="t5"
          hasError
          errorMessage="obbosí"
        />
      </Box>
      <Box paddingY={[1, 2, 3]}>
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
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Select
          name="s2"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[]}
          noOptionsMessage="Enginn valmöguleiki"
        />
      </Box>
      <Box paddingY={[1, 2, 3]}>
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
      </Box>
      <Box paddingY={['gutter', 1, 2, 3]}>
        <Select
          disabled
          name="s2"
          label="Tegund fyrirtækis"
          placeholder="Veldu tegund"
          options={[]}
        />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Checkbox
          name="c1"
          label="Hér er einn möguleiki sem hægt er að velja"
          onChange={(e) => {
            setCheckbox(e.target.checked)
          }}
          checked={checkbox}
        />
      </Box>
      <Box paddingY={[1, 2, 3]}>
        <Checkbox name="c1" label="Og þessi er valinn" checked />
      </Box>
      <div style={{ marginBottom: 500 }}></div>
    </ContentBlock>
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
