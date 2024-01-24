import { Box, Button, DatePicker, Input, Text } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { newCase } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RegularSignatureState } from '../../lib/types'
import cloneDeep from 'lodash/cloneDeep'

type Props = {
  state: RegularSignatureState
  setState: (state: RegularSignatureState) => void
  addSignature?: boolean
}

type EmptySignatureGroup = RegularSignatureState[0]

type EmptySignature = EmptySignatureGroup['members'][0]

type MemberKey = keyof RegularSignatureState[0]['members'][0]

type InstitutionKey = keyof Omit<RegularSignatureState[0], 'members'>

const emptySignature: EmptySignature = {
  textAbove: '',
  name: '',
  textBelow: '',
  textAfter: '',
}

const emptySignatureGroup: EmptySignatureGroup = {
  institution: '',
  date: '',
  members: [cloneDeep(emptySignature)],
}

export const RegularSignature = ({ state, setState }: Props) => {
  const { formatMessage: f, formatDateFns } = useLocale()

  const onChangeSignature = (
    groupIndex: number,
    signatureIndex: number,
    key: MemberKey,
    value: string,
  ) => {
    const newState = [...state]
    const group = newState[groupIndex]
    if (!group) return
    const signature = group.members[signatureIndex]
    if (!signature) return
    signature[key] = value
    group.members[signatureIndex] = signature
    newState[groupIndex] = group
    setState(newState)
  }

  const onRemoveSignature = (groupIndex: number, signatureIndex: number) => {
    // get the signature group
    const newState = [...state]
    const group = newState[groupIndex]
    if (!group) return
    group.members.splice(signatureIndex, 1)
    newState[groupIndex] = group
    setState(newState)
  }

  const onAddSignature = (groupIndex: number) => {
    const newState = [...state]
    const group = newState[groupIndex]
    if (!group) return
    group.members.push(cloneDeep(emptySignature))
    newState[groupIndex] = group
    setState(newState)
  }

  const onChangeSignatureGroup = (
    index: number,
    key: InstitutionKey,
    value: string,
  ) => {
    const newState = [...state]
    const group = newState[index]
    if (!group) return
    group[key] = value
    newState[index] = group
    setState(newState)
  }

  const onRemoveSignatureGroup = (index: number) => {
    const newState = [...state]
    newState.splice(index, 1)
    setState(newState)
  }

  const onAddSignatureGroup = () => {
    const newState = [...state, cloneDeep(emptySignatureGroup)]
    setState(newState)
  }

  return (
    <Box>
      {state.map((signatureGroup, index) => (
        <Box className={styles.signatureGroupWrapper} key={index}>
          <Box className={styles.signatureGroup}>
            <Input
              name={`institution-${index}`}
              label={f(newCase.inputs.signature.institution.label)}
              defaultValue={signatureGroup.institution}
              backgroundColor="blue"
              onChange={(e) =>
                onChangeSignatureGroup(index, 'institution', e.target.value)
              }
              size="sm"
            />
            <DatePicker
              name={`date-${index}`}
              label={f(newCase.inputs.signature.date.label)}
              placeholderText={f(newCase.inputs.signature.date.placeholder)}
              backgroundColor="blue"
              size="sm"
              selected={
                signatureGroup.date ? new Date(signatureGroup.date) : undefined
              }
              handleChange={(date) =>
                onChangeSignatureGroup(
                  index,
                  'date',
                  formatDateFns(date, 'dd. MMMM yyyy'),
                )
              }
            />
            {index > 0 && (
              <Box className={styles.removeInputGroup}>
                <Button
                  variant="utility"
                  icon="trash"
                  onClick={() => onRemoveSignatureGroup(index)}
                />
              </Box>
            )}
          </Box>
          <Box className={styles.wrapper}>
            <Text variant="h5" marginBottom={2}>
              {f(newCase.general.signedBy)}
            </Text>
            {signatureGroup.members.map((signature, i) => (
              <Box className={styles.inputGroup} key={`${index}-${i}`}>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={`textAbove-${index}-${i}`}
                    label={f(newCase.inputs.signature.textAbove.label)}
                    defaultValue={signature.textAbove}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeSignature(index, i, 'textAbove', e.target.value)
                    }
                  />
                  <Input
                    name={`name-${index}-${i}`}
                    label={f(newCase.inputs.signature.name.label)}
                    defaultValue={signature.name}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeSignature(index, i, 'name', e.target.value)
                    }
                  />
                </Box>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={`textAfter-${index}-${i}`}
                    label={f(newCase.inputs.signature.textAfter.label)}
                    defaultValue={signature.textAfter}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeSignature(index, i, 'textAfter', e.target.value)
                    }
                  />
                  <Input
                    name={`textBelow-${index}-${i}`}
                    label={f(newCase.inputs.signature.textBelow.label)}
                    defaultValue={signature.textBelow}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeSignature(index, i, 'textBelow', e.target.value)
                    }
                  />
                  {i > 0 && (
                    <Box className={styles.removeInputGroup}>
                      <Button
                        variant="utility"
                        icon="trash"
                        onClick={() => onRemoveSignature(index, i)}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <Box marginTop={2}>
              <Button
                size="small"
                icon="add"
                variant="utility"
                onClick={() => onAddSignature(index)}
              >
                {f(newCase.buttons.addPerson.label)}
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
      <Box marginTop={2}>
        <Button variant="utility" icon="add" onClick={onAddSignatureGroup}>
          {f(newCase.buttons.addInstitution.label)}
        </Button>
      </Box>
    </Box>
  )
}
