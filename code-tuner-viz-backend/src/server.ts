import { createApp } from "./app/createApp";
import { config } from "./app/config";

const app = createApp();

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
