import { MemoryDB as Database } from '@builderbot/bot'
//import { MysqlDB } from '@builderbot/database-mysql'


const database = new Database()


/* const database = new MysqlDB({

}) */

export { database }