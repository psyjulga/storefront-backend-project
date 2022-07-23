import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// EXPRESS MIDDLEWARE FUNCTION
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization
		const token = authorizationHeader?.split(' ')[1]
		const tokenSecret = process.env.TOKEN_SECRET
		const decoded = jwt.verify(token as string, tokenSecret as string)
		next()
	} catch (e) {
		res.status(403) // not authorized
		res.json(e)
	}
}

export default verifyAuthToken