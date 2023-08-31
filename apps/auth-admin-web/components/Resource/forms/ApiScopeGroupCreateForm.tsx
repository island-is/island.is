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
import { Domain } from '../../../entities/models/domain.model'

interface Props {
  apiScopeGroup?: ApiScopeGroup
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ApiScopeGroupCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState, reset, resetField } =
    useForm<ApiScopeGroupDTO>()
  const { errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeGroupCreateForm'),
  )
  const [domains, setDomains] = useState<Domain[]>([])
  useEffect(() => {
    async function getDomains() {
      const response = await ResourcesService.findAllDomains()
      if (response) {
        setDomains(response as Domain[])
        resetField('domainName', {
          defaultValue: props.apiScopeGroup.domainName,
        })
      }
    }

    if (props.apiScopeGroup && props.apiScopeGroup.id) {
      setIsEditing(true)
    }

    getDomains()
  }, [props.apiScopeGroup])

  const save = async (group: ApiScopeGroupDTO): Promise<void> => {
    group.order = +group.order
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
      reset(new ApiScopeGroupDTO())
    }
  }

  const handleCancelClick = () => {
    if (props.handleBack) {
      props.handleBack()
    }
  }

  return (
    <div className="api-scope-group-create-form">
      <div className="api-scope-group-create-form__wrapper">
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
                    htmlFor="domainName"
                    className="api-scope-group-create-form__label"
                  >
                    {localization.fields['domainName'].label}
                  </label>
                  <select
                    {...register('domainName', {
                      required: true,
                    })}
                    defaultValue={props.apiScopeGroup.domainName}
                    className="api-resource-form__input"
                    placeholder={localization.fields['domainName'].placeholder}
                    title={localization.fields['domainName'].helpText}
                  >
                    {domains.map((domain: Domain) => {
                      return (
                        <option
                          value={domain.name}
                          key={domain.name}
                          selected={
                            props.apiScopeGroup.domainName === domain.name
                          }
                        >
                          {domain.name}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox
                    helpText={localization.fields['domainName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="domainName"
                    message={localization.fields['domainName'].errorMessage}
                  />
                </div>

                <div className="api-scope-group-create-form__container__field">
                  <label
                    htmlFor="name"
                    className="api-scope-group-create-form__label"
                  >
                    {localization.fields['name'].label}
                  </label>
                  <input
                    type="text"
                    {...register('name', {
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
                    htmlFor="displayName"
                    className="api-scope-group-create-form__label"
                  >
                    {localization.fields['displayName'].label}
                  </label>
                  <input
                    type="text"
                    {...register('displayName', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={props.apiScopeGroup.displayName}
                    className="api-resource-form__input"
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
                    className="apiscopegroup"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.apiScopeGroup.id}
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
                    {...register('description', {
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
                    name="description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiscopegroup"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiScopeGroup.id}
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label htmlFor="order" className="api-scope-form__label">
                    {localization.fields['order'].label}
                  </label>
                  <input
                    id="order"
                    {...register('order', { required: true, min: 0, max: 999 })}
                    type="number"
                    className="api-scope-form__input"
                    title={localization.fields['order'].helpText}
                    defaultValue={props.apiScopeGroup.order}
                  />
                  <HelpBox helpText={localization.fields['order'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="order"
                    message={localization.fields['order'].errorMessage}
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
