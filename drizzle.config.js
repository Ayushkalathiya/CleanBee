export default {
    dialect: 'postgresql',
    schema: './utils/db/schema.ts',
    out:'./drizzle',

    // The database connection string
    dbCredentials: {
        url: process.env.DATABASE_URL,
        connectionString: process.env.DATABASE_URL,
    }
}

