import { client } from './generated/client.gen'

client.setConfig({ baseUrl: 'http://localhost:3001' })

export { client }
