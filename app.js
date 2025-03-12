const path = require('path')
const express = require('express')
const app = express()
const port = 3000
const hostName = '127.0.0.1'

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web/index.html'))
})

app.get('/about', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web/about.html'))
})

app.get('/blog', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web/blog.html'))
})

app.get('/blog-single', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web/blog-single.html'))
})

app.get('/contact', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'web/contact.html'))
})


app.listen(port, hostName, () => {
  console.log(`Server Çalışıyor, http://${hostName}:${port}/`)
})