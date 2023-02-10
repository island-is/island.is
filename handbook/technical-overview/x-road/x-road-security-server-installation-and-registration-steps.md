# Straumurinn - Security Server Installation and Registration Steps

## Security Server installation and registration steps

### Hardware requirements

- 64-bit dual-core Intel, AMD or compatible CPU; AES instruction set support is highly recommended
- 2 CPU
- 4 GB RAM
- 10 GB free disk space \(OS partition\) and 20-40 GB free disk space on the “/var” partition
- 100 Mbps network interface card

### Operating System, choice of either

- Red Hat Enterprise Linux 7.3 \(RHEL7\) or newer.
- Ubuntu 18.04 Long-Term Support \(LTS\).
- Ubuntu 20.04 Long-Term Support \(LTS\).

### Network configuration

The X-Road Security Servers mediate service calls and service responses between Information Systems. They can be placed in a DMZ between the Information Systems they serve and the Internet. Port openings can be configured like so:

- **External network:**
  - Inbound: TCP 5500 TCP 5577
  - Outbound: TCP 5500 TCP 5577 TCP 4001 TCP 80 TCP 443
- **Internal network:**
  - Inbound and outbound: TCP 4000 TCP 80 TCP 443
- On a RedHat 7 / CentOS 7 or Ubuntu 18.04 LTS machine, consult the X-Road Knowledge Base how-to article [How to Set Up a Security Server?](https://confluence.niis.org/pages/viewpage.action?pageId=4292920) while taking care to override the official documentation with specific steps for the Icelandic environment \(_Straumurinn_\), outlined at: [https://github.com/digitaliceland/Straumurinn](https://github.com/digitaliceland/Straumurinn#getting-started-installing-security-server-and-intial-configuration)
- Add OS user to run the X-Road server: `sudo useradd --system --home /var/lib/xroad --no-create-home --shell /bin/bash --user-group --comment "X-Road system user" xroad` If that user will be used for interactive SSH log-ins, then so the Security Server PIN won't be cleared \(even though auto-login is configured\), the following command can be entered: `loginctl enable-linger xroad`
- During installation, dialog will appear asking for host and IP information for certificate generation. The latter set of the dialog will be for configuring certificates for the xroad-proxy-ui-api. Here it may be desirable to change the value from the auto-detected machine host name to a domain name used for accessing the Admin UI:

  ![](./assets/0%20%282%29.png)

  ![](./assets/1%20%281%29.png)

- Once a Security Server has been successfully installed, the Admin UI can be opened in a web browser at [https://SECURITYSERVER:4000/](https://securityserver:4000/) . After logging in with the user credentials declared during the installation process, a prompt for importing a Configuration Anchor is displayed. The configuration anchors for each environment \(IS-DEV, IS-TEST, IS\) are linked to at: [https://github.com/digitaliceland/Straumurinn\#getting-started-installing-security-server-and-intial-configuration](https://github.com/digitaliceland/Straumurinn#getting-started-installing-security-server-and-intial-configuration)
- Before being able to import a Configuration Anchor, the Security Server IP and FQDN must be whitelisted by the operator of the _Straumurinn_ X-Road central services. To start the _Straumurinn_ application process, the information \(IP, FQDN and the organization’s SSN \(should be obtained from the organization contact\)\) should be sent to [hjalp@ok.is](mailto:hjalp@ok.is)

The public IP address of requests originating within the server can be found with with the following command

```text
curl ifconfig.me
```

### Registration Email for Security Server to Central \(example\)

![](./assets/image%20%285%29.png)

### After the server has been registered in Central

- During a [Security Server initial configuration](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/ig-ss_x-road_v6_security_server_installation_guide.md#3-security-server-initial-configuration), a PIN is required to be set, which should be a 12 digit, alpha-numeric password: [https://en.wikipedia.org/wiki/Personal_identification_number](https://en.wikipedia.org/wiki/Personal_identification_number) [https://en.wikipedia.org/wiki/ISO_9564\#PIN_length](https://en.wikipedia.org/wiki/ISO_9564#PIN_length)
- Disable message payload logging \(for now, due to GDPR\).

  The xroad-securityserver-is variant has the message logging disabled by default, from X-Road version 6.24.0 onwards.

- For PIN to be entered automatically when starting X-Road services, follow this guide: [https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/Utils/ug-autologin_x-road_v6_autologin_user_guide.md](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/Utils/ug-autologin_x-road_v6_autologin_user_guide.md)
- Starting and stopping X-Road services to test the PIN entry functionality:

```bash
for i in xroad-confclient xroad-proxy xroad-signer xroad-monitor xroad-opmonitor xroad-proxy-ui-api ;do echo "stopping $i"; sudo service $i stop;done
sudo systemctl list-units "xroad*"
for i in xroad-confclient xroad-proxy xroad-signer xroad-monitor xroad-opmonitor xroad-proxy-ui-api ;do echo "starting $i"; sudo service $i start;done
```

- Check if all services are up and running

```bash
sudo systemctl list-units "xroad*"
```

- Enable health check endpoint: [https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/LoadBalancing/ig-xlb_x-road_external_load_balancer_installation_guide.md\#34-health-check-service-configuration](https://github.com/nordic-institute/X-Road/blob/develop/doc/Manuals/LoadBalancing/ig-xlb_x-road_external_load_balancer_installation_guide.md#34-health-check-service-configuration)

### Generate CSR certificates and import Anchors

![](./assets/4%20%281%29.png)

In the next screen a configuration anchor is requested. Upload the configuration anchor from the central server.

![](./assets/5.png)

Press UPLOAD to upload the anchor

![](./assets/6.png)

After anchor has been uploaded needs to be confirmed.

Check that the "Hash Generated" corresponds to the information on the Central Server.

Press CONFIRM.

![](./assets/7.png)

In the initial configuration screen input the values as follows.

- Member Class - the Member Class of the organization that maintains the central server.
- Member Code - the Member Code of the organization that maintains the central server.
- Member Name - is auto completed when Member Code is added.
- Security Server Code - unique code identifying the Security Server.
  - Use short-name for Server Code
  - Do not use FQDN, ".", "/" or "\".
    - Some extensions use dots as separators, e.g. REST Adapter Service.
  - X-Road Message Protocol imposes some restrictions on the characters that can be used in X-Road identifiers. The following characters SHALL NOT be used in the identifier values:
    - Colon
    - Semicolon
    - Slash
    - Backslash
    - Percent
    - Path identifiers \(such as /../\)
    - Non-printable characters \(tab, newline etc.\)
  - [https://github.com/nordic-institute/X-Road/blob/6d60774c0b4e5368e70943c17a2ae6dfaa513259/doc/Protocols/pr-mess_x-road_message_protocol.md\#27-identifier-character-restrictions](https://github.com/nordic-institute/X-Road/blob/6d60774c0b4e5368e70943c17a2ae6dfaa513259/doc/Protocols/pr-mess_x-road_message_protocol.md#27-identifier-character-restrictions)
  - [https://github.com/nordic-institute/X-Road/blob/6d60774c0b4e5368e70943c17a2ae6dfaa513259/doc/Protocols/pr-rest_x-road_message_protocol_for_rest.md\#48-identifier-character-restrictions](https://github.com/nordic-institute/X-Road/blob/6d60774c0b4e5368e70943c17a2ae6dfaa513259/doc/Protocols/pr-rest_x-road_message_protocol_for_rest.md#48-identifier-character-restrictions)
- PIN - the password that protects the security server's secret keys.
- Repeat PIN - repeat the above PIN.
- Press SUBMIT.

![](./assets/8.png)

![](./assets/9%20%281%29.png)

The initial configuration was saved successfully.

![](./assets/10%20%281%29.png)

The security server asks for PIN code.

Follow the link Please enter soft token PIN.

![](./assets/11%20%281%29.png)

Clicking the links navigates to Keys and Certificates page.

Press LOG IN.

Enter PIN Code  
Then Press LOG IN

![](./assets/12.png)

The red error message bar disappears

Next is Time stamping.  
Go to: Settings &gt; Timestamping Services &gt; ADD

![](./assets/13%20%281%29.png)

Pick time-stamping service from the list.

Press OK.

![](./assets/14%20%281%29.png)

Timestamping message added will appears.

![](./assets/15.png)

Next step is to add Keys and Certificates  
Open KEYS AND CERTIFICATES

![](./assets/16%20%281%29.png)

Press ADD KEY  
Start making sign key

![](./assets/17.png)

Enter ”sign”  
Choose SIGNING And Client  
Change to PEM in CSR Format

![](./assets/18.png)

Press GENERATE CSR

![](./assets/19%20%281%29.png)

Press DONE

![](./assets/20%20%281%29.png)

![](./assets/21%20%281%29.png)

The certificate request is downloaded to browser's download folder.

Now make auth key  
Enter “auth” and press NEXT

![](./assets/22.png)

Choose AUTHENTICATON and change CSR Format to PEM

![](./assets/23.png)

Enter your Server DNS name \(CN\)

![](./assets/24%20%281%29.png)

Press GENERATE CSR

![](./assets/25.png)

The certificate request is downloaded to browser's download folder.

![](./assets/26%20%281%29.png)

Now you can see that there are two keys in the overview, Sign and Auth.

The certificate request should be sent to [hjalp@ok.is](mailto:hjalp@ok.is).

### Importing signed certifications

Open KEYS AND CERTIFICATIONS and press IMPORT CERT.

![](./assets/27.png)

![](./assets/28%20%281%29.png)

Activate auth signed certificate, needs to click the name of the certificate \(test.xrd.island.is...\) and press Activate

SCREENSHOT NEEDED

![](./assets/29.png)

![](./assets/30.png)

![](./assets/31%20%281%29.png)

Finally press **Register** on the auth certificate and enter inn the FQDN of the server and press ADD

![](./assets/32%20%281%29.png)

![](./assets/33.png)

![](./assets/34%20%281%29.png)

### Confirm communication between two security servers

```bash
curl --insecure -H "X-Road-Client: IS-TEST/COM/5302922079/Origo-client" "
https://origo-staging.xroad.coldcloudlab.com/r1/IS-TEST/GOV/7005942039/VMST-Protected/APIS/company?name=origo
"
```

IS-**DEV**

**Ísland.is to Skatturinn**:

```bash
curl -H "X-Road-Client: IS-DEV/GOV/10000/island-is-client" "http://localhost:8080/r1/IS-DEV/GOV/10006/Skatturinn-Protected/APIS-v1/company?name=skatturinn"
```

IS-**TEST**

**Ísland.is to Skatturinn:**

```bash
curl -H "X-Road-Client: IS-TEST/GOV/5501692829/island-is-client" "http://localhost:8080/r1/IS-TEST/GOV/5402696029/Skatturinn-Protected/APIS-v1/company?name=skatturinn"
```

### Removal of Security Server

#### Ubuntu

```bash
#!/bin/bash

set -x
sudo apt-get purge xroad-base
sudo apt-get autoremove
sudo rm -rf /etc/xroad
sudo rm -rf /usr/share/xroad
sudo rm -rf /var/lib/xroad
sudo rm -rf /var/log/xroad
sudo rm -rf /var/tmp/xroad
sudo apt-get purge nginx
sudo -u postgres dropdb messagelog
sudo -u postgres dropdb serverconf
sudo -u postgres dropdb op-monitor
sudo -u postgres psql -c "drop user serverconf"
sudo -u postgres psql -c "drop user messagelog"
sudo -u postgres psql -c "drop user opmonitor"
sudo -u postgres psql -c "drop user serverconf_admin"
sudo -u postgres psql -c "drop user messagelog_admin"
sudo -u postgres psql -c "drop user opmonitor_admin"
sudo apt-get --purge remove postgresql\*
sudo rm -rf /etc/postgresql/
sudo rm -rf /var/lib/postgresql
sudo userdel -r postgres
```

#### RHEL

```bash
#!/bin/bash

set -x

sudo yum remove xroad-base
sudo rm -rf /etc/xroad
sudo rm -rf /usr/share/xroad
sudo rm -rf /var/lib/xroad
sudo rm -rf /var/log/xroad
sudo rm -rf /var/tmp/xroad
sudo yum remove nginx
sudo -u postgres dropdb messagelog
sudo -u postgres dropdb serverconf
sudo -u postgres psql -c "drop user serverconf"
sudo yum remove postgresql
```
