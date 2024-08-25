import 'dotenv/config';
import {MysqlAdapter as Database } from '@builderbot/database-mysql';

export const database = new Database({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  database: process.env.MYSQL_DB_NAME,
  password: process.env.MYSQL_DB_PASSWORD,
  port: process.env.MYSQL_DB_PORT,
});