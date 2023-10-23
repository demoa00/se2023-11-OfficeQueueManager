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
