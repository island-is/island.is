# **Intervention by code change**
#
If a fault is diagnosed which needs code change then the software support should follow these guidelines:

1. Retrieve the version of the system which is currently on *Prod*.
2. Fix the bug.
3. Commit changes to the *Dev* environment.
4. Test the bug-fix on *Dev*.
5. If the bug is fixed and all tests are successful, then request a release of the fixed version on *Staging* environment.
6. If tests succeed on *Staging* then a third-party will release the new version on *Prod* environment.
