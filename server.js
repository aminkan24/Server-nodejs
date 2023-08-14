const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(cors());

app.get('/getMeters', function (req, res) {
    fs.readFile(__dirname + "/" + "meters.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
        res.end(data);
    });
});

app.get('/:id', function (req, res) {
    fs.readFile(__dirname + "/meters.json", 'utf8', function (err, data) {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).json({error: 'Internal Server Error'});
        }

        const users = JSON.parse(data);
        const user = users.find(item => item.uuid === req.params.id);

        if (user) {
            console.log("Found user:", user);
            res.json(user);
        } else {
            console.log("User not found with uuid:", req.params.id);
            res.status(404).json({error: 'User not found'});
        }
    });
});

app.get('/getMeters/:date', function (req, res) {
    const desiredDate = req.params.date;

    fs.readFile(__dirname + "/" + "meters.json", 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal Server Error'});
        }

        try {
            const meters = JSON.parse(data);
            const year = desiredDate.split('-')[0];
            const day = desiredDate.split('-')[1];
            const month = desiredDate.split('-')[2];
            const formattedDesiredDate = `${year}-${month}-${day}`;

            const metersWithDesiredDate = meters.filter(meter => {
                const lastUpdateDate = new Date(meter.lastUpdateTimestamp * 1000);
                const formattedLastUpdateDate = lastUpdateDate.toISOString().split('T')[0];
                return formattedLastUpdateDate === formattedDesiredDate;
            });
            res.json(metersWithDesiredDate);
        } catch (parseError) {
            console.log(parseError);
            res.status(500).json({error: 'Error parsing JSON'});
        }
    });
});

// 404 Error Handling
app.use(function (req, res, next) {
    res.status(404).json({error: 'Not Found'});
});

const server = app.listen(8080, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("REST API demo app listening at https://%s:%s", host, port);
});
