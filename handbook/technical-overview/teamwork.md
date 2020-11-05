# Teamwork

Projects are developed in teams that win tender contracts with Digital Iceland. These teams come from different companies, but work in the same codebase and projects. So it is important to foster good communications and collaboration as well as to formalise responsibilities and decision-making.

The first step is to get everyone in the same room, be it online or offline. We use Slack to host discussions in multiple focused channels. This gives everyone the chance to ask questions and get feedback on what they're working on.

## Disciplines

Disciplines connect teams to discuss issues, share knowledge and make decisions.

Each discipline has a discipline manager that organises regular discipline meetings, manages agendas and publishes meeting minutes and decisions. During a discipline meeting, it's the manager's role to keep discussions productive and decide if something needs further research or a vote.

Meetings are open to interested parties but should be attended by at least one person from each active team that are part of the discipline. Discipline members can submit items to the agenda. Each item on the agenda should have an owner that presents the item and any proposals for discussion.

Discipline meetings should be used to get decisions on smaller issues and communicate best practices across teams. Larger issues and discussions should be moved to RFCs. The goal is to discuss, decide and move along.

Currently there are 3 disciplines, but this may change as needed at any time.

### Dev

Responsible for the monorepo, dependencies, tooling and shared code.

### Devops

Responsible for CI, CD, operations and monitoring.

### Design

Responsible for the brand, design system, UX and consistent design across projects.

## RFCs

**TODO**

## Architecture decision record

It is important to document all important decisions made in this project. This might, for instance, be a technology choice (e.g., PostgreSQL vs. MongoDB), a choice between a library (e.g., moment vs date-fns), or a decision on features (e.g., pagination vs infinite scroll). Design documentation is important to enable people understanding the decisions later on.

Decisions should be documented using [MADR](https://github.com/adr/madr) formatting inside the `adr` folder. Just copy `0000-template.md` to for example `0001-date-library.md` and fill in the details. Many sections can be skipped for smaller decisions.
