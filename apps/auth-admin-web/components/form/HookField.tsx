import React from "react";
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from "react-hook-form";


interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  parent?: string
  value: number | string | null,
  errors: unknown,
}

const HookField: React.FC<FieldProps> = ({ name, label, value, errors, type = "text", required = false, placeHolder = ""}) => {
  const { register } = useForm();
    return (
      <div className={'__container__field'}>
        <label className={'__label'}>{label}</label>
        <input
          ref={register({ required: required })}
          defaultValue={value}
          autoComplete="off"
          name={name}
          type={type}
          placeholder={placeHolder}
           />       
        <ErrorMessage as="span" errors={errors} name={name} message={label + ' is required'} /> 
      </div>
    );  
};

export default HookField;
