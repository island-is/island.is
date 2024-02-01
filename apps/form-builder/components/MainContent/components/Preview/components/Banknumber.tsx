import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { useRef, useState } from 'react'

export default function Banknumber() {
  const [banki, setBanki] = useState<number>()
  const [hb, setHb] = useState<number>()
  const [reikningur, setReikningur] = useState<number>()
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
    useRef<HTMLInputElement | HTMLTextAreaElement>(),
  ]

  const handleChange = (index: number, value) => {
    if (index === 0) {
      setBanki(value)
      if (value.length === 4) {
        inputRefs[1]?.current.focus()
      }
    } else if (index === 1) {
      setHb(value)
      if (value.length === 2) {
        inputRefs[2]?.current.focus()
      }
    } else if (index === 2) {
      if (value.length <= 6) {
        setReikningur(value)
      }
      if (value.length === 6) {
        inputRefs[2]?.current.blur()
      }
    }
  }

  const addLeadingZeros = (originalNumber, total) => {
    const zerosToAdd = total - originalNumber.length
    if (zerosToAdd <= 0) {
      return originalNumber
    }
    if (originalNumber.length === 0) {
      return originalNumber
    }
    const leadingZeros = '0'.repeat(zerosToAdd)
    return leadingZeros + originalNumber
  }

  return (
    <Row marginTop={2}>
      <Column span="4/12">
        <Input
          ref={inputRefs[0]}
          label="Banki"
          type="number"
          value={banki}
          maxLength={4}
          name=""
          onChange={(e) => handleChange(0, e.target.value)}
          onBlur={(e) => setBanki(addLeadingZeros(e.target.value, 4))}
        />
      </Column>
      <Column span="2/12">
        <Input
          ref={inputRefs[1]}
          label="Hb"
          maxLength={2}
          type="number"
          value={hb}
          name=""
          onChange={(e) => handleChange(1, e.target.value)}
          onBlur={(e) => setHb(addLeadingZeros(e.target.value, 2))}
        />
      </Column>
      <Column span="4/12">
        <Input
          ref={inputRefs[2]}
          label="Reikningsnúmer"
          type="number"
          value={reikningur}
          name=""
          onChange={(e) => handleChange(2, e.target.value)}
          onBlur={(e) => setReikningur(addLeadingZeros(e.target.value, 6))}
        />
      </Column>
    </Row>
  )
}
