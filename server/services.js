"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.GetServicesName = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, servicename FROM Services ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const services = rows.map((e) => ({
                id: e.id,
                servicename: e.servicename,
                servicetime: e.servicetime
            }
            ));
            resolve(services);
        });
    });
}

exports.GetServiceTime = (serviceName) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT servicetime FROM Services WHERE servicename = ? ';
        db.get(sql, [serviceName], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({servicetime: rows.servicetime});
        });
    });
}

exports.SetNewServiceTime = (service) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Services SET servicetime = ? WHERE servicename = ?';
        db.run(sql, [service.servicetime, service.servicename], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}
