const URL = 'http://localhost:3001/api';

async function LogIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const error = await response.json();
        throw error.message;
    }
}

async function LogOut() {
    await fetch(URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

const LogAPI = { LogIn, LogOut };

export default LogAPI;