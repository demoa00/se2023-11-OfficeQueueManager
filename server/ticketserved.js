"use strict";

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.NewTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO TicketsServed(servicename, requesttime) VALUES(?, ?)';
        db.run(sql, [ticket.servicename, ticket.requesttime], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

exports.GetWaitingTickets = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM TicketsServed WHERE starttime IS NULL';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length <= 0) {
                reject(0);
                return;
            }

            let tickets = rows.map((r) => ({
                id: r.id, servicename: r.servicename, requesttime: dayjs(JSON.parse(r.requesttime))
            })).sort((a, b) => a.requesttime.diff(b.requesttime));

            resolve(tickets);
        });
    });
}

exports.GetNextTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, servicename, requesttime FROM TicketsServed WHERE servicename = ? AND starttime IS NULL';
        db.all(sql, [ticket.servicename], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length <= 0) {
                reject(0);
                return;
            }

            let firstTicket = rows.map((r) => ({
                id: r.id, servicename: r.servicename, requesttime: dayjs(JSON.parse(r.requesttime))
            })).sort((a, b) => b.requesttime.diff(a.requesttime)).pop();

            resolve(firstTicket);
        });
    }).then((firstTicket) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE TicketsServed SET starttime = ? WHERE id = ? AND starttime IS NULL";
            db.run(sql, [JSON.stringify(dayjs()), firstTicket.id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(firstTicket);
            });
        });
    });
}

exports.updateEndTimeTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE TicketsServed SET endtime = ? WHERE id = ? AND endtime IS NULL";
        db.run(sql, [ticket.endtime, ticket.id], function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.changes);
        })
    });
}

exports.DeleteTicket = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM TicketsServed WHERE id=?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }

            if (this.changes == 0) {
                reject(0);
            } else {
                resolve(this.changes);
            }
        })
    });
}
