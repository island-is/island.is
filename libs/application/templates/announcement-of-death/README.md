```markdown
## Application Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Heklugátt as Heklugátt
    participant Sýsla as Sýsla
    participant PósthólfIsland as Pósthólf island.is
    participant AppSystem as ApplicationSystem
    participant UserProfile as UserProfile
    participant Samgöngustofa as Samgöngustofa
    participant Þjóðskrá as Þjóðskrá

    Heklugátt->>Sýsla: Notice is sent
    Sýsla->>PósthólfIsland: Message sent to inbox
    PósthólfIsland->>AppSystem: Application started

    AppSystem->>+Sýsla: meta.onEntry triggers for initial state
    Sýsla-->>-AppSystem: Data persists to application in ApplicationController::Create

    AppSystem->>+UserProfile: Request user data
    UserProfile-->>-AppSystem: Response

    AppSystem->>+Samgöngustofa: Request vehicle data
    Samgöngustofa-->>-AppSystem: Response

    AppSystem->>+Þjóðskrá: Request personal data
    Þjóðskrá-->>-AppSystem: Response

    AppSystem--)Sýsla: Application finalised and delivered
```
```