import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const databaseURL = process.env.DATABASE_URL_UNPOOLED;

const sequelize = databaseURL
  ? new Sequelize(databaseURL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || "product_db",
      process.env.DB_USER || "dev_user",
      process.env.DB_PASSWORD || "dev_password",
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: false,
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL!");
    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
    });
    console.log("Table Synchronized!");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };