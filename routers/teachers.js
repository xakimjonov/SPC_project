const express = require("express");
const router = express.Router();
const database = require('../database/data.js')


router.post('/', (req, res) => {
    let body = req.body
    if (!(body.id && body.name && body.surname)) {
        res.status(400).send("You should enter all vital infos:(id, name, surname)")
        return
    }
    for (let i = 0; i < database.readData().teachers.length; i++) {
        const elm = database.readData().teachers[i];
        if (elm.id == body.id) {
            res.status(404).send(`id:${body.id} is not available ,change id`)
            return
        }
    }
    body.savedTime = Date();

    let data = database.readData()
    data.teachers.push(body)
    database.writeData(data)
    res.status(201).send("Successfully  Saved")
})
      
router.get('/', (req, res) => {
    let data = database.readData()
    let name = req.query.name
    if (!name) {
        res.json(data.teachers)
    }
    let list = data.teachers.filter(e => (e.name + " " + e.surname).toLowerCase().includes(name.toLowerCase()))

    if (!list.length ) {
        res.status(404).send("teacher is not found!")
        return
    } else {
         res.json(list)
        return
    }
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let data = database.readData()
    let teachers = data.teachers.find(e => e.id == id)
    if (!teachers) {
        res.status(400).send(` there is no teacher with id:${id}`);
        return
    }
    res.status(200).json(teachers)
})

router.put('/', (req, res) => {
    let data = database.readData()
    let body = req.body
    console.log(body)
    let teachers = data.teachers.find(e => e.id == body.id)

    if (!teachers) {
        res.status(400).send(`there is no teacher with id:${body.id}`);
        return
    }
    for (let i = 0; i < data.teachers.length; i++) {
        const elm = data.teachers[i];
        if (elm.id == body.id) {
            body.savedTime = data.teachers[i].savedTime
            body.updatedTime = new Date()
            data.teachers[i] = body
            break;
        }
    }
    database.writeData(data)
    res.status(200).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let data = database.readData()
    let id = req.params.id
    let teachers = data.teachers.find(e => e.id == id)
    if (!teachers) {
        res.status(400).send(`id:${id} is not found `);
        return
    }

    data.teachers = data.teachers.filter(e => e.id != id)
    database.writeData(data)
    res.status(201).send("Successfully deleted")
})

module.exports = router;