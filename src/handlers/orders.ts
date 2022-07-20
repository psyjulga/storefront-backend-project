import { Application, Request, Response } from 'express'
import { OrdersProducts, OrderStore } from '../models/order'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
	const orders = await store.index()
	res.json(orders)
}

const show = async (req: Request, res: Response) => {
	const order = await store.show(req.params.id)
	res.json(order)
}

const showOrderByUser = async (req: Request, res: Response) => {
	const orderByUser = await store.showOrderByUser(req.params.id)
	res.json(orderByUser)
}

const create = async (req: Request, res: Response) => {
	const order = {
		status: req.body.status,
		user_id: req.body.user_id,
	}
	try {
		const newOrder = await store.create(order)
		res.json(newOrder)
	} catch (e) {
		res.status(400)
		res.json(e)
	}
}

const addProductToOrder = async (req: Request, res: Response) => {
	const quantity: number = parseInt(req.body.quantity)
	const order_id: number = parseInt(req.params.id)
	const product_id: number = parseInt(req.body.product_id)

	const productToAdd: OrdersProducts = {
		quantity,
		order_id,
		product_id,
	}

	try {
		const addedProduct = await store.addProductToOrder(productToAdd)
		res.json(addedProduct)
	} catch (e) {
		res.status(400)
		res.json(e)
	}
}

const order_routes = (app: Application) => {
	app.get('/orders', index)
	app.get('orders/:id', show)
	app.get('orders/:id/users', showOrderByUser)
	app.post('/orders', create)
	app.post('/order/:id/products', addProductToOrder)
}

export default order_routes
