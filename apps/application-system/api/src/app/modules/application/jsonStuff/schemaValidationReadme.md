# JSON Form Validation Formatting

This document outlines how to add validation rules to your JSON form definition to ensure data integrity and user feedback. Using the specified format will ensure validations are parsed and applied correctly to the respective fields.

## Table of Contents

- [Basic Structure](#basic-structure)
- [Validation Types](#validation-types)
    - [Required Field](#required-field)
    - [Email](#email)
    - [Password Length](#password-length)
    - [Number Range](#number-range)
    - [URL](#url)
    - [Pattern Matching](#pattern-matching)
    - [Enum/Option Set](#enumoption-set)
    - [Custom Validations](#custom-validations)

## Basic Structure

Each field in the JSON that requires validation should have a `validation` key. The value of this key will be an object containing validation rules specific to that field.

```json
{
    "id": "fieldName",
    "validation": {
    }
}
```

## Validation Types

### Required Field

To ensure a field is not left blank:

```json
"validation": {
    "isRequired": true,
    "message": "This field is required."
}
```

### Email

To validate the field value as an email:

```json
"validation": {
    "isEmail": true,
    "message": "Invalid email format."
}
```

### Password Length

To set a minimum length for a field (e.g., password):

```json
"validation": {
    "minLength": 8,
    "message": "Password must be at least 8 characters."
}
```

### Number Range

To ensure a numeric field's value is within a range:

```json
"validation": {
    "minValue": 18,
    "maxValue": 100,
    "message": "Must be between 18 and 100."
}
```

### URL

To validate the field value as a URL:

```json
"validation": {
    "isURL": true,
    "message": "Invalid URL format."
}
```

### Pattern Matching

For regex pattern matching, such as for phone numbers:

```json
"validation": {
    "pattern": "^(\\+?\\d{1,4}[\\s-]?)?(?!0+\\s+,?$)\\d{10}\\s*,?$",
    "message": "Invalid phone number."
}
```

### Enum/Option Set

For fields where you want the value to be one from a set list of options:

```json
"validation": {
    "allowedValues": ["Male", "Female", "Other"],
    "message": "Invalid selection."
}
```

---

Remember to structure your JSON as outlined above to ensure the validation parser correctly interprets and applies each rule. If additional validation rules are added in the future, this document will be updated accordingly.
