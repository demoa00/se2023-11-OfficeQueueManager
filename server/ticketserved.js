"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.NewTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TicketsServed(servicename, starttime) VALUES(?, ?)';
        db.run(sql, [ticket.servicename, ticket.starttime], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.UpdateTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE TicketsServed SET endtime = ? WHERE id = ?';
        db.run(sql, [ticket.endtime, ticket.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}