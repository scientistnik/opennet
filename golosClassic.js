import golos from "golos-classic-js";
import { GOLOS_CLASSIC_POSTING_KEY } from "./env.js";
import { translateTitle, html2markdown } from "./utils.js";

//golos.config.set("websocket", "wss://api.golos.blckchnd.com/ws");
golos.config.set("websocket", "wss://api.aleksw.space/ws");

export const createPost = async ({ title, body }) => {
  /**
   * comment() add a post
   * @param {Base58} wif - private posting key
   * @param {String} parentAuthor - for add a post, empty field
   * @param {String} parentPermlink - main tag
   * @param {String} author - author of the post
   * @param {String} permlink - url-address of the post
   * @param {String} title - header of the post
   * @param {String} body - text of the post
   * @param {String} jsonMetadata - meta-data of the post (images etc.)
   */
  var wif = GOLOS_CLASSIC_POSTING_KEY;
  var parentAuthor = "";
  var parentPermlink = "ru--tekhnologii";
  var author = "opennetru";
  var permlink = translateTitle(title);

  let imgUrl = body.match(/<img [^>]*src="([^\s]*)" /);
  const headerImage =
    (imgUrl && imgUrl[1]) ||
    "https://images.golos.io/DQmZBFzVTV1NVX5kpLSY7iNjmni4jXkEg2tpo3LkfoYhGFA/image.png";

  body = html2markdown(body);

  var jsonMetadata = JSON.stringify({
    format: "markdown",
    tags: ["opennet", "ru--novosti", "it", "opensource"],
    image: [headerImage],
  });

  console.log("url", headerImage);

  return new Promise((resolve, reject) => {
    golos.broadcast.comment(
      wif,
      parentAuthor,
      parentPermlink,
      author,
      permlink,
      title,
      body,
      jsonMetadata,
      (err, result) => {
        if (err != undefined) reject(err);
        else
          resolve({
            block: result.ref_block_num,
            prefix: result.ref_block_prefix,
            date: result.expiration,
          });
      }
    );
  });
};

export default {
  createPost,
};
