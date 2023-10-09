/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'

interface Props {
  handleButtonClosed?: () => void
  title?: string
  showOverlay: boolean
}

const Overlay: React.FC<React.PropsWithChildren<Props>> = ({
  handleButtonClosed,
  title,
  showOverlay,
  children,
}) => {
  const [show, setShow] = useState<boolean>(showOverlay)
  return (
    <div className={`overlay ${show ? 'show' : 'hidden'}`}>
      <h3 className={`${title ? 'show' : 'hidden'}`}>{title}</h3>
      <div className="overlay__container__content">
        <a
          className="users__container__button__close"
          onClick={() => setShow(!show)}
        >
          &times;
        </a>
        <div className="step-end__content">{children}</div>
      </div>
    </div>
  )
}

export default Overlay
