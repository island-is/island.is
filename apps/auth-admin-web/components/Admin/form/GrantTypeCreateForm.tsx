import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { GrantTypeDTO } from './../../../entities/dtos/grant-type.dto'
import { GrantType } from './../../../entities/models/grant-type.model'
import { GrantTypeService } from './../../../services/GrantTypeService'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
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
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('GrantTypeCreateForm'),
  )

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
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="grant-type-create-form__container__form">
            <div className="grant-type-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(create)}>
              <div className="grant-type-create-form__container__fields">
                <div className="grant-type-create-form__container__field">
                  <label
                    className="grant-type-create-form__label"
                    htmlFor="grantType.name"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    type="text"
                    id="grantType.name"
                    name="grantType.name"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={grantType.name}
                    className="grant-type-create-form__input"
                    placeholder={localization.fields['name'].placeholder}
                    title={localization.fields['name'].helpText}
                    readOnly={isEditing}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="grantType.name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>

                <div className="grant-type-create-form__container__field">
                  <label
                    className="grant-type-create-form__label"
                    htmlFor="grantType.description"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="grantType.description"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="grantType.description"
                    defaultValue={grantType.description ?? ''}
                    className="grant-type-create-form__input"
                    title={localization.fields['description'].helpText}
                    placeholder={localization.fields['description'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="grantType.description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                </div>
              </div>

              <div className="grant-type-create-form__buttons__container">
                <div className="grant-type-create-form__button__container">
                  <button
                    className="grant-type-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="grant-type-create-form__button__container">
                  <input
                    type="submit"
                    className="grant-type-create-form__button__save"
                    disabled={isSubmitting}
                    title={localization.buttons['save'].helpText}
                    value={localization.buttons['save'].text}
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
