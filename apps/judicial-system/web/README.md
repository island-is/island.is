# Judicial system

A platform for the exchange of data, information, formal decisions and notifications between parties in the Icelandic judicial system.

## Start the application locally

Install dependencies with Yarn

`yarn`

Start the backend locally. Instructions on how to do that can be found [in the backend project.](https://github.com/island-is/island.is/tree/master/apps/judicial-system/backend)

Start the application

`yarn start judicial-system-web --ssl`

Then the project should be running on https://localhost:4200/.

To skip authentication at innskraning.island.is navigate to

`/api/auth/login?nationalId=<national id>`

in the web project where `<national id>` is the national id of a known user.

You can skip `--ssl` but then authentication through innskraning.island.is will fail. The project should now be running on http://localhost:4200/.

## Running the tests

`yarn test judicial-system-web`
