const PORT = 3535;
const express = require("express");
const server = express();
server.use(express.json());

const teachersRouter = require('./routers/teachers');
const studentsRouter = require('./routers/students');
const groupsRouter = require('./routers/groups');

server.use('/teachers', teachersRouter);
server.use('/students', studentsRouter);
server.use('/groups', groupsRouter);


server.listen(PORT, () =>{
    console.log(`Server has started on port: ${PORT} `)
})
