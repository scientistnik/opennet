import Sequelize from "sequelize";
import { POSTGRES_URI } from "../env.js";
import definePost from "./post.js";

const store = {};
const sequelize = new Sequelize(POSTGRES_URI);

export const connect = async () => {
  store.Post = definePost(sequelize, Sequelize);
  if (store.Post.associate != undefined) {
    store.Post.associate(store);
  }

  sequelize.sync();

  store.sequelize = sequelize;
  store.Sequelize = Sequelize;

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const disconnect = sequelize.close;

export default store;
