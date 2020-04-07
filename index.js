import { getNews } from "./opennet.js";
import store, { connect, disconnect } from "./store/index.js";
import md5 from "md5";
import golos from "./golosClassic.js";
import steem from "./steem.js";
//import cyber from "./cyberway/index.js";

const cycle = (Post) => async () => {
  const news = await getNews();
  let count = 1;
  for (const item of news) {
    let { title, description, link } = item;
    title = title[0];
    description = description[0];
    link = link[0];
    //console.log(description);

    const hash = md5(description);

    let post = await Post.findOne({ where: { link } });

    if (post == undefined) {
      post = await Post.create({ link, body: hash });
    }

    if (post.golos_classic == undefined) {
      try {
        let data = await golos.createPost({ title, body: description });
        if (data != undefined) {
          post.golos_classic = JSON.stringify(data);
          await post.save();
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (post.steem == undefined) {
      try {
        //let data = await steem.createPost({ title, body: description });
        //if (data != undefined) {
        //  post.steem = JSON.stringify(data);
        //  await post.save();
        //}
      } catch (error) {
        console.error(error);
      }
    }

    if (post.cyber == undefined) {
      try {
        //let data = await cyber.createPost({ title, body: description });
        //if (data != undefined) {
        //  post.cyber = JSON.stringify(data);
        //  await post.save();
        //}
      } catch (error) {
        console.error(error);
      }
    }

    count--;
    if (count == 0) return;
  }
};

const start = async () => {
  const Post = store.Post;

  //setInterval(cycle(Post), 5 * 60 * 1000);
  cycle(Post)();
};

connect().then(start); //.catch(disconnect);
