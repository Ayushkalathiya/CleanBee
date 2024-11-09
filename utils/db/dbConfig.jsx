// postgresql://CleanBee_owner:bXyqD9IE8wMS@ep-yellow-bread-a1wk43ut.ap-southeast-1.aws.neon.tech/CleanBee?sslmode=require

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

// Create a new database object
const sql = neon(process.env.DATABASE_URL)

// Export the database object
export const db = drizzle(sql, {schema})