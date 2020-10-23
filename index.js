const express = require("express")
const dbConnection = require("./db/config")
require("dotenv").config()
const authRouter = require("./routes/authRouter")
const eventsController = require("./routes/eventsRouter")
const cors = require("cors")
const app = express()

//Base de datos
dbConnection()




app.use(cors())


// Directorio Publico
app.use(express.static("public"))

//Lectura y parseo del body
app.use(express.urlencoded({extended: false}));
app.use(express.json())

//Rutas
app.use("/api/auth",authRouter)

app.use("/api/events",eventsController)




app.listen(process.env.PORT ,()=>console.log("Corriengo en puerto 5000"))