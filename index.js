// arrenca el server

const app = require("./app");

const PORT = 3000; // port basic

app.listen(PORT, () => {
  console.log("server escoltant al port " + PORT);
});
