import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { IdpProviderDTO } from './../../../entities/dtos/idp-provider.dto'
import { IdpProviderService } from './../../../services/IdpProviderService'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'
import ValidationUtils from './../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  idpProvider: IdpProviderDTO
  handleSaveButtonClicked?: (response: IdpProvider) => void
  handleCancel?: () => void
}

interface FormOutput {
  idp: IdpProviderDTO
}

const IdpProviderCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<FormOutput>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('IdpProviderCreateForm'),
  )
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
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="idp-provider-create-form__container__form">
            <div className="idp-provider-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(create)}>
              <div className="idp-provider-create-form__container__fields">
                <div className="idp-provider-create-form__container__field">
                  <label
                    className="idp-provider-create-form__label"
                    htmlFor="name"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('idp.name', {
                      required: true,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={idp.name}
                    className="idp-provider-create-form__input"
                    placeholder={localization.fields['name'].placeholder}
                    title={localization.fields['name'].helpText}
                    readOnly={isEditing}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label
                    className="idp-provider-create-form__label"
                    htmlFor="description"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    type="text"
                    {...register('idp.description', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={idp.description ?? ''}
                    className="idp-provider-create-form__input"
                    title={localization.fields['description'].helpText}
                    placeholder={localization.fields['description'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label
                    className="idp-provider-create-form__label"
                    htmlFor="helptext"
                  >
                    {localization.fields['helptext'].label}
                  </label>
                  <input
                    id="helptext"
                    type="text"
                    className="idp-provider-create-form__input"
                    {...register('idp.helptext', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={idp.helptext}
                    title={localization.fields['helptext'].helpText}
                    placeholder={localization.fields['helptext'].placeholder}
                  />

                  <HelpBox
                    helpText={localization.fields['helptext'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.helptext"
                    message={localization.fields['helptext'].errorMessage}
                  />
                </div>

                <div className="idp-provider-create-form__container__field">
                  <label
                    className="idp-provider-create-form__label"
                    htmlFor="level"
                  >
                    {localization.fields['level'].label}
                  </label>
                  <input
                    id="level"
                    type="number"
                    className="idp-provider-create-form__input"
                    {...register('idp.level', {
                      required: true,
                      min: 1,
                      max: 4,
                    })}
                    defaultValue={idp.level}
                    placeholder={localization.fields['level'].placeholder}
                    title={localization.fields['level'].helpText}
                  />

                  <HelpBox helpText={localization.fields['level'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="idp.level"
                    message={localization.fields['level'].errorMessage}
                  />
                </div>
              </div>

              <div className="idp-provider-create-form__buttons__container">
                <div className="idp-provider-create-form__button__container">
                  <button
                    className="idp-provider-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="idp-provider-create-form__button__container">
                  <input
                    type="submit"
                    className="idp-provider-create-form__button__save"
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
export default IdpProviderCreateForm
