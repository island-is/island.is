import React from 'react'

interface Props {
  handleButtonFinishedClick?: () => void
  buttonText: string
  title: string
}

const StepEnd: React.FC<React.PropsWithChildren<Props>> = ({
  handleButtonFinishedClick,
  buttonText,
  title,
  children,
}) => {
  return (
    <div className="step-end">
      <h1>{title}</h1>
      <div className="step-end__container__form">
        <div className="step-end__content">{children}</div>
        <div className="step-end__buttons__container">
          <div className="step-end__button__container">
            <button
              type="button"
              title={buttonText}
              className="step-end__button__finish"
              onClick={handleButtonFinishedClick}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepEnd
