import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { GrantTypeDTO } from 'apps/auth-admin-web/entities/dtos/grant-type.dto'
import { GrantType } from 'apps/auth-admin-web/entities/models/grant-type.model'
import { GrantTypeService } from 'apps/auth-admin-web/services/GrantTypeService'
interface Props {
  grantType: GrantTypeDTO
  handleSaveButtonClicked?: (response: GrantType) => void
  handleCancel?: () => void
}

interface FormOutput {
  grantType: GrantTypeDTO
}

const GrantTypeCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const grantType = props.grantType

  useEffect(() => {
    if (props.grantType && props.grantType.name) {
      setIsEditing(true)
    }
  }, [props.grantType])

  const pushEvent = (response: GrantType | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: FormOutput): Promise<void> => {
    if (isEditing) {
      const response = await GrantTypeService.update(
        data.grantType,
        data.grantType.name,
      )
      if (response) {
        pushEvent(response)
      }
    } else {
      const response = await GrantTypeService.create(data.grantType)
      if (response) {
        pushEvent(response)
      }
    }
  }

  return (
    <div className="grant-type-create-form">
      <div className="grant-type-create-form__wrapper">
        <div className="grant-type-create-form__container">
          <h1>{isEditing ? 'Edit Grant Type' : 'Create a new Grant Type'}</h1>
          <div className="grant-type-create-form__container__form">
            <div className="grant-type-create-form__help">
              Add or edit a Grant Type
            </div>
            <form onSubmit={handleSubmit(create)}>
              <div className="grant-type-create-form__container__fields">
                <div className="grant-type-create-form__container__field">
                  <label
                    className="grant-type-create-form__label"
                    htmlFor="grantType.name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="grantType.name"
                    name="grantType.name"
                    ref={register({
                      required: true,
                    })}
                    defaultValue={grantType.name}
                    className="grant-type-create-form__input"
                    placeholder="Grant Type unique name"
                    title="The unique name of the Grant Type"
                    readOnly={isEditing}
                  />
                  <HelpBox helpText="The unique name of the Grant Type" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="grantType.name"
                    message="Name is required"
                  />
                </div>

                <div className="grant-type-create-form__container__field">
                  <label
                    className="grant-type-create-form__label"
                    htmlFor="grantType.description"
                  >
                    Description
                  </label>
                  <input
                    id="grantType.description"
                    type="text"
                    ref={register({
                      required: true,
                    })}
                    name="grantType.description"
                    defaultValue={grantType.description ?? ''}
                    className="grant-type-create-form__input"
                    title="Short description about this Grant Type"
                    placeholder="App from Example Firm"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="grantType.description"
                    message="Description is required"
                  />
                  <HelpBox helpText="Short description about this Grant Type" />
                </div>
              </div>

              <div className="grant-type-create-form__buttons__container">
                <div className="grant-type-create-form__button__container">
                  <button
                    className="grant-type-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="grant-type-create-form__button__container">
                  <input
                    type="submit"
                    className="grant-type-create-form__button__save"
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
export default GrantTypeCreateForm
