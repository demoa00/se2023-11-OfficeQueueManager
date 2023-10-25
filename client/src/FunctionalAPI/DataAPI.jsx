const URL = 'http://localhost:3001/api';

async function GetServicesName() {
    const response = await fetch(URL + '/services', {credentials: 'include'} );
    const services = await response.json();
    if (response.ok) {
        return services.map((e) => ({ 
            servicename: e.servicename,
         }))
    } else {
        throw services;
    }
}

async function GetServiceTime(servicename) {
    const response = await fetch(URL + `/${servicename}/servicetime`, {credentials: 'include'} );
    const obj = await response.json();
    if (response.ok) {
        return obj.servicetime;
    } else {
        throw obj;
    }
}

async function SetNewServiceTime(servicetime) {
    const response = await fetch(URL + `/${servicename}/updatetime`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({servicetime})
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

async function AddService(service) {
    const response = await fetch(URL + '/services/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

async function AddTicketServed(ticketserved) {
    const response = await fetch(URL + '/tickets/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketserved)
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

const DataAPI = { GetServicesName, GetServiceTime, SetNewServiceTime, AddService, AddTicketServed };

export default DataAPI;