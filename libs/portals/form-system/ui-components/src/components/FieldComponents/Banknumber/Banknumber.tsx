import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useRef, useState } from 'react'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
  lang?: 'is' | 'en'
}

export const Banknumber = ({
  item,
  dispatch,
  hasError,
  lang = 'is',
}: Props) => {
  const [bank, setBank] = useState<string>('')
  const [ledger, setLedger] = useState<string>('')
  const [account, setAccount] = useState<string>('')
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
  ]
  const [value, setValue] = useState<string>(getValue(item, 'bankAccount') ?? '')
  const isInitialMount = useRef(true)

  const { formatMessage } = useIntl()

  const handleChange = (index: number, value: string) => {
    if (index === 0) {
      setBank(value)
      if (value.length === 4) {
        if (inputRefs[1]?.current) {
          inputRefs[1]?.current.focus()
        }
      }
    } else if (index === 1) {
      setLedger(value)
      if (value.length === 2) {
        if (inputRefs[2]?.current) {
          inputRefs[2]?.current.focus()
        }
      }
    } else if (index === 2) {
      if (value.length <= 6) {
        setAccount(value)
      }
      if (value.length === 6) {
        if (inputRefs[2]?.current) {
          inputRefs[2]?.current.blur()
        }
      }
    }
  }

  const addLeadingZeros = (originalNumber: string, max: number) => {
    const zerosToAdd = max - originalNumber.length
    if (zerosToAdd <= 0) {
      return originalNumber
    }
    if (originalNumber.length === 0) {
      return originalNumber
    }
    const leadingZeros = '0'.repeat(zerosToAdd)
    return leadingZeros + originalNumber
  }

  useEffect(() => {
    const combinedValue = `${bank}-${ledger}-${account}`
    setValue(combinedValue)
    if (!dispatch) return
    dispatch({
      type: 'SET_BANK_ACCOUNT',
      payload: { value: combinedValue, id: item.id },
    })
  }, [bank, ledger, account, dispatch, item.id])

  useEffect(() => {
    if (isInitialMount.current && value) {
      const parts = value.split('-')
      if (parts.length === 3) {
        setBank(parts[0])
        setLedger(parts[1])
        setAccount(parts[2])
      }
      isInitialMount.current = false
    }
  }, [value])

  return (
    <>
      <Row>
        <Text variant="h4">{item.name?.[lang]}</Text>
      </Row>
      <Row marginTop={2}>
        <Column span="4/12">
          <Input
            ref={
              inputRefs[0] as React.RefObject<
                HTMLInputElement | HTMLTextAreaElement
              >
            }
            label={formatMessage(m.bank)}
            type="number"
            value={bank}
            maxLength={4}
            name=""
            onChange={(e) => handleChange(0, e.target.value)}
            onBlur={(e) => setBank(addLeadingZeros(e.target.value, 4))}
            required={item?.isRequired ?? false}
            backgroundColor="blue"
            hasError={hasError}
          />
        </Column>
        <Column span="3/12">
          <Input
            ref={
              inputRefs[1] as React.RefObject<
                HTMLInputElement | HTMLTextAreaElement
              >
            }
            label={formatMessage(m.ledger)}
            maxLength={2}
            type="number"
            value={ledger}
            name=""
            onChange={(e) => handleChange(1, e.target.value)}
            onBlur={(e) => setLedger(addLeadingZeros(e.target.value, 2))}
            required={item?.isRequired ?? false}
            backgroundColor="blue"
            hasError={hasError}
          />
        </Column>
        <Column span="4/12">
          <Input
            ref={
              inputRefs[2] as React.RefObject<
                HTMLInputElement | HTMLTextAreaElement
              >
            }
            label={formatMessage(m.accountNumber)}
            type="number"
            value={account}
            name=""
            onChange={(e) => handleChange(2, e.target.value)}
            onBlur={(e) => setAccount(addLeadingZeros(e.target.value, 6))}
            required={item?.isRequired ?? false}
            backgroundColor="blue"
            hasError={hasError}
          />
        </Column>
      </Row>
    </>
  )
}
