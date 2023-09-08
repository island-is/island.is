import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientAllowedCorsOriginDTO } from '../../../entities/dtos/client-allowed-cors-origin.dto'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
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

const ClientAllowedCorsOriginsForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } =
    useForm<ClientAllowedCorsOriginDTO>()
  const { isSubmitting, errors } = formState
  const [defaultOrigin, setDefaultOrigin] = useState(
    !props.origins || props.origins.length === 0 ? props.defaultOrigin : '',
  )
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [corsOriginToRemove, setCorsOriginToRemove] = React.useState('')
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientAllowedCorsOriginsForm'),
  )

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
      const form = document.getElementById('corsForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
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
        {localization.removeConfirmation}:<span>{corsOriginToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <div className="client-allowed-cors-origin">
        <div className="client-allowed-cors-origin__wrapper">
          <div className="client-allowed-cors-origin__container">
            <h1>{localization.title}</h1>
            <div className="client-allowed-cors-origin__container__form">
              <div className="client-allowed-cors-origin__help">
                {localization.help}
              </div>
              <form id="corsForm" onSubmit={handleSubmit(add)}>
                <div className="client-allowed-cors-origin__container__fields">
                  <div className="client-allowed-cors-origin__container__field">
                    <label
                      className="client-allowed-cors-origin__label"
                      htmlFor="origin"
                    >
                      {localization.fields['origin'].label}
                    </label>
                    <input
                      id="origin"
                      type="text"
                      {...register('origin', {
                        required: true,
                        validate: ValidationUtils.validateCorsOrigin,
                      })}
                      defaultValue={defaultOrigin}
                      className="client-allowed-cors-origin__input"
                      placeholder={localization.fields['origin'].placeholder}
                      title={localization.fields['origin'].helpText}
                    />
                    <HelpBox
                      helpText={localization.fields['origin'].helpText}
                    />
                    <ErrorMessage
                      as="span"
                      errors={errors}
                      name="origin"
                      message={localization.fields['origin'].errorMessage}
                    />
                    <input
                      type="submit"
                      className="client-allowed-cors-origin__button__add"
                      disabled={isSubmitting}
                      title={localization.buttons['add'].helpText}
                      value={localization.buttons['add'].text}
                    />
                  </div>
                </div>

                <NoActiveConnections
                  title={localization.noActiveConnections?.title}
                  show={!props.origins || props.origins.length === 0}
                  helpText={localization.noActiveConnections?.helpText}
                ></NoActiveConnections>

                <div
                  className={`client-allowed-cors-origin__container__list ${
                    props.origins && props.origins.length > 0
                      ? 'show'
                      : 'hidden'
                  }`}
                >
                  <h3>{localization.sections['active'].title}</h3>
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
                            title={localization.buttons['remove'].helpText}
                          >
                            <i className="icon__delete"></i>
                            <span>{localization.buttons['remove'].text}</span>
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
                      title={localization.buttons['cancel'].helpText}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="client-allowed-cors-origin__button__container">
                    <button
                      type="button"
                      className="client-allowed-cors-origin__button__save"
                      onClick={props.handleNext}
                      title={localization.buttons['save'].helpText}
                    >
                      {localization.buttons['save'].text}
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
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}
export default ClientAllowedCorsOriginsForm
