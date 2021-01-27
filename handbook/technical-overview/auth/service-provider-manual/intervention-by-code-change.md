# Intervention by Code Change in Auth System

If a fault is diagnosed which needs code change then the software support should follow these guidelines:

1. Retrieve the version of the system which is currently on _Prod_.
2. Fix the bug.
3. Commit changes to the _Dev_ environment.
4. Test the bug-fix on _Dev_.
5. If the bug is fixed and all tests are successful, then request a release of the fixed version on _Staging_ environment.
6. If tests succeed on _Staging_ then a third-party will release the new version on _Prod_ environment.
