import React from 'react'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    minWidth: '25em',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

interface Props {
  modalIsOpen: boolean
  headerText: string
  closeModal: () => void
  handleButtonClicked: () => void
  buttonText: string
  infoText: string
}

const InfoModal: React.FC<React.PropsWithChildren<Props>> = (props: Props) => {
  return (
    <Modal isOpen={props.modalIsOpen} style={customStyles} ariaHideApp={false}>
      <div className="info-modal">
        <div className="info-modal__header">{props.headerText}</div>
        <div className="info-modal__info-text">{props.infoText}</div>

        <div className="info-modal__container__buttons">
          <div className="info-modal__container__button">
            <button
              type="button"
              onClick={props.handleButtonClicked}
              className="info-modal__button__ok"
            >
              {props.buttonText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InfoModal
