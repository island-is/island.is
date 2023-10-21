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
  headerElement: JSX.Element
  closeModal: () => void
  confirmation: () => void
  confirmationText: string
}

const ConfirmModal: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  return (
    <Modal isOpen={props.modalIsOpen} style={customStyles} ariaHideApp={false}>
      <div className="confirm-modal">
        {props.headerElement}

        <div className="confirm-modal__container__buttons">
          <div className="confirm-modal__container__button">
            <button
              type="button"
              onClick={props.closeModal}
              className="confirm-modal__button__cancel"
            >
              Cancel
            </button>
          </div>
          <div className="confirm-modal__container__button">
            <button
              type="button"
              onClick={props.confirmation}
              className="confirm-modal__button__delete"
            >
              {props.confirmationText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
