# communications

Endpoint to route information to service desk

## Running unit tests

Run `yarn test api-domains-communications` to execute the unit tests via [Jest](https://jestjs.io).

## Injecting form field values into the email subject

The `emailSubject` field on a `form` entry in Contentful can reference the values that the user
entered by wrapping a form field reference in square brackets:

```
[3xAmPl3F13ldId] - New request
```

A form field can be referenced by its Contentful entry id or its `name` (case insensitive).
The field `title` can not be used, since it's the user facing label and is expected to change.
Tokens that don't match any field on the form are left untouched, so a typo shows up in the
subject instead of silently disappearing.

Values are stripped of newlines and truncated to 100 characters. If the subject ends up empty
(for example when it only consists of fields that the user left blank) the default
`Island.is form: <form title>` subject is used instead.
