# DATABASE : 

## Services :
This table is about the services of the office.
### Attributes:
- id: Integer identifier (unique by default -> list length)
- servicename: Name of the service (unique if possible to avoid any misunderstanding)
- servicetime: these values are set by default. If the Admin wants to change them, he should have a dedicated query to update them 

## Officers :
This table represent the HR of the organization.
### Attributes:
- id: Integer identifier for the row 
- name 
- surname
- email: All the emails are in the format: "[name].[surname]@email.com"
- password: Encrypted 32-byte password 
- salt: Random number
- admin: Binary flag to identify the administrator(s)

#### NOTE:
The password is "password" for everybody.

## Bridge :
This table contains the services performed by the officers.
### Attributes:
- officer_id: Officer identifier
- service_id: Service identifier 

## TicketsServed :
This table should store all the ticket served. Empty by default.
### Attributes:
- id: Ticket identifier
- servicename: Related to the name stored in the "Services" table, must be the same in order to sort the tickets served during a period of time
- starttime: customer service processing start time
- endtime: customer service processing end time 

# API documentation
API documentation is available at this link: 
https://universal-meadow-271131.postman.co/workspace/Team-Workspace~3b089187-f90b-4e4d-8014-310a332a3a45/collection27363631-4a96304a-ec0b-4f76-b35e-ddc1226963db?action=share&creator=27363631

# POSSIBLE IMPLEMENTATIONS:
Related to the problem given and all his stories some ideas are given below for the API implementation:

- "Client get a ticket": The client only need to know the names of the services, so the query should only be a selection of all the names and no more, the extimated queue time will be given by a function stored in the front end 
- "Officer serve the next client": An event should trigger the insertion in the table "TicketServed". In the API, the insertion requires a call to the table "Services" by the "ServiceName", so the ServiceTime will be available
- "Admin want to make stats": The table "TicketServed" has the infos about the effective time required to serve clients, so the solution could be extract the total amount of time for each service and then divide by the number of tickets over that service to obtain the average time at first  
