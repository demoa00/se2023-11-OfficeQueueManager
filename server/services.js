"use strict";

const sqlite = require('sqlite3');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.GetServicesName = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT servicename FROM Services ';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const services = rows.map((e) => ({
                servicename: e.servicename
            }
            ));
            resolve(services);
        });
    });
}

exports.GetExtimatedTime = (servicename) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT extimatedtime FROM Services WHERE servicename = ? ';
        db.all(sql, [servicename], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const extimatedtime = rows.map((e) => ({
                extimatedtime: e.extimatedtime
            }
            ));
            resolve(extimatedtime);
        });
    });
}

exports.SetNewExtimatedTime = (servicename, time) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Services SET extimatedtime = ? WHERE servicename = ?';
        db.run(sql, [time, servicename], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.AddService = (service) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Services(servicename, extimatedtime) VALUES(?, ?)';
        db.run(sql, [service.servicename, service.extimatedtime], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

// NON-required functionalities:

/*
exports.GetServiceId = (servicename) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM Services WHERE servicename = ? ';
        db.all(sql, [servicename], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const id = rows.map((e) => ({
                id: e.id
            }
            ));
            resolve(id);
        });
    });
}


exports.RemoveService = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Services WHERE id = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            } else
                resolve(this.changes);
        });
    });
}
*/