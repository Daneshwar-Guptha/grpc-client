// import grpc from "@grpc/grpc-js";
// import protoLoader from "@grpc/proto-loader";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const packageDefinition = protoLoader.loadSync(
//   path.join(__dirname, "test.proto")
// );

// const proto = grpc.loadPackageDefinition(packageDefinition);

// const client = new proto.TextService(
//   "10.105.54.157:4000",
//   grpc.credentials.createInsecure()
// );

// let normaltext = "";
// for (let i = 2; i < process.argv.length; i++) {
//   normaltext += process.argv[i] + " ";
// }

// client.CreateCmdLineText(
//   { cmdLineText: normaltext },
//   (err, response) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log("Response from server:", response.cmdLineText);
//   }
// );

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load proto from client folder
const packageDef = protoLoader.loadSync(path.join(__dirname, "chat.proto"));
const proto = grpc.loadPackageDefinition(packageDef);

// Connect to server (replace with server's IP if remote)
const client = new proto.chat.ChatService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

const stream = client.Chat();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Receive messages from server
stream.on("data", (msg) => {
  console.log(`receive: ${msg.text}`);
  rl.prompt();
});

// Send messages to server
rl.on("line", (line) => {
  stream.write({ sender: "Client", text: line });
});

console.log(" Chat started. Type your message:");
rl.prompt();

// Clean exit
process.on("SIGINT", () => {
  stream.end();
  rl.close();
  process.exit();
});
