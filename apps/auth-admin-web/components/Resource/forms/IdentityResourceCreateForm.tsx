import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ResourcesService } from '../../../services/ResourcesService'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import { FormControl } from '../../../entities/common/Localization'
import LocalizationUtils from '../../../utils/localization.utils'
import HintBox from '../../common/HintBox'

interface Props {
  handleSave?: (object: IdentityResourceDTO) => void
  handleCancel?: () => void
  identityResource: IdentityResourceDTO
}

const IdentityResourceCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { register, handleSubmit, formState } = useForm<IdentityResourceDTO>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('IdentityResourceCreateForm'),
  )
  //#region hint-box
  const [nameHintVisible, setNameHintVisible] = useState<boolean>(false)
  const [nameHintMessage, setNameHintMessage] = useState<string>('')
  const [nameIsValid, setNameIsValid] = useState<boolean | null>(null)
  //#endregion hint-box

  useEffect(() => {
    if (props.identityResource && props.identityResource.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.identityResource])

  const onNameChange = async (name: string) => {
    if (isEditing) {
      return
    }
    setNameHintVisible(true)
    const isValid =
      name.length > 0
        ? ValidationUtils.validateIdentityResourceName(name)
        : false
    setNameIsValid(isValid)
    isValid
      ? setNameHintMessage(localization.fields['name'].hintOkMessage)
      : setNameHintMessage(localization.fields['name'].hintErrorMessage)

    checkAvailability(name)
  }

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
    if (name.length === 0) {
      setAvailable(false)
      return
    }
    const response = await ResourcesService.isScopeNameAvailable(name)
    setAvailable(response)
  }

  const save = async (data: IdentityResourceDTO) => {
    let response = null

    if (!isEditing) {
      response = await ResourcesService.createIdentityResource(data)
    } else {
      response = await ResourcesService.updateIdentityResource(data, data.name)
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="identity-resource-form">
      <div className="identity-resource-form__wrapper">
        <div className="identity-resource-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="identity-resource-form__container__form">
            <div className="identity-resource-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="identity-resource-form__container__fields">
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="name"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    id="name"
                    {...register('name', {
                      onBlur: () => setNameHintVisible(false),
                      onChange: (e) => onNameChange(e.target.value),
                      required: true,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateIdentityResourceName,
                    })}
                    type="text"
                    className="identity-resource-form__input"
                    defaultValue={props.identityResource.name}
                    readOnly={isEditing}
                    placeholder={localization.fields['name'].placeholder}
                    onFocus={(e) => onNameChange(e.target.value)}
                  />
                  <div
                    className={`identity-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available
                      ? localization.fields['name'].available
                      : localization.fields['name'].unAvailable}
                  </div>
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
                    name="name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['displayName'].label}
                  </label>
                  <input
                    id="displayName"
                    {...register('displayName', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    type="text"
                    className="identity-resource-form__input"
                    defaultValue={props.identityResource.displayName}
                    placeholder={localization.fields['displayName'].placeholder}
                    title={localization.fields['displayName'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['displayName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message={localization.fields['displayName'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="identityresource"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.identityResource.name}
                  />
                </div>
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="description"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    {...register('description', {
                      required: false,
                      validate: ValidationUtils.validateDescription,
                    })}
                    type="text"
                    defaultValue={props.identityResource.description}
                    className="identity-resource-form__input"
                    placeholder={localization.fields['description'].placeholder}
                    title={localization.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="identityresource"
                    property="description"
                    isEditing={isEditing}
                    id={props.identityResource.name}
                  />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="enabled"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['enabled'].label}
                  </label>
                  <input
                    id="enabled"
                    {...register('enabled')}
                    type="checkbox"
                    defaultChecked={props.identityResource.enabled}
                    className="identity-resource-form__checkbox"
                    title={localization.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={localization.fields['enabled'].helpText} />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    id="showInDiscoveryDocument"
                    {...register('showInDiscoveryDocument')}
                    type="checkbox"
                    defaultChecked={
                      props.identityResource.showInDiscoveryDocument
                    }
                    className="identity-resource-form__checkbox"
                    title={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                  <HelpBox
                    helpText={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="emphasize"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['emphasize'].label}
                  </label>
                  <input
                    id="emphasize"
                    {...register('emphasize')}
                    defaultChecked={props.identityResource.emphasize}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
                    title={localization.fields['emphasize'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['emphasize'].helpText}
                  />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="required"
                    className="identity-resource-form__label"
                  >
                    {localization.fields['required'].label}
                  </label>
                  <input
                    id="required"
                    {...register('required')}
                    defaultChecked={props.identityResource.required}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
                    title={localization.fields['required'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['required'].helpText}
                  />
                </div>

                <section className="api-scope__section">
                  <h3>{localization.sections['delegations'].title}</h3>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="automaticDelegationGrant"
                      className="api-scope-form__label"
                    >
                      {localization.fields['automaticDelegationGrant'].label}
                    </label>
                    <input
                      id="automaticDelegationGrant"
                      {...register('automaticDelegationGrant')}
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.automaticDelegationGrant
                      }
                      className="api-scope-form__checkbox"
                      title={
                        localization.fields['automaticDelegationGrant'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        localization.fields['automaticDelegationGrant'].helpText
                      }
                    />
                  </div>
                </section>

                <div className="identity-resource-form__buttons__container">
                  <div className="identity-resource-form__button__container">
                    <button
                      type="button"
                      className="identity-resource-form__button__cancel"
                      onClick={props.handleCancel}
                      title={localization.buttons['cancel'].helpText}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="identity-resource-form__button__container">
                    <input
                      type="submit"
                      className="identity-resource-form__button__save"
                      disabled={isSubmitting || !available}
                      title={localization.buttons['save'].helpText}
                      value={localization.buttons['save'].text}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdentityResourceCreateForm
