import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

async function GetServicesName() {
    const response = await fetch(URL + '/services', { credentials: 'include' });
    const services = await response.json();
    if (response.ok) {
        return services.map((e) => ({
            servicename: e.servicename,
            servicetime: e.servicetime
        }))
    } else {
        throw services;
    }
}

async function GetServiceTime(servicename) {
    const response = await fetch(URL + `/${servicename}/servicetime`, { credentials: 'include' });
    const obj = await response.json();
    if (response.ok) {
        return obj.servicetime;
    } else {
        throw obj;
    }
}

async function SetNewServiceTime(servicetime, servicename) {
    const response = await fetch(URL + `/updatetime`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicename, servicetime })
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

async function NewTicket(servicename) {
    const response = await fetch(URL + '/tickets/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicename })
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

async function GetWaitingTickets() {
    const response = await fetch(URL + `/tickets`, { credentials: 'include' });
    const obj = await response.json();
    if (response.ok) {
    let tickets = obj.map((o) => ({ id: o.id, servicename: o.servicename, requesttime: dayjs(o.requesttime) }))

        return tickets;
    } else {
        throw obj;
    }
}

async function GetNextTicket(servicename) {
    const response = await fetch(URL + `/tickets/${servicename}`, { credentials: 'include' });
    const obj = await response.json();
    if (response.ok) {
        let ticket = {
            id: obj.id,
            servicename: obj.servicename
        }

        return ticket;
    } else {
        throw obj;
    }
}

async function UpdateTicket(id) {
    const response = await fetch(URL + '/tickets/update', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
}

async function DeleteTicket(id) {
    const response = await fetch(URL + `/tickets/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    const result = await response.json();

    if (!response.ok) {
        throw result;
    }
}

async function GetNumberOfServicePerOfficier(id) {
    const response = await fetch(URL + `/services/${id}`, { credentials: 'include' });
    const obj = await response.json();
    if (response.ok) {
        return obj.numservices;
    } else {
        throw obj;
    }
}

const DataAPI = { GetServicesName, GetWaitingTickets, GetServiceTime, SetNewServiceTime, NewTicket, GetNextTicket, UpdateTicket, DeleteTicket, GetNumberOfServicePerOfficier };

export default DataAPI;