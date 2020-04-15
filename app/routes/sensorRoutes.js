var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

var dbConn = require('../models/database');

module.exports = function(app) {
    app.get('/api/sensors', function (req, res) {
        dbConn.query('SELECT * FROM Sensors', function (error, results, fields) {
            if (error) throw error;
            return res.send({error: false, data: results, message: 'Sensor List.'});
        });
    });

    app.post('/api/sensors', function (req, res) {
        let floorNo = req.body.floorNo;
        let roomNo = req.body.roomNo;
        let smokeLevel = req.body.smokeLevel;
        let Co2Level = req.body.Co2Level;

        if (!floorNo || !roomNo || !smokeLevel || !Co2Level) {
            return res.status(400).send({error: true, message: 'Please Enter sensor details'});
        }

        dbConn.query("INSERT INTO Sensors SET ?",{floorNo:floorNo, roomNo:roomNo,smokeLevel:smokeLevel,Co2Level:Co2Level},function (error, results, fields) {
            if (error) throw error;
            return res.send({
                error: false,
                data: results,
                message: 'New sensor has been added to the system successfully.'
            });
        });
    });

    app.put('/api/sensors', function (req, res) {
        let sensor_id = req.body.Id;
        let smokeLevel = req.body.smokeLevel;
        let Co2Level = req.body.Co2Level;

        if (!sensor_id||!smokeLevel || !Co2Level) {
            return res.status(400).send({ message: 'Please provide sensor details and sensor id' });
        }
        dbConn.query("UPDATE Sensors SET smokeLevel = ?,Co2Level = ?  WHERE id = ?", [smokeLevel,Co2Level, sensor_id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'sensor has been updated successfully.' });
        });
    });

    app.delete('/api/sensors', function (req, res) {
        let sensor_id = req.body.Id;

        if (!sensor_id) {
            return res.status(400).send({ error: true, message: 'Please select a sensor' });
        }
        dbConn.query('DELETE FROM Sensors WHERE Id = ?', [sensor_id], function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'Sensor has been deleted successfully.' });
        });
    });

}