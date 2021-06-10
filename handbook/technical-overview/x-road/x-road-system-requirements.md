# X-Road - Kerfisuppsetning

## Uppsetning og vélbúnaður

### **Uppsetning**

Klassíska uppsetningin fyrir X-Road er að setja upp fjórar vélar dev, staging og tvær fyrir prod er það gert til að tryggja hámarks uppitíma. Síðan er hægt að fara í allar útfærslur á þessu. Það er t.d. hægt að byrja með eina prod vél og bæta síðan við þegar þörf er á því.

### **Vélbúnaðarkröfur**

- 64-bita dual-core Intel, AMD eða sambærilegur örgjörvi.
- 2 CPU
- 4 GB RAM
- 10 GB diskaplás fyrir stýrikerfi \(OS partition\) og 20-40 GB laust plás á \`/var\` disksneið.
- 100 Mbps netkort.

### **Stýrikerfi**

Um tvo kosti er að velja:

- **Red Hat Enterprise Linux**
  - RHEL7
  - RHEL8
- **Ubuntu**
  - 18.04 Long-Term Support \(LTS\).
  - 20.04 Long-Term Support \(LTS\).

Fyrir uppsetningu á X-Road þarf stýrikerfisnotanda með “sudo” réttindi.

### **Net opnanir**

![network diagram](./assets/0%20%281%29.png)

- **Ytra net:**
  - Port opnanir inn að Security Server: TCP 5500 TCP 5577
  - Port opnanir út frá Security Server: TCP 5500 TCP 5577 TCP 4001 TCP 80 TCP 443
- **Innra net**
  - Port opnanir inn og út fyrir Security Server: TCP 4000 TCP 80 TCP 443

### **IP tölur Miðjunar á Íslandi**

| **IS IP Address Whitelist** | **IS - Production** | **IS test**        | **IS dev**        |
| :-------------------------- | :------------------ | :----------------- | :---------------- |
| Central Server              | 176.57.224.0/25     | 176.57.224.128/25  | 176.57.227.96/27  |
| Managment Security Server   | 176.57.224.0/25     | 176.57.224.128/25  | 176.57.227.96/27  |
| Central Monitoring Server   | **34.252.193.131**  | **34.253.108.248** | **3.250.245.108** |

**Mikilvægt** er að X-Road öryggisþjónar stofnana og fyrirtækja hafi **opið fyrir umferð frá vaktþjónum í miðju Straumsins** - _Monitoring Security Server_ (sbr. mynd að ofan) - á portum **5500 og 5577**, svo sé hægt að sinna umhverfis- og aðgerðavöktun á Straumnum.

### **IP tölur og nöfn:**

Gefa þarf upp ytri IPv4 \(og IPv6 ef hún er til staðar\) og FQDN:

- xroad-dev.&lt;lén stofnunar&gt;.is fyrir DEV umhverfið
- xroad-test.&lt;lén stofnunar&gt;.is fyrir TEST umhverfið
- xroad-prod1.&lt;lén stofnunar&gt;.is fyrir raunumhverfið.

Innri IP og host-nöfn þurfa einnig að liggja fyrir.
