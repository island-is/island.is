import React from "react";
import { ErrorMessage, Field } from "formik";


interface FormikFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string
}

const FormikField: React.FC<FormikFieldProps> = ({ name, label, className="input__", type = "text", required = false}) => {
  return (
    <div className={className+'__'+type}>
      <Field
        required={required}
        autoComplete="off"
        label={label}
        name={name}
        type={type}
        helperText={<ErrorMessage name={name} />}
      />
    </div>
  );
};

export default FormikField;
