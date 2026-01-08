import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "test.proto")
);

const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.TextService(
  "0.0.0.0:4000",
  grpc.credentials.createInsecure()
);

let normaltext = "";
for (let i = 2; i < process.argv.length; i++) {
  normaltext += process.argv[i] + " ";
}

client.CreateCmdLineText(
  { cmdLineText: normaltext },
  (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Response from server:", response.cmdLineText);
  }
);


