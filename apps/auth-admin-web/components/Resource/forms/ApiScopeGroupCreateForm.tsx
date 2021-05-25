import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ResourcesService } from '../../../services/ResourcesService'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import ValidationUtils from './../../../utils/validation.utils'
import { ApiScopeGroupDTO } from './../../../entities/dtos/api-scope-group.dto'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'

interface Props {
  apiScopeGroup?: ApiScopeGroup
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
  isModal: false
}

const ApiScopeGroupCreateForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
    reset,
  } = useForm<ApiScopeGroupDTO>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeGroupCreateForm'),
  )
  useEffect(() => {
    if (props.apiScopeGroup && props.apiScopeGroup.id) {
      setIsEditing(true)
    }
  }, [props.apiScopeGroup])

  const save = async (group: ApiScopeGroupDTO): Promise<void> => {
    const response = isEditing
      ? await ResourcesService.updateApiScopeGroup(
          group,
          props.apiScopeGroup.id,
        )
      : await ResourcesService.createApiScopeGroup(group)

    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
      if (props.handleNext) {
        props.handleNext()
      }
      setVisible(false)
      reset(new ApiScopeGroupDTO())
    }
  }

  const handleCancelClick = () => {
    if (props.isModal) {
      setVisible(false)
      return
    }
    if (props.handleBack) {
      props.handleBack()
    }
  }

  return (
    <div className="api-scope-group-create-form">
      <div className="api-scope-group-create-form__button__show">
        <a
          className="api-scope-group-create-form__button__new"
          onClick={() => setVisible(!visible)}
          title={localization.buttons['new'].helpText}
        >
          <i className="icon__new"></i>
          <span>{localization.buttons['new'].text}</span>
        </a>
      </div>
      <div
        className={`api-scope-group-create-form__wrapper${
          visible ? '' : ' hidden'
        }`}
      >
        <div className="api-scope-group-create-form__container">
          <h1>{localization.title}</h1>
          <div className="api-scope-group-create-form__container__form">
            <div className="api-scope-group-create-form__help">
              {localization.help}
            </div>
            <form>
              <div className="api-scope-group-create-form__container__fields">
                <div className="api-scope-group-create-form__container__field">
                  <label
                    htmlFor="name"
                    className="api-scope-group-create-form__label"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    type="text"
                    name="name"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={props.apiScopeGroup.name}
                    className="api-resource-form__input"
                    placeholder={localization.fields['name'].placeholder}
                    title={localization.fields['name'].helpText}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>
                <div className="api-scope-group-create-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-scope-group-create-form__label"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    type="text"
                    name="description"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={props.apiScopeGroup.description}
                    className="api-resource-form__input"
                    placeholder={localization.fields['description'].placeholder}
                    title={localization.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message={localization.fields['description'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiscopegroup"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiScopeGroup.id}
                  />
                </div>
              </div>
            </form>
            <div className="api-scope-group-create-form__buttons__container">
              <div className="api-scope-group-create-form__button__container">
                <button
                  type="button"
                  className="api-scope-group-create-form__button__cancel"
                  onClick={handleCancelClick}
                  title={localization.buttons['cancel'].helpText}
                >
                  {localization.buttons['cancel'].text}
                </button>
              </div>
              <div className="api-scope-group-create-form__button__container">
                <button
                  type="button"
                  className="api-scope-group-create-form__button__save"
                  onClick={handleSubmit(save)}
                  title={localization.buttons['save'].helpText}
                >
                  {localization.buttons['save'].text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ApiScopeGroupCreateForm
