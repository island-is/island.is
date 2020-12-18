import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HelpBox from '../../../Common/HelpBox';
import { ErrorMessage } from '@hookform/error-message';

interface Texts {
  enabled: string;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: string;
  required: string;
  emphasize: string;
}

interface Data {
  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: boolean;
  required: boolean;
  emphasize: boolean;
}

interface Props {
  data: Data;
  save: (object: any) => void;
  texts: Texts;
  hideBooleanValues: boolean;
}

const ResourceEditForm: React.FC<Props> = ({
  data,
  save,
  texts,
  hideBooleanValues,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<any>();
  const { isSubmitting } = formState;
  const [resource, setResource] = useState<any>(data);
  const router = useRouter();

  useEffect(() => {
    setResource(data);
  }, [data]);

  const back = () => {
    router.back();
  };

  const changeEnabled = () => {
    setResource({ ...resource, enabled: !resource.enabled });
  };

  const changeEmphasize = () => {
    setResource({ ...resource, emphasize: !resource.emphasize });
  };

  const changeRequired = () => {
    setResource({ ...resource, required: !resource.required });
  };

  const changeDiscoveryDocument = () => {
    setResource({
      ...resource,
      showInDiscoveryDocument: !resource.showInDiscoveryDocument,
    });
  };

  let extraBooleanValuesHtml = <div></div>;
  if (!hideBooleanValues) {
    extraBooleanValuesHtml = (
      <div>
        <div className="api-scope-form__container__checkbox__field">
          <label htmlFor="emphasize" className="api-scope-form__label">
            Emphasize
          </label>
          <input
            // key={Math.random()}
            ref={register}
            id="emphasize"
            name="resource.emphasize"
            type="checkbox"
            className="api-scope-form__checkbox"
            // defaultChecked={resource.emphasize}
            checked={resource.emphasize}
            onChange={(e) => changeEmphasize()}
          />
          <HelpBox helpText={texts.emphasize} />
        </div>

        <div className="api-scope-form__container__checkbox__field">
          <label htmlFor="required" className="api-scope-form__label">
            Required
          </label>
          <input
            ref={register}
            id="required"
            name="resource.required"
            type="checkbox"
            className="api-scope-form__checkbox"
            // defaultChecked={resource.required}
            checked={resource.required}
            onChange={(e) => changeRequired()}
          />
          <HelpBox helpText={texts.required} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(save)}>
      <div className="api-scope-form__container__fields">
        <div className="api-scope-form__container__field">
          <label htmlFor="name" className="api-scope-form__label">
            Name
          </label>
          <input
            ref={register({ required: true })}
            id="name"
            name="resource.name"
            type="text"
            className="api-scope-form__input"
            defaultValue={resource.name}
            disabled={true}
          />
          <HelpBox helpText={texts.name} />
          <ErrorMessage
            as="span"
            errors={errors}
            name="resource.name"
            message="Name is required"
          />
        </div>
        <div className="api-scope-form__container__field">
          <label htmlFor="displayName" className="api-scope-form__label">
            Display Name
          </label>
          <input
            ref={register({ required: true })}
            id="displayName"
            name="resource.displayName"
            type="text"
            className="api-scope-form__input"
            defaultValue={resource.displayName}
          />
          <HelpBox helpText={texts.displayName} />
          <ErrorMessage
            as="span"
            errors={errors}
            name="resource.displayName"
            message="Display Name is required"
          />
        </div>
        <div className="api-scope-form__container__field">
          <label htmlFor="description" className="api-scope-form__label">
            Description
          </label>
          <input
            ref={register({ required: false })}
            id="description"
            name="resource.description"
            type="text"
            defaultValue={resource.description}
            className="api-scope-form__input"
          />
          <HelpBox helpText={texts.description} />
        </div>

        <div className="api-scope-form__container__checkbox__field">
          <label htmlFor="enabled" className="api-scope-form__label">
            Enabled
          </label>
          <input
            ref={register}
            id="enabled"
            name="resource.enabled"
            type="checkbox"
            className="api-scope-form__checkbox"
            // defaultChecked={resource.enabled}
            checked={resource.enabled}
            onChange={(e) => changeEnabled()}
          />
          <HelpBox helpText={texts.enabled} />
        </div>

        {extraBooleanValuesHtml}

        <div className="api-scope-form__container__checkbox__field">
          <label
            htmlFor="showInDiscoveryDocument"
            className="api-scope-form__label"
          >
            Show In Discovery Document
          </label>
          <input
            ref={register}
            id="showInDiscoveryDocument"
            name="resource.showInDiscoveryDocument"
            type="checkbox"
            className="api-scope-form__checkbox"
            // defaultChecked={resource.showInDiscoveryDocument}
            checked={resource.showInDiscoveryDocument}
            onChange={(e) => changeDiscoveryDocument()}
          />
          <HelpBox helpText={texts.showInDiscoveryDocument} />
        </div>

        <div className="api-scope-form__buttons__container">
          <div className="api-scope-form__button__container">
            <button className="api-scope-form__button__cancel" onClick={back}>
              Cancel
            </button>
          </div>
          <div className="api-scope-form__button__container">
            <input
              type="submit"
              className="api-scope-form__button__save"
              disabled={isSubmitting}
              value="Save"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResourceEditForm;
