import { Server } from "./src/classes/Server";
import { Database } from "./src/classes/Database";

const database = new Database();
const server = new Server(database);
server.setup();
