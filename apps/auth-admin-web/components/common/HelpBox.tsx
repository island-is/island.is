/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'

interface Props {
  helpText: string
  helpLink?: string
  helpLinkText?: string
}

const HelpBox: React.FC<React.PropsWithChildren<Props>> = (props: Props) => {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (show) {
      document.getElementById(props.helpText).focus()
    }
  }, [show])

  const getHelpLink = (): JSX.Element => {
    if (props.helpLink && props.helpLinkText) {
      return (
        <div className="helpLink">
          <a href={props.helpLink} target="_blank" rel="noreferrer">
            {props.helpLinkText}
          </a>
        </div>
      )
    } else if (props.helpLink) {
      return (
        <div className="helpLink">
          <a href={props.helpLink} target="_blank" rel="noreferrer">
            More Info
          </a>
          .
        </div>
      )
    }
    return <div></div>
  }

  return (
    <div className="helpbox">
      <a
        className="helpbox__button__show"
        onClick={() => setShow(true)}
        title={props.helpText}
      >
        <i className="icon__info"></i>
        <span>Info</span>
      </a>
      <div className={`helpbox__content ${show === true ? 'show' : 'hidden'}`}>
        <input
          id={props.helpText}
          onBlur={() => setShow(false)}
          className="fake-input"
        />

        <a
          className="helpbox__content__button__close"
          onClick={() => setShow(false)}
        >
          &times;
        </a>
        {props.helpText}
        {getHelpLink()}
      </div>
    </div>
  )
}
export default HelpBox
