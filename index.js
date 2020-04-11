import { getNews } from "./opennet.js";
import store, { connect, disconnect } from "./store/index.js";
import md5 from "md5";
import golos from "./golosClassic.js";
import steem from "./steem.js";
//import cyber from "./cyberway/index.js";

const cycle = fun => async () => {
  const Post = store.Post;
  const news = await getNews();

  let { title, description, link } = news[1];
  let body = description[0];

  title = title[0];
  link = link[0];

  const hash = md5(body);

  let post = await Post.findOne({ where: { link } });

  if (post == undefined) {
    post = await Post.create({ link, body: hash });
  }

  try {
    await fun(post, { title, body });
  } catch (error) {
    console.error(error);
  }
};

const golosClassic = async (post, params) => {
  if (post.golos_classic == undefined) {
    let data = await golos.createPost(params);
    if (data != undefined) {
      post.golos_classic = JSON.stringify(data);
      await post.save();
    }
  }
};

const steemit = async (post, params) => {
  if (post.steem == undefined) {
    let data = await steem.createPost(params);
    if (data != undefined) {
      post.steem = JSON.stringify(data);
      await post.save();
    }
  }
};

const cyberway = async (post, params) => {
  if (post.cyber == undefined) {
    let data = await cyber.createPost(params);
    if (data != undefined) {
      post.cyber = JSON.stringify(data);
      await post.save();
    }
  }
};

connect().then(() => {
  setInterval(cycle(golosClassic), 12 * 60 * 60 * 1000);
  setInterval(cycle(steemit), 10 * 60 * 60 * 1000);
  //setInterval(cycle(cyberway), 12 * 60 * 60 * 1000);
});

process.on("uncaughtException", function (err) {
  console.log(err);
});
