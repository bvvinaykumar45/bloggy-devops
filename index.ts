import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { getVersion, getHostName } from "./utils/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const port: number = Number(process.env.PORT) || 3000;
const app: Application = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD;

if(!dbUser && process.env.DB_USER_FILE) {
  dbUser = fs.readFileSync(process.env.DB_USER_FILE, 'utf-8').trim();
}

if(!dbPassword && process.env.DB_PASSWORD_FILE) {
  dbPassword = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf-8').trim();
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: dbUser,
  password: dbPassword,
  database: process.env.DB_NAME,
});

app.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query("SELECT title, description FROM blogs");
    res.render("index", {
      blogs: rows,
      version: getVersion(),
      host: process.env.NODE_HOST || getHostName(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving blog posts");
  }
});

app.get("/health", (req: Request, res: Response): Response => {
  return res.status(200).json({ alive: true });
});

app.listen(port, (err: Error | undefined) => {
  if (err) {
    console.log(`Error while running server ${err}`);
  }
  console.log(`Server running at http://localhost:${port}`);
});
