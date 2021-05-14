import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, RadioButton } from '@island.is/island-ui/core'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { constituencyMapper } from './../../constants'
import { Constituencies } from '../../types'

const SIGNATURES = [
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
    selectedForSubmission: false
  },
  {
    date: '21.01.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalRegistry: '1991921335',
    address: 'Miðskógar 17',
    selectedForSubmission: false
  },
  {
    date: '21.01.2021',
    name: 'Stefán Haukdal',
    nationalRegistry: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: true,
    selectedForSubmission: false
  },
  {
    date: '21.01.2021',
    name: 'Brian Johannesen',
    nationalRegistry: '1991921335',
    address: 'Reykjavík',
    selectedForSubmission: false
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
    selectedForSubmission: false
  },
  {
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalRegistry: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
    selectedForSubmission: false
  },
]

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const [signatures, setSignatures] = useState(SIGNATURES)
  let [autoSelect, setAutoSelect] = useState(false)
  let [chooseManually, setChooseManually] = useState(false)
  const maxEndorsements = constituencyMapper[application.answers.constituency as Constituencies].high
  const autoSelectRadioLabel = 'Senda inn fyrstu ' + maxEndorsements

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>

      {signatures && signatures.length > 0 && (
        <Box>
          <Box
            marginTop={3}
            marginBottom={3}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
          >
            <RadioButton
              id="autoSelect"
              label={autoSelectRadioLabel}
              checked={!!autoSelect}
              onChange={() => {
                setAutoSelect(autoSelect = true)
                setChooseManually(chooseManually = false)
                signatures.map((s, i) => {
                  if(i <= maxEndorsements) { s.selectedForSubmission = true }
                })
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label='Valið af handahófi'
                checked={!!chooseManually}
                onChange={() => {
                  setAutoSelect(autoSelect = false)
                  setChooseManually(chooseManually = true)
                  signatures.map((s) => {
                    s.selectedForSubmission = false
                  })
                }}
              />
            </Box>
          </Box>

          <EndorsementTable application={application} signatures={signatures} />
        </Box>
      )}
    </Box>
  )
}

export default EndorsementListSubmission
