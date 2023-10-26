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

exports.getNextTicket = async (ticket) => {
    const firstTicket_1 = await new Promise((resolve, reject) => {
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
    });
    return await new Promise((resolve_1, reject_1) => {
        const sql_2 = "UPDATE TicketsServed SET starttime = ? WHERE id = ? AND starttime IS NULL";
        db.run(sql_2, [JSON.stringify(dayjs()), firstTicket_1.id], function (err_1) {
            if (err_1) {
                reject_1(err_1);
                return;
            }

            resolve_1(firstTicket_1);
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