import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ResourcesService } from '../../../services/ResourcesService'
import { DomainDTO } from '../../../entities/dtos/domain.dto'
import TranslationCreateFormDropdown from './TranslationCreateFormDropdown'

interface Props {
  domain: DomainDTO
  handleSaveButtonClicked?: () => void
  handleCancel?: () => void
}

interface FormOutput {
  domain: DomainDTO
}

const DomainCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('DomainCreateForm'),
  )

  useEffect(() => {
    if (props.domain && props.domain.name) {
      setIsEditing(true)
    }
  }, [props.domain])

  const pushEvent = () => {
    if (props.handleSaveButtonClicked) {
      props.handleSaveButtonClicked()
    }
  }

  const create = async (data: DomainDTO): Promise<void> => {
    if (isEditing) {
      const response = await ResourcesService.updateDomain(
        data,
        props.domain.name,
      )
      if (response) {
        pushEvent()
      }
    } else {
      const response = await ResourcesService.createDomain(data)
      if (response) {
        pushEvent()
      }
    }
  }

  const save = async (data: FormOutput) => {
    await create(data.domain)
  }

  return (
    <div className="domain-create-form">
      <div className="domain-create-form__wrapper">
        <div className="domain-create-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="domain-create-form__container__form">
            <div className="domain-create-form__help">{localization.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="domain-create-form__container__fields">
                <div className="domain-create-form__container__field">
                  <label
                    className="domain-create-form__label"
                    htmlFor="nationalId"
                  >
                    {localization.fields['nationalId'].label}
                  </label>
                  <input
                    id="nationalId"
                    type="text"
                    name="domain.nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={props.domain.nationalId}
                    className="domain-create-form__input"
                    placeholder={localization.fields['nationalId'].placeholder}
                    maxLength={10}
                    title={localization.fields['nationalId'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['nationalId'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domain.nationalId"
                    message={localization.fields['nationalId'].errorMessage}
                  />
                </div>

                <div className="domain-create-form__container__field">
                  <label className="domain-create-form__label" htmlFor="name">
                    {localization.fields['name'].label}
                  </label>
                  <input
                    id="name"
                    type="text"
                    ref={register({
                      required: true,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateDomain,
                    })}
                    name="domain.name"
                    readOnly={isEditing}
                    defaultValue={props.domain.name}
                    className="domain-create-form__input"
                    title={localization.fields['name'].helpText}
                    placeholder={localization.fields['name'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domain.name"
                    message={localization.fields['name'].errorMessage}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                </div>

                <div className="domain-create-form__container__field">
                  <label
                    className="domain-create-form__label"
                    htmlFor="description"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="domain.description"
                    defaultValue={props.domain.description}
                    className="domain-create-form__input"
                    title={localization.fields['description'].helpText}
                    placeholder={localization.fields['description'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domain.description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                </div>

                <div className="domain-create-form__container__field">
                  <label
                    className="domain-create-form__label"
                    htmlFor="displayName"
                  >
                    {localization.fields['displayName'].label}
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="domain.displayName"
                    defaultValue={props.domain.displayName}
                    className="domain-create-form__input"
                    title={localization.fields['displayName'].helpText}
                    placeholder={localization.fields['displayName'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domain.displayName"
                    message={localization.fields['displayName'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['displayName'].helpText}
                  />
                  <TranslationCreateFormDropdown
                    className="domain"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.domain.displayName}
                  />
                </div>

                <div className="domain-create-form__container__field">
                  <label
                    className="domain-create-form__label"
                    htmlFor="organisationLogoKey"
                  >
                    {localization.fields['organisationLogoKey'].label}
                  </label>
                  <input
                    id="organisationLogoKey"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="domain.organisationLogoKey"
                    defaultValue={props.domain.organisationLogoKey}
                    className="domain-create-form__input"
                    title={localization.fields['organisationLogoKey'].helpText}
                    placeholder={
                      localization.fields['organisationLogoKey'].placeholder
                    }
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domain.organisationLogoKey"
                    message={
                      localization.fields['organisationLogoKey'].errorMessage
                    }
                  />
                  <HelpBox
                    helpText={
                      localization.fields['organisationLogoKey'].helpText
                    }
                  />
                </div>
              </div>

              <div className="domain-create-form__buttons__container">
                <div className="domain-create-form__button__container">
                  <button
                    className="domain-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="domain-create-form__button__container">
                  <input
                    type="submit"
                    className="domain-create-form__button__save"
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
export default DomainCreateForm
