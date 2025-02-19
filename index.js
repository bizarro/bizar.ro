const express = require('express')

const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile)

app.get('/', async (request, response) => {
  res.render('/public/index.html')
})

app.listen(3000)
