# Trouble Shooting

The [Datadog](https://app.datadoghq.eu/) webpage for [Digital Iceland](https://island.is/) can be useful when diagnosing faults.

- In the search bar filters can be added, for instance a part of an URI or status errors like 403, 404, 500 etc.
- Choose the time-period which the log-list is supposed to cover in the drop-down panel on the top-right. For best performance select short time span, for example _Past 15 minutes_. If _Live Tail_ is selected then the service can be monitored in real time.

![trouble-shooting/untitled.png](trouble-shooting/untitled.png)

![trouble-shooting/untitled-1.png](trouble-shooting/untitled-1.png)

- Select _Logs_ from the toolbar on the left when entering the page.
- After that select the appropriate environment that you want to look at from the _Env_

![trouble-shooting/untitled-2.png](trouble-shooting/untitled-2.png)

- Then choose _identity-server_ and _services-auth-api_ as a _Service_.
- If the purpose is to follow the admin service then choose _services-auth-admin-api_ as a _Service_.
- Finally select the _Status_ that the list is going to show. Check into the appropriate status. When looking for errors check into the following: _Emergency_, _Alert_, _Critical_ and _Error_.

![trouble-shooting/untitled-3.png](trouble-shooting/untitled-3.png)

- Now the list should show the faults which have been diagnosed in [Datadog](https://app.datadoghq.eu/). Further information about the content of the chosen log will appear if a line from the list is selected. The selected log can be exported:

![trouble-shooting/untitled-4.png](trouble-shooting/untitled-4.png)

![trouble-shooting/untitled-5.png](trouble-shooting/untitled-5.png)
