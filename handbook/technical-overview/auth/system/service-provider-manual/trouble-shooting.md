# Trouble Shooting

The [Datadog](https://app.datadoghq.eu/) webpage for Digital Iceland can be useful when diagnosing faults.

- In the search bar filters can be added, for instance a part of an URI or status errors like 403, 404, 500 etc.
- Choose the time-period which the log-list is supposed to cover in the drop-down panel on the top-right. For best performance select short time span, for example **Past 15 minutes**. If **Live Tail** is selected then the service can be monitored in real time.

![Trouble-shooting/untitled.png](trouble-shooting/untitled.png)

![trouble-shooting/untitled-1.png](trouble-shooting/untitled-1.png)

- Select **Logs** from the toolbar on the left when entering the page.
- After that select the appropriate environment that you want to look at from the **Env**

![trouble-shooting/untitled-2.png](trouble-shooting/untitled-2.png)

- Then choose **identity-server** and **services-auth-api** as a **Service**.
- If the purpose is to follow the admin service then choose **services-auth-admin-api** as a **Service**.
- Finally select the **Status** that the list is going to show. Check into the appropriate status. When looking for errors check into the following: **Emergency**, **Alert**, **Critical** and **Error**.

![trouble-shooting/untitled-3.png](trouble-shooting/untitled-3.png)

- Now the list should show the faults which have been diagnosed in Datadog. Further information about the content of the chosen log will appear if a line from the list is selected. The selected log can be exported:

![trouble-shooting/untitled-4.png](trouble-shooting/untitled-4.png)

![trouble-shooting/untitled-5.png](trouble-shooting/untitled-5.png)
