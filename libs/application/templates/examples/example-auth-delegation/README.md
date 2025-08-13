# example-auth-delegation

This application is an example for how applications should handle different types of auth delegations.

Delegations can be:

- Custom (Regular login)
- Procuration Holder (Prókúra)
- Legal Guardian (Forsjá)
- Legal Guardian Minor (Forsjá)
- Personal Representative (Umboð)
- Legal Representative (Umboð)
- General Mandate (Umboð)
- ... (allsherjarumboð)

## Gervimenn to use

This application works for every gervimaður and all delegations.
You can for example use Gervimaður Færeyjar (010-2399) and they have delegations for the company 65° Arctic and Bína Maack

## How to use

The stateflow is as basic as possible.

1. Prerequisites
2. Main form
3. Conclusion

The main form looks at the type of delegation and loads and displays the correct main form for that type of delegation.
Having custom forms for prerequisits and conclusion works exactly the same way.

## Running unit tests

Run `nx test example-auth-delegation` to execute the unit tests via [Jest](https://jestjs.io).
