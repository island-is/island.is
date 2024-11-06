# The forms folder

This folder contains all the forms that are used by the application.

At minimum there should be a prerequisites form, application form and a confirmation form to reflect the possible states of an application.
For more complecated applications you could have different forms depending on the user type and you could have more states like approved, rejected, waiting to assign...

## Organization

All forms should be in a folder with the same name as the form. The folder and files in it should follow camelCase, PascalCase should be reserved for React components.
A simple form with one screen, like the prerequisites form can be just a single file.
Form with more than one section and possibly subsections should be broken down into one file per screen.

Example folder structure:

| /prerequisitesForm
| |-- prerequisitesForm.tsx

| /applicationForm
| |-- index.ts (This file has a buildForm function)
| |-- /section1
| | |-- index.ts (This file has a buildSection function)
| | |-- /subsection1.ts (This file has a buildSubSection function)
| | |-- /subsection2.ts (This file has a buildSubSection function)
| | |-- /subsection3.ts (This file has a buildSubSection function)
| |-- /section2
| | |-- index.ts (This file has a buildSection function)
| |-- /section3
| | |-- index.ts (This file has a buildSection function)

| /confirmationForm
| |-- confirmationForm.ts
