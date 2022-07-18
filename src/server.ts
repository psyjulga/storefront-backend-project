import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'

const app: Application = express()
const address: string = '0.0.0.0:3000'
const port = process.env.SERVER_PORT

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
	res.send('Hello World!')
})

app.listen(port, function () {
	console.log(`starting app on: ${address}`)
})
