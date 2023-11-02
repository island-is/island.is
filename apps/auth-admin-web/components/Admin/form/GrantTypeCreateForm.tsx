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
import HintBox from './../../common/HintBox'

interface Props {
  grantType: GrantTypeDTO
  handleSaveButtonClicked?: (response: GrantType) => void
  handleCancel?: () => void
}

interface FormOutput {
  grantType: GrantTypeDTO
}

const GrantTypeCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<FormOutput>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const grantType = props.grantType
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('GrantTypeCreateForm'),
  )
  //#region hint-box
  const [nameHintVisible, setNameHintVisible] = useState<boolean>(false)
  const [nameHintMessage, setNameHintMessage] = useState<string>('')
  const [nameIsValid, setNameIsValid] = useState<boolean | null>(null)
  //#endregion hint-box

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

  const onNameChange = async (name: string) => {
    setNameHintVisible(true)
    const isValid =
      name.length > 0 ? ValidationUtils.validateGrantType(name) : false
    setNameIsValid(isValid)
    isValid
      ? setNameHintMessage(localization.fields['name'].hintOkMessage)
      : setNameHintMessage(localization.fields['name'].hintErrorMessage)
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
                    {...register('grantType.name', {
                      required: true,
                      onBlur: () => setNameHintVisible(false),
                      onChange: (e) => onNameChange(e.target.value),

                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateGrantType,
                    })}
                    defaultValue={grantType.name}
                    className="grant-type-create-form__input"
                    placeholder={localization.fields['name'].placeholder}
                    title={localization.fields['name'].helpText}
                    readOnly={isEditing}
                    onFocus={(e) => onNameChange(e.target.value)}
                  />
                  <HintBox
                    helpText={nameHintMessage}
                    pattern={localization.fields['name'].pattern}
                    patternText={localization.fields['name'].patternText}
                    setVisible={nameHintVisible}
                    onVisibleChange={(e) => setNameHintVisible(e)}
                    isValid={nameIsValid}
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
                    {...register('grantType.description', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
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
