# The forms folder

This folder contains all the forms that are used by the application.

At minimum there should be a prerequisites form, application form and a confirmation form to reflect the possible states of an application.
For more complicated applications you could have different forms depending on the user type and you could have more states like approved, rejected, waiting to assign...

See more about this in the applications /examples/example-state-transfers and /examples/example-auth-delegation

## Organization

All forms should be in a folder with the same name as the form. The folder and files in it should follow camelCase, PascalCase should be reserved for React components (/components and /fields).
A simple form with one screen, like the prerequisites form can be just a single file.
Form with more than one section and possibly subsections should be broken down into one file per screen.

## Example

| /prerequisitesForm
| |-- prerequisitesForm.tsx
| /mainForm
| |-- index.ts (This file has a buildForm function)
| |-- /section1
| | |-- index.ts (This file has a buildSection function and imports the subsection childs)
| | |-- subsection1.ts (This file has a buildSubSection function)
| | |-- subsection2.ts (This file has a buildSubSection function)
| |-- /section2
| | |-- index.ts (This file has a buildSection function)
| |-- /section3
| | |-- index.ts (This file has a buildSection function)
| /confirmationForm
| |-- confirmationForm.ts

## BuildForm, buildSection, buildSubSection and buildMultiField

Those are the four building blocks of each form.

The root of each form is a buildForm function and that is the only thing that can be imported into the state machine in the main template file.

The buildForm function has an array of children. Those children should be buildSection functions.

BuildSection will be displayed in the stepper as top level section. The children array of a buildSection can be buildSubSection, buildMultiField or a regular buildField function.

BuildSubSection is a subsection of a buildSection and will be displayed in the stepper as a subsection of the buildSection. The children array of a buildSubSection can be buildMultiField or buildField functions.

BuildMultiField is a wrapper around many buildField functions. if a buildSection or buildSubSection doesn't have a buildMultiField, it will only display one field at a time and stepping through the screens will be strange in regards to the stepper.

In most cases you want to use one buildMultiField as the child of a buildSection or buildSubSection since in most cases you want to display multiple fields at a time on the screen.
