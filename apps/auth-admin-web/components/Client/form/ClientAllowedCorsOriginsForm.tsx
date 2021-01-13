import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientAllowedCorsOriginDTO } from '../../../entities/dtos/client-allowed-cors-origin.dto'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'

interface Props {
  clientId: string
  defaultOrigin?: string
  origins?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

interface FormOutput {
  origin: string
}

const ClientAllowedCorsOriginsForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientAllowedCorsOriginDTO
  >()
  const { isSubmitting } = formState
  const [defaultOrigin, setDefaultOrigin] = useState(
    !props.origins || props.origins.length === 0 ? props.defaultOrigin : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [corsOriginToRemove, setCorsOriginToRemove] = React.useState('')

  const add = async (data: FormOutput) => {
    const allowedCorsOrigin = new ClientAllowedCorsOriginDTO()
    allowedCorsOrigin.clientId = props.clientId
    allowedCorsOrigin.origin = data.origin

    const response = await ClientService.addAllowedCorsOrigin(allowedCorsOrigin)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
      setDefaultOrigin('')
      document.getElementById('corsForm').reset()
    }
  }

  const remove = async () => {
    const response = await ClientService.removeAllowedCorsOrigin(
      props.clientId,
      corsOriginToRemove,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeModal()
  }

  const confirmRemove = async (name: string) => {
    setCorsOriginToRemove(name)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this cors origin:{' '}
        <span>{corsOriginToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-allowed-cors-origin">
        <div className="client-allowed-cors-origin__wrapper">
          <div className="client-allowed-cors-origin__container">
            <h1>Enter allowed cors origins</h1>
            <div className="client-allowed-cors-origin__container__form">
              <div className="client-allowed-cors-origin__help">
                Cross-Origin Resource Sharing (CORS) is an HTTP-header based
                mechanism that allows a server to indicate any other origins
                (domain, scheme, or port) than its own from which a browser
                should permit loading of resources.
              </div>
              <form id="corsForm" onSubmit={handleSubmit(add)}>
                <div className="client-allowed-cors-origin__container__fields">
                  <div className="client-allowed-cors-origin__container__field">
                    <label className="client-allowed-cors-origin__label">
                      Allow cors origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      ref={register({ required: true })}
                      defaultValue={defaultOrigin}
                      className="client-allowed-cors-origin__input"
                      placeholder="https://localhost:4200"
                      title="Enter an allowed cors origin"
                    />
                    <HelpBox helpText="Enter an allowed cors origin" />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="origin"
                      message="Cors origin is required"
                    />
                    <input
                      type="submit"
                      className="client-allowed-cors-origin__button__add"
                      disabled={isSubmitting}
                      value="Add"
                    />
                  </div>
                </div>

                <NoActiveConnections
                  title="No active cors origins"
                  show={!props.origins || props.origins.length === 0}
                  helpText="Define a cors origin and push the Add button to add a cors origin"
                ></NoActiveConnections>

                <div
                  className={`client-allowed-cors-origin__container__list ${
                    props.origins && props.origins.length > 0
                      ? 'show'
                      : 'hidden'
                  }`}
                >
                  <h3>Allowed cors origins</h3>
                  {props.origins?.map((origin: string) => {
                    return (
                      <div
                        className="client-allowed-cors-origin__container__list__item"
                        key={origin}
                      >
                        <div className="list-value">{origin}</div>
                        <div className="list-remove">
                          <button
                            type="button"
                            onClick={() => confirmRemove(origin)}
                            className="client-allowed-cors-origin__container__list__button__remove"
                            title="Remove"
                          >
                            <i className="icon__delete"></i>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="client-allowed-cors-origin__buttons__container">
                  <div className="client-allowed-cors-origin__button__container">
                    <button
                      type="button"
                      className="client-allowed-cors-origin__button__cancel"
                      onClick={props.handleBack}
                    >
                      Back
                    </button>
                  </div>
                  <div className="client-allowed-cors-origin__button__container">
                    <button
                      type="button"
                      className="client-allowed-cors-origin__button__save"
                      onClick={props.handleNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText="Delete"
      ></ConfirmModal>
    </div>
  )
}
export default ClientAllowedCorsOriginsForm
