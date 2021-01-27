import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { IdpProviderDTO } from './../../../entities/dtos/idp-provider.dto'
import { IdpProviderService } from './../../../services/IdpProviderService'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
interface Props {
  idpProvider: IdpProviderDTO
  handleSaveButtonClicked?: (response: IdpProvider) => void
  handleCancel?: () => void
}

interface FormOutput {
  idp: IdpProviderDTO
}

const IdpProviderCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const idp = props.idpProvider

  useEffect(() => {
    if (props.idpProvider && props.idpProvider.name) {
      setIsEditing(true)
    }
  }, [props.idpProvider])

  const pushEvent = (response: IdpProvider | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: FormOutput): Promise<void> => {
    data.idp.level = +data.idp.level
    if (isEditing) {
      const response = await IdpProviderService.update(
        props.idpProvider.name,
        data.idp,
      )
      if (response) {
        pushEvent(response)
      }
    } else {
      const response = await IdpProviderService.create(data.idp)
      if (response) {
        pushEvent(response)
      }
    }
  }

  return (
    <div className="idp-provider-create-form">
      <div className="idp-provider-create-form__wrapper">
        <div className="idp-provider-create-form__container">
          <h1>
            {isEditing ? 'Edit Idp Provider' : 'Create a new Idp Provider'}
          </h1>
          <div className="idp-provider-create-form__container__form">
            <div className="idp-provider-create-form__help">
              Add or edit a IDP Provider
            </div>
            <form onSubmit={handleSubmit(create)}>
              <div className="idp-provider-create-form__container__fields">
                <div className="idp-provider-create-form__container__field">
                  <label className="idp-provider-create-form__label">
                    Name
                  </label>
                  <input
                    type="text"
                    name="idp.name"
                    ref={register({
                      required: true,
                    })}
                    defaultValue={idp.name}
                    className="idp-provider-create-form__input"
                    placeholder="provider_name"
                    title="The unique name of the provider with no spaces or symbols"
                    readOnly={isEditing}
                  />
                  <HelpBox helpText="The unique name of the provider with no spaces or symbols" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.name"
                    message="Name is required"
                  />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label className="idp-provider-create-form__label">
                    Description
                  </label>
                  <input
                    type="text"
                    ref={register({
                      required: true,
                    })}
                    name="idp.description"
                    defaultValue={idp.description ?? ''}
                    className="idp-provider-create-form__input"
                    title="Short description about this Identity Provider"
                    placeholder="Login with an App from Example Firm"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.description"
                    message="Description is required"
                  />
                  <HelpBox helpText="Login with an App from Example Firm" />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label className="idp-provider-create-form__label">
                    Help Text
                  </label>
                  <input
                    type="text"
                    className="idp-provider-create-form__input"
                    name="idp.helptext"
                    ref={register({ required: true })}
                    defaultValue={idp.helptext}
                    title="This text will be shown in the form where users to the Admin UI select this Identity Provider"
                    placeholder="Add this provider to be able to connect with an App from Example Firm"
                  />

                  <HelpBox helpText="This text will be shown in the form where users to the Admin UI select this Identity Provider" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.helptext"
                    message="Help text is required"
                  />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label className="idp-provider-create-form__label">
                    Level
                  </label>
                  <input
                    type="number"
                    className="idp-provider-create-form__input"
                    name="idp.level"
                    ref={register({ required: true, min: 1, max: 4 })}
                    defaultValue={idp.helptext}
                    placeholder="4"
                    title="The security level of this Identity Provider. Between 1 and 4. 4 meaning that this provider provides the highest security and 1 if this provider provides low security"
                  />

                  <HelpBox helpText="The security level of this Identity Provider. Between 1 and 4. 4 meaning that this provider provides the highest security and 1 if this provider provides low security" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.level"
                    message="Level is required and needs to be a number from 1-4"
                  />
                </div>
              </div>

              <div className="idp-provider-create-form__buttons__container">
                <div className="idp-provider-create-form__button__container">
                  <button
                    className="idp-provider-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="idp-provider-create-form__button__container">
                  <input
                    type="submit"
                    className="idp-provider-create-form__button__save"
                    disabled={isSubmitting}
                    value="Save"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default IdpProviderCreateForm
