const express = require("express");
const router = express.Router();
const database = require('../database/data.js')

router.post('/', (req, res) => {
    let body = req.body
    if (!(body.id && body.name && body.surname && body.phone)) {
        res.status(400).send("You should enter all vital infos:(id, name, surname, phone)")
        return
    }
    for (let i =0; i < database.readData().students.length; i++) {
        const elm = database.readData().students[i];
        if (elm.id == body.id) {
            res.status(404).send(`id:${body.id} is not available ,change id`)
            return
        }
    }
     for(let i = 0; i < database.readData().teachers.length; i++){
      const elm = database.readData().teachers[i];
      console.log(`${elm.name}`)
      if(elm.name == body.teacher){
        body.savedTime = Date();
        let data = database.readData()
        data.students.push(body)
        database.writeData(data)
        res.status(201).send("Successfully  Saved")
        return
     }
    }
            
    res.status(404).send(`${body.teacher} is not available`)
    return
})
      
router.get('/', (req, res) => {
    let data = database.readData()
    let name = req.query.name
    if (!name) {
        res.json(data.students)
    }
    let list = data.students.filter(e => (e.name + " " + e.surname).toLowerCase().includes(name.toLowerCase()))

    if (!list.length ) {
        res.status(404).send("student is not found!")
        return
    } else {
         res.json(list)
        return
    }
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    let data = database.readData()
    let students = data.students.find(e => e.id == id)
    if (!students) {
        res.status(400).send(` there is no student with id:${id}`);
        return
    }
    res.status(200).json(students)
})

router.put('/', (req, res) => {
    let data = database.readData()
    let body = req.body
    console.log(body)
    let students = data.students.find(e => e.id == body.id)

    if (!students) {
        res.status(400).send(`there is no student with id:${body.id}`);
        return
    }
    for (let i = 0; i < data.students.length; i++) {
        const elm = data.students[i];
        if (elm.id == body.id) {
            body.savedTime = data.students[i].savedTime
            body.updatedTime = new Date()
            data.students[i] = body
            break;
        }
    }
    database.writeData(data)
    res.status(200).send("successfully updated")
})

router.delete('/:id', (req, res) => {
    let data = database.readData()
    let id = req.params.id
    let students = data.students.find(e => e.id == id)
    if (!students) {
        res.status(400).send(`id:${id} is not found `);
        return
    }

    data.students = data.students.filter(e => e.id != id)
    database.writeData(data)
    res.status(201).send("Successfully deleted")
})
module.exports = router;