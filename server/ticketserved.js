"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.NewTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TicketServed(servicename, servicetime) VALUES(?, ?)';
        db.run(sql, [ticket.servicename, ticket.servicetime], function (err) {
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
        const sql = 'UPDATE TicketServed SET realtime = ? WHERE id = ?';
        db.run(sql, [ticket.realtime, ticket.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}