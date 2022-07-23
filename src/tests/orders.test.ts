import { Order, OrderStore, OrdersProducts } from '../models/order'
import { User, UserStore } from '../models/user'
import { Product, ProductStore } from '../models/product'
import request from 'supertest'
import sinon from 'sinon'
import app from '../server'
import { Server } from 'http'
import verifyAuthToken from '../util/authorization'

// stub the auth middleware
// let makeAuthSpy
// stub(obj, 'meth').callsFake(fn)
beforeEach(() => {
	// makeAuthSpy = sinon.stub(verifyAuthToken).callsFake()
	// verifyAuthToken = jest.fn((req,res,next)=>(next()))
})
// oder den token mitsenden

// testing endpoints => HANDLER
const server: Server = app.listen()

describe('Order Handler', () => {
	test('POST orders/ calls create() and returns 200', async () => {
		// when adding a new order we need to give it a user_id,
		// so we first create a user whose id will be autogenerated to 1
		const userRes = await request(server).post('/users/').send({
			first_name: 'Jane',
			last_name: 'Doe',
			password_digest: 'handler-test-password',
		})

		const orderRes = await request(server).post('/orders/').send({
			status: 'active',
			user_id: '1',
		})
		expect(orderRes.status).toBe(200)
	})
	test('GET /orders/ calls index() and returns 200', async () => {
		const res = await request(server).get('/orders/')
		expect(res.status).toBe(200)
	})
	test('GET /orders/:id calls show() and returns 200', async () => {
		const res = await request(server).get('/orders/1')
		expect(res.status).toBe(200)
	})
	test('GET /orders/:id/users calls showOrderByUser() and returns 200', async () => {
		const res = await request(server).get('/orders/1/user')
		expect(res.status).toBe(200)
	})
	test('POST orders/:id/products calls addProductToOrder() and returns 200', async () => {
		// to add a product to an existing order we need to create a product first
		// because we need to pass its id which will be autogenerated to 1
		const productRes = await request(server)
			.post('/products/')
			.send({ name: 'route-test-product', price: 250 })

		const orderRes = await request(server).post('/orders/1/products').send({
			quantity: 5,
			product_id: 1,
		})
		expect(orderRes.status).toBe(200)
	})
	server.close()
})

// testing model-database-interaction => MODEL
const userStore = new UserStore()
const productStore = new ProductStore()
const orderStore = new OrderStore()

const testOrderToAdd: Order = {
	status: 'active',
	user_id: '1',
}
// order_id is automatically generated
const testOrderWithId: Order = {
	order_id: 1,
	status: 'active',
	user_id: '1',
}

describe('Order Model', () => {
	test('should have an index method', () => {
		expect(orderStore.index).toBeDefined()
	})

	test('should have a show method', () => {
		expect(orderStore.show).toBeDefined()
	})

	test('should have a showOrderByUser method', () => {
		expect(orderStore.showOrderByUser).toBeDefined()
	})

	test('should have a create method', () => {
		expect(orderStore.create).toBeDefined()
	})

	test('should have a addProductToOrder method', () => {
		expect(orderStore.addProductToOrder).toBeDefined()
	})

	test('create method should add a order to the database', async () => {
		// when adding a new order we need to give it a user_id,
		// so we first create a user whose id will be autogenerated to 1
		const testUserToAdd: User = {
			first_name: 'John',
			last_name: 'Doe',
			password_digest: 'my_secret_password',
		}

		const user = await userStore.create(testUserToAdd)

		const res = await orderStore.create(testOrderToAdd)
		expect(res).toEqual(testOrderWithId)
	})

	test('index method should return a list of all orders', async () => {
		const res = await orderStore.index()
		expect(res).toEqual([testOrderWithId])
	})

	test('show method should return the correct order', async () => {
		const res = await orderStore.show('1')
		expect(res).toEqual(testOrderWithId)
	})

	test('showOrderByUser method should return the correct order', async () => {
		const res = await orderStore.showOrderByUser('1')
		expect(res).toEqual(testOrderWithId)
	})

	test('addProductToOrder method should return the order from the join table', async () => {
		// to add a product to an existing order we need to create a product first
		// because we need to pass its id which will be autogenerated to 1
		const testProductToAdd: Product = {
			name: 'order-model-test-product',
			price: 500,
		}

		const product = await productStore.create(testProductToAdd)

		const ordersProductsToAdd = {
			quantity: 5,
			order_id: 1,
			product_id: 1,
		}
		// id will be autogenerated
		const ordersProductsWithId: OrdersProducts = {
			id: '1',
			quantity: 5,
			order_id: 1,
			product_id: 1,
		}

		const res = await orderStore.addProductToOrder(ordersProductsToAdd)
		expect(res).toEqual(ordersProductsWithId)
	})
})
