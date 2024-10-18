import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { useRef, useState } from 'react'
import { FormSystemInput } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'

interface Props {
  currentItem: FormSystemInput
}

export const Banknumber = ({ currentItem }: Props) => {
  const [banki, setBanki] = useState<string>('')
  const [hb, setHb] = useState<string>('')
  const [reikningur, setReikningur] = useState<string>('')
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
  ]

  const handleChange = (index: number, value: string) => {
    if (index === 0) {
      setBanki(value)
      if (value.length === 4) {
        if (inputRefs[1]?.current) {
          inputRefs[1]?.current.focus()
        }
      }
    } else if (index === 1) {
      setHb(value)
      if (value.length === 2) {
        if (inputRefs[2]?.current) {
          inputRefs[2]?.current.focus()
        }
      }
    } else if (index === 2) {
      if (value.length <= 6) {
        setReikningur(value)
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

  const { formatMessage } = useIntl()

  return (
    <Column>
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
            value={banki}
            maxLength={4}
            name=""
            onChange={(e) => handleChange(0, e.target.value)}
            onBlur={(e) => setBanki(addLeadingZeros(e.target.value, 4))}
            required={currentItem?.isRequired ?? false}
          />
        </Column>
        <Column span="2/12">
          <Input
            ref={
              inputRefs[1] as React.RefObject<
                HTMLInputElement | HTMLTextAreaElement
              >
            }
            label={formatMessage(m.ledger)}
            maxLength={2}
            type="number"
            value={hb}
            name=""
            onChange={(e) => handleChange(1, e.target.value)}
            onBlur={(e) => setHb(addLeadingZeros(e.target.value, 2))}
            required={currentItem?.isRequired ?? false}
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
            value={reikningur}
            name=""
            onChange={(e) => handleChange(2, e.target.value)}
            onBlur={(e) => setReikningur(addLeadingZeros(e.target.value, 6))}
            required={currentItem?.isRequired ?? false}
          />
        </Column>
      </Row>
    </Column>
  )
}
