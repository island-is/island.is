# The lib folder

This folder contains all the data schema, messages, and the main template file.

## Data schema

The data schema defines what the answer object should look like. All validation is done with zod.

## Messages

Messages can either be one single file with all messages needed for the application. If more organization is needed, /messages can also be a folder with the messages split up into multiple files.

## Main template file

The main template file holds the state machine for the application. It defines how the application should flow from one state to the next and which form to load in each state. Here you can also leverage the `mapUserToRole` function to define which role the user has in the application. This allows you to display different forms to different users even if the application is in the same state. This can be usefull for applications that can both be done as an individual and as a procurer.

The state machine also holds the actions that are run when the application is in a certain state.

## Example

|-- lib/
|-- |-- dataSchema.ts
|-- |-- /messages/
|-- |-- |-- index.ts (Exports all messages from the other files)
|-- |-- |-- preRequisitesMessages.ts
|-- |-- |-- applicationMessages.ts
|-- |-- |-- confirmationMessages.ts
|-- |-- template.ts
