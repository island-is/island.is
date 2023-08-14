import { ErrorMessage } from '@hookform/error-message'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ClientClaim } from '../../../entities/models/client-claim.model'
import { ClientClaimDTO } from '../../../entities/dtos/client-claim.dto'
import HelpBox from '../../common/HelpBox'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  clientId: string
  claims?: ClientClaim[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientClaimForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<ClientClaimDTO>()
  const { isSubmitting, errors } = formState
  const [modalIsOpen, setIsOpen] = useState(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientClaimForm'),
  )
  const [claimToRemove, setClaimToRemove] = useState<ClientClaimDTO>(
    new ClientClaimDTO(),
  )

  const add = async (data: ClientClaimDTO) => {
    const clientClaim = new ClientClaimDTO()
    clientClaim.clientId = props.clientId
    clientClaim.type = data.type
    clientClaim.value = data.value

    const response = ClientService.addClaim(clientClaim)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
      const form = document.getElementById('claimForm') as HTMLFormElement
      if (form) {
        form.reset()
      }
    }
  }

  const remove = async () => {
    const response = await ClientService.removeClaim(
      claimToRemove.clientId,
      claimToRemove.type,
      claimToRemove.value,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeModal()
  }

  const confirmRemove = async (claim: ClientClaimDTO) => {
    setClaimToRemove(claim)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        {localization.removeConfirmation}:<span>{claimToRemove.type}</span>-
        <span>{claimToRemove.value}</span>
      </p>
    )
  }

  return (
    <div className="client-claim">
      <div className="client-claim__wrapper">
        <div className="client-claim__container">
          <h1>{localization.title}</h1>
          <form id="claimForm" onSubmit={handleSubmit(add)}>
            <div className="client-claim__container__form">
              <div className="client-claim__help">{localization.help}</div>
              <div className="client-claim__container__fields">
                <div className="client-claim__container__field">
                  <label className="client-claim__label" htmlFor="type">
                    {localization.fields['type'].label}
                  </label>
                  <input
                    id="type"
                    type="text"
                    {...register('type', {
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder={localization.fields['type'].placeholder}
                    title={localization.fields['type'].helpText}
                  />
                  <HelpBox helpText={localization.fields['type'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message={localization.fields['type'].errorMessage}
                  />
                  <input
                    type="submit"
                    className="client-claim__button__add"
                    disabled={isSubmitting}
                    value={localization.buttons['add'].text}
                    title={localization.buttons['add'].helpText}
                  />
                </div>
                <div className="client-claim__container__field">
                  <label className="client-claim__label" htmlFor="value">
                    {localization.fields['value'].label}
                  </label>
                  <input
                    id="value"
                    type="text"
                    {...register('value', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={''}
                    className="client-claim__input"
                    placeholder={localization.fields['value'].placeholder}
                    title={localization.fields['value'].helpText}
                  />
                  <HelpBox helpText={localization.fields['value'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message={localization.fields['value'].errorMessage}
                  />
                </div>
              </div>

              <NoActiveConnections
                title={localization.noActiveConnections?.title}
                show={!props.claims || props.claims.length === 0}
                helpText={localization.noActiveConnections?.helpText}
              ></NoActiveConnections>

              <div
                className={`client-claim__container__list ${
                  props.claims && props.claims.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>{localization.sections['active'].title}</h3>
                {props.claims?.map((claim: ClientClaim) => {
                  return (
                    <div
                      className="client-claim__container__list__item"
                      key={claim.type}
                    >
                      <div className="list-name">{claim.type}</div>
                      <div className="list-value">{claim.value}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(claim)}
                          className="client-claim__container__list__button__remove"
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
              <div className="client-claim__buttons__container">
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__cancel"
                    onClick={props.handleBack}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="client-claim__button__container">
                  <button
                    type="button"
                    className="client-claim__button__save"
                    onClick={props.handleNext}
                    title={localization.buttons['save'].helpText}
                  >
                    {localization.buttons['save'].text}
                  </button>
                </div>
              </div>
            </div>
          </form>
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
export default ClientClaimForm
