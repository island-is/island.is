/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { isValidElement, useEffect, useState } from 'react'

interface Props {
  helpText: string
  pattern: string
  setVisible: boolean
  onVisibleChange(visible: boolean): void
  isValid: boolean | null
  patternText?: string
}

const HintBox: React.FC<React.PropsWithChildren<Props>> = (props: Props) => {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    setShow(props.setVisible)
  }, [props.setVisible])

  return (
    <div className="hintbox">
      <div className={`hintbox__content ${show === true ? 'show' : 'hidden'}`}>
        <a
          className="hintbox__content__button__close"
          onClick={() => props.onVisibleChange(false)}
        >
          &times;
        </a>
        <p
          className={`hintbox__help-text${
            props.isValid ? ' valid' : ' invalid'
          }`}
        >
          {props.helpText}
        </p>
        <p
          className={`hintbox__pattern-text${
            props.patternText ? '' : ' hidden'
          }`}
        >
          {props.patternText}
        </p>
        <p className={`hintbox__pattern${props.pattern ? '' : ' hidden'}`}>
          {props.pattern}
        </p>
      </div>
    </div>
  )
}
export default HintBox
