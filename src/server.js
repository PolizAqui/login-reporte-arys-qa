const express = require('express')
const app = express()
const cors = require('cors')
const _var = require('./global/_var')

/******** DEPENDENCY **********/

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cors())

/******** API ROUTES **********/

const routes = require('./routes/auth.routes')

/******** SERVER ********/

app.listen(_var.PORT, (err) => {
    if (err) throw err
    console.log(`Servidor inicializado en: http://localhost:${_var.PORT}`);
})

app.use(routes)
