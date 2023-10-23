# DATABASE : 
## Services :
This table is about the services of the office.
### Attributes:
- ServiceID: Integer identifier (unique by default -> list length)
- ServiceName: Name of the service (unique if possible to avoid any misunderstanding)
- ExtimatedTime: these values are set by default. If the Admin wants to change them, he should have a dedicated query to update them 
## Officier :
This table represent the HR of the organization.
### Attributes:
- OfficierID: Integer identifier for the row 
- Name 
- Surname
- Email: All the emails are in the format: "[name].[surname]@email.com"
- Password: Encrypted 32-byte password 
- Salt: Key to decrypt the password
- IsAdmin: Binary flag to identify the administrator(s)
- Services: List of services each officier is able to serve. Empty by default. These data should have the JSON format: {services: [list of services]; };
#### NOTE:
The password is "password" for everybody.
## Ticket Served :
This table should store all the ticket served. Empty by default.
### Attributes:
- TicketID: Ticket identifier
- ServiceName: Related to the name stored in the "Services" table, must be the same in order to sort the tickets served during a period of time
- ExtimatedTime: Time acquired from the "Services" table
- RealTime: Effective amount of time required to serve a client

# POSSIBLE IMPLEMENTATIONS:
Related to the problem given and all his stories some ideas are given below for the API implementation:

- "Client get a ticket": The client only need to know the names of the services, so the query should only be a selection of all the names and no more, the extimated queue time will be given by a function stored in the front end 
- "Officier serve the next client": An event should trigger the insertion in the table "TicketServed". In the API, the insertion requires a call to the table "Services" by the "ServiceName", so the ExtimatedTime will be available
- "Admin want to make stats": The table "TicketServed" has the infos about the effective time required to serve clients, so the solution could be extract the total amount of time for each service and then divide by the number of tickets over that service to obtain the average time at first  
