import React, { useState } from 'react'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import { ApiScopeGroup } from '../../../entities/models/api-scope-group.model'
import ApiScopeGroupCreateForm from './ApiScopeGroupCreateForm'

interface Props {
  apiScopeGroup?: ApiScopeGroup
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ApiScopeGroupCreateFormModal: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiScopeGroupCreateForm'),
  )

  const handleFormChanges = () => {
    if (props.handleChanges) {
      props.handleChanges()
    }

    setVisible(false)
  }

  return (
    <div className="api-scope-group-create-form-modal">
      <div className="api-scope-group-create-form-modal__button__show">
        <a
          className="api-scope-group-create-form-modal__button__new"
          onClick={() => setVisible(!visible)}
          title={localization.buttons['new'].helpText}
        >
          <i className="icon__new"></i>
          <span>{localization.buttons['new'].text}</span>
        </a>
      </div>
      <div
        className={`api-scope-group-create-form-modal__modal-wrapper${
          visible ? '' : ' hidden'
        }`}
      >
        <div className="api-scope-group-create-form-modal__options">
          <a
            className="api-scope-group-create-form-modal__options__button__close"
            onClick={() => setVisible(false)}
          >
            &times;
          </a>
        </div>
        <ApiScopeGroupCreateForm
          apiScopeGroup={props.apiScopeGroup}
          handleBack={() => setVisible(false)}
          handleChanges={handleFormChanges}
        ></ApiScopeGroupCreateForm>
        {/* <div className="api-scope-group-create-form-modal__footer">
          <a
            className="api-scope-group-create-form-modal__footer__button"
            title={localization.buttons['list'].helpText}
            href={`/admin/?tab=${AdminTab.ApiScopeGroups}`}
          >
            <i className="icon__list"></i>
            <span>{localization.buttons['list'].text}</span>
          </a>
        </div> */}
      </div>
    </div>
  )
}
export default ApiScopeGroupCreateFormModal
