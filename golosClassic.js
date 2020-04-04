import golos from "golos-classic-js";
import { GOLOS_CLASSIC_POSTING_KEY } from "./env.js";

//golos.config.set("websocket", "wss://api.golos.blckchnd.com/ws");
golos.config.set("websocket", "wss://api.aleksw.space/ws");

const translateTitle = (rusTitle) => {
  var result = rusTitle.toLowerCase();
  var rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ   ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(
      / +/g
    ),
    eng = "shh  sh  ch cz yu ya yo zh zch y  e  a b v g d e z i j k l m n o p r s t u f x b".split(
      / +/g
    );

  rus.forEach((l, index) => {
    result = result.replace(new RegExp(l, "g"), eng[index]);
  });

  result = result.replace(/[ \.]/g, "-");
  result = result.replace(/[,!]/g, "");

  return result;
};

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
  var parentPermlink = "opensource";
  var author = "opennetru";
  var permlink = translateTitle(title);
  body = `<html>${body}</html>`;

  let imgUrl = body.match(/<img [^>]*src="([^\s]*)" /);
  const headerImage =
    (imgUrl && imgUrl[1]) ||
    "https://images.golos.io/DQmZBFzVTV1NVX5kpLSY7iNjmni4jXkEg2tpo3LkfoYhGFA/image.png";

  var jsonMetadata = JSON.stringify({
    format: "html",
    tags: ["opennet", "ru--novosti", "it"],
    image: [headerImage],
  });

  console.log("url", headerImage);

  //throw new Error("Hello");
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
      function (err, result) {
        if (!err) {
          resolve({
            block: result.ref_block_num,
            prefix: result.ref_block_prefix,
            date: result.expiration,
          });
        } else {
          reject(err);
        }
      }
    );
  });
};

export const createComment = () => {
  /**
   * comment() add a comment
   * @param {Base58} wif - private posting key
   * @param {String} parentAuthor - for add a comment, author of the post
   * @param {String} parentPermlink - for add a comment, url-address of the post
   * @param {String} author - author of the comment
   * @param {String} permlink - unique url-address of the comment
   * @param {String} title - for create a comment, empty field
   * @param {String} body - text of the comment
   * @param {String} jsonMetadata - meta-data of the post (images etc.)
   */
  var wif = "5K...";
  var parentAuthor = "epexa";
  var parentPermlink = "test-url";
  var author = "epexa";
  var permlink = "re-" + parentAuthor + "-" + parentPermlink + "-" + Date.now(); // re-epexa-test-url-1517333064308
  var title = "";
  var body = "hi!";
  var jsonMetadata = "{}";
  golos.broadcast.comment(
    wif,
    parentAuthor,
    parentPermlink,
    author,
    permlink,
    title,
    body,
    jsonMetadata,
    function (err, result) {
      //console.log(err, result);
      if (!err) {
        console.log("comment", result);
      } else console.error(err);
    }
  );
};
