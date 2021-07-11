
const express = require('express');
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser')
const { PORT, MONGO_URL } = require("./config.json");

app.use(bodyParser.json({ limit: "1000mb", extended: true }));
const data = require('./data.json');
const listIds = []
app.get('/problem-2', (req, res) => {
    data.domains.forEach(({ list, children }) => {
        list ? extractListId(list) :
            children.forEach(({ list, children }) => children.forEach(({ list, children }) => list ? extractListId(list) : children.forEach(({ list, children }) => extractListId(list))))
    })
    res.send(listIds);
});
function extractListId(list) {
    list.forEach(({ listId }) => {
        listIds.push(listId)
    });
}

function flatten(arr) {
    return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur) : cur), []);
};

app.use('/employee', require('./controller/employee-controller'))
app.use('/company', require('./controller/comapny-controller'))

// Connect Server
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));

// Connect mongo db
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (error) => {
        if (error) console.log("MongoDB connection error", error);
        else console.log(`MongoDB connected successfully.`);
    }
);

