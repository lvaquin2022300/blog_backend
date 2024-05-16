import { config } from "dotenv";
config();
import Server from "./configs/server.js";

const server = new Server();

server.listen();