import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiScope } from '../../../entities/models/api-scope.model'
import { ResourcesService } from '../../../services/ResourcesService'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ApiResource } from './../../../entities/models/api-resource.model'
import { ApiResourceScopeDTO } from './../../../entities/dtos/api-resource-allowed-scope.dto'

interface Props {
  handleSave?: (object: ApiResourceScopeDTO | number) => void
  handleCancel?: () => void
  apiScope: ApiScope
}

const ApiScopeResourceForm: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiResourceScopeDTO>()
  const [apiResources, setApiResources] = useState<ApiResource[]>([])
  const [selectedApiResource, setSelectedApiResource] = useState<ApiResource>(
    new ApiResource(),
  )
  const [activeResource, setActiveResource] = useState<string>('null')

  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeResourceForm'),
  )

  useEffect(() => {
    async function setSelectedValue() {
      if (props.apiScope && props.apiScope.name) {
        const response = await ResourcesService.findApiResourceScopeByScopeName(
          props.apiScope.name,
        )
        if (response) {
          setActiveResource(response.apiResourceName)
        } else {
          setActiveResource('null')
        }
      }
    }
    setSelectedValue()
  }, [props.apiScope])

  useEffect(() => {
    async function getResources() {
      const resources = await ResourcesService.findAllApiResources()
      setApiResources(resources)
    }
    getResources()
  }, [])

  const setSelectedItem = (api: string) => {
    const selected = apiResources.find((e) => e.name === api)
    if (selected) {
      setSelectedApiResource(selected)
    }
  }

  const save = async (data: ApiResourceScopeDTO) => {
    // Remove Api Resource from Api Resource Scope
    if (data.apiResourceName === 'null') {
      const response = await ResourcesService.deleteApiResourceScopeByScopeName(
        props.apiScope.name,
      )
      if (response) {
        props.handleSave(response)
      }
    } else {
      const request = {
        apiResourceName: data.apiResourceName,
        scopeName: props.apiScope.name,
      } as ApiResourceScopeDTO
      const response = await ResourcesService.addApiResourceAllowedScope(
        request,
      )

      if (response) {
        if (props.handleSave) {
          props.handleSave(data)
        }
      }
    }
  }

  return (
    <div className="api-scope-resource-form">
      <div className="api-scope-resource-form__wrapper">
        <div className="api-scope-resource-form__container">
          <h1>{localization.title}</h1>
          <div className="api-scope-resource-form__container__form">
            <div className="api-scope-resource-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-resource-form__container__fields">
                <div className="api-scope-resource-form__container__field">
                  <label
                    className="api-resource-scope-form__label"
                    htmlFor="apiResourceName"
                  >
                    {localization.fields['apiResourceName'].label}
                  </label>
                  <select
                    id="apiResourceName"
                    className="api-resource-scope-form__select"
                    {...register('apiResourceName', {
                      onChange: (e) => setSelectedItem(e.target.value),
                    })}
                    title={localization.fields['apiResourceName'].helpText}
                  >
                    <option value={'null'} selected={activeResource === 'null'}>
                      {localization.fields['apiResourceName'].selectAnItem}
                    </option>
                    {apiResources.map((api: ApiResource) => {
                      return (
                        <option
                          value={api.name}
                          key={api.name}
                          selected={api.name === activeResource}
                        >
                          {api.name}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox
                    helpText={localization.fields['apiResourceName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="apiResourceName"
                    message={
                      localization.fields['apiResourceName'].errorMessage
                    }
                  />
                </div>

                <div
                  className={`api-resource-scope-form__selected__item ${
                    selectedApiResource && selectedApiResource?.name
                      ? 'show'
                      : 'hidden'
                  }`}
                  key={
                    selectedApiResource && selectedApiResource?.name
                      ? selectedApiResource?.name
                      : 'none'
                  }
                >
                  <h3>{localization.sections['selectedItem'].title}</h3>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties['name']
                          .name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedApiResource?.name}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties[
                          'displayName'
                        ].name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedApiResource?.displayName}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties[
                          'description'
                        ].name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedApiResource?.description}
                    </div>
                  </div>
                </div>

                <div className="api-scope-resource-form__buttons__container">
                  <div className="api-scope-resource-form__button__container">
                    <button
                      type="button"
                      className="api-scope-resource-form__button__cancel"
                      onClick={props.handleCancel}
                      title={localization.buttons['cancel'].helpText}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="api-scope-resource-form__button__container">
                    <input
                      type="submit"
                      className="api-scope-resource-form__button__save"
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

export default ApiScopeResourceForm
