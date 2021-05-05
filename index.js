const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
} = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Database connected.");
    })
    .catch((e) => {
        console.log(e);
    });

app.enable("trust proxy");

app.use(cors({}));

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            resave: false,
            secure: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 3600 * 1000,
        },
    })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hello World from Docker Container!</h2>");
    console.log("Testing API");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
