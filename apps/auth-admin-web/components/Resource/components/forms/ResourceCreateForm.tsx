import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import HelpBox from '../../../Common/HelpBox';
import { ErrorMessage } from '@hookform/error-message';

interface Texts {
  header: string;
  details: string;
  enabled: string;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: string;
  required: string;
  emphasize: string;
}

class Data {
  constructor() {
    this.enabled = true;
    this.name = '';
    this.displayName = '';
    this.description = '';
    this.showInDiscoveryDocument = true;
    this.required = false;
    this.emphasize = false;
  }

  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  showInDiscoveryDocument: boolean;
  required: boolean;
  emphasize: boolean;
}

interface Props {
  save: (object: any) => void;
  texts: Texts;
  hideBooleanValues: boolean;
}

const ResourceCreateForm: React.FC<Props> = ({
  save,
  texts,
  hideBooleanValues,
}) => {
  const { register, handleSubmit, errors, formState } = useForm<Data>();
  const { isSubmitting } = formState;
  const [resource, setApiResource] = useState<Data>(new Data());
  const router = useRouter();

  const back = () => {
    router.back();
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
            ref={register}
            id="emphasize"
            name="resource.emphasize"
            defaultChecked={resource.emphasize}
            type="checkbox"
            className="api-scope-form__checkbox"
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
            defaultChecked={resource.required}
            type="checkbox"
            className="api-scope-form__checkbox"
          />
          <HelpBox helpText={texts.required} />
        </div>
      </div>
    );
  }

  return (
    <div className="api-scope-form">
      {/* <StatusBar status={response}></StatusBar> */}
      <div className="api-scope-form__wrapper">
        <div className="api-scope-form__container">
          <h1>{texts.header}</h1>
          <div className="api-scope-form__container__form">
            <div className="api-scope-form__help">{texts.details}</div>

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
                  <label
                    htmlFor="displayName"
                    className="api-scope-form__label"
                  >
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
                    message="Display name is required"
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-scope-form__label"
                  >
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
                    defaultChecked={resource.enabled}
                    className="api-scope-form__checkbox"
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
                    defaultChecked={resource.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText={texts.showInDiscoveryDocument} />
                </div>

                <div className="api-scope-form__buttons__container">
                  <div className="api-scope-form__button__container">
                    <button
                      className="api-scope-form__button__cancel"
                      onClick={back}
                    >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCreateForm;
