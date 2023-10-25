"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.NewTicket = (ticketserved) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TicketServed(servicename, servicetime, realtime) VALUES(?, ?, ?)';
        db.run(sql, [ticketserved.servicename, ticketserved.servicetime, ticketserved.realtime], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.UpdateTicket = () => {
}