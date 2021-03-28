const express = require("express")
const ejs = require("ejs")
const { v4 } = require("uuid")

const fs = require("fs")
const path = require("path")
const util = require("util")
const { json } = require("express")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const app = express()

app.use(express.json())

app.engine("html", ejs.renderFile)
app.set("view engine", "html")
app.set("views", "src/views")

app.use("/assets", express.static("static"))
app.use("/images", express.static("images"))

app.get("/", (_, res) => {

  res.render("index")
})

app.get("/api/users", async (req, res) => {

  const pathFile = path.join(__dirname, "data", "users.json")

  const usersContent = await readFile(pathFile, "utf8")

  res.send(JSON.parse(usersContent))
})

app.post("/signup", async (req, res) => {

  const pathFile = path.join(__dirname, "data", "users.json")

  const usersContent = await readFile(pathFile, "utf8")

  const users = JSON.parse(usersContent)
  users.push({
    id: v4(),
    email: req.body.email
  })

  await writeFile(pathFile, JSON.stringify(users, null, 2))
  res.status(201).send({ massage: "Muvofoqiyatli" })
})

const PORT = process.env.PORT || 4030
app.listen(PORT, () => console.log(`localhost:${PORT}`))