import steem from "steem";
import { STEEM_ACTIVE_CREATOR_KEY, STEEM_POSTING_KEY } from "./env.js";
import { translateTitle } from "./utils.js";

steem.api.setOptions({ url: "https://api.steemit.com" });

steem.api.getConfig(function (err, result) {
  //console.log(err, result);
});

export const createAccount = (name, pass) => {
  //BUTT.addEventListener("click", function (event) {
  var NAME = name; //document.getElementById("name").value;
  var PASS = pass; //document.getElementById("pass").value;

  // Данные создателя аккаунта
  // Активный ключ создателя (вашего существующего аккаунта)
  var wif = STEEM_ACTIVE_CREATOR_KEY; //document.getElementById("wif").value;

  // Комиссия блокчейну за создание аккаунта
  var fee = "3.000 STEEM";

  // Логин создателя (вашего существующего аккаунта)
  var creator = "scientistnik"; //document.getElementById("creator").value;

  // Профиль пользователя. О себе, аватар, и т.д. , можно оставить пустым и заполнить позднее
  var jsonMetadata = {};

  var x = steem.auth.generateKeys(NAME, PASS, [
    "owner",
    "active",
    "posting",
    "memo",
  ]);
  var ownerAuth = {
    weight_threshold: 1,
    account_auths: [[creator, 1]],
    key_auths: [[x.owner, 1]],
  };
  var activeAuth = {
    weight_threshold: 1,
    account_auths: [[creator, 1]],
    key_auths: [[x.active, 1]],
  };
  var postingAuth = {
    weight_threshold: 1,
    account_auths: [[creator, 1]],
    key_auths: [[x.posting, 1]],
  };
  var memoKey = x.memo;

  steem.broadcast.accountCreate(
    wif,
    fee,
    creator,
    NAME,
    ownerAuth,
    activeAuth,
    postingAuth,
    memoKey,
    jsonMetadata,
    function (err, result) {
      if (err) {
        console.log(err);
        var jsone = JSON.stringify(err, null, 4);
        return; //alert("ПРОИЗОШЛА ОШИБКА: ", jsone);
      } else {
        var json = JSON.stringify(result, null, 4);

        var p = steem.auth.getPrivateKeys(NAME, PASS, [
          "owner",
          "active",
          "posting",
          "memo",
        ]);

        console.log(
          `login=${NAME}\npass=${PASS}\nposting=${p.posting}\nactive=${p.active}\njson=${json}`
        );
      }
    }
  );
};

export const createPost = ({ title, body }) => {
  var wif = STEEM_POSTING_KEY;
  var parentAuthor = "";
  var parentPermlink = "ru";
  var author = "opennet";
  var permlink = translateTitle(title);
  body = `<html>${body}</html>`;

  let imgUrl = body.match(/<img [^>]*src="([^\s]*)" /);
  const headerImage =
    (imgUrl && imgUrl[1]) ||
    "https://cdn.steemitimages.com/DQmYJLKd4o4nvfNW3XfPWRZx5fKA9bzBiDWZoiHJ3aSGPyo/image.png";

  var jsonMetadata = JSON.stringify({
    format: "html",
    tags: ["#ru", "opennet", "it", "news", "opensource"],
    image: [headerImage],
  });

  console.log("url", headerImage, permlink);

  return new Promise((resolve, reject) => {
    steem.broadcast.comment(
      wif,
      parentAuthor,
      parentPermlink,
      author,
      permlink,
      title,
      body,
      jsonMetadata,
      function (err, result) {
        console.log(err, result);
        if (err != undefined) reject(err);
        else
          resolve({
            block: result.block_num,
            trx: result.trx_num,
            data: result.expiration,
          });
      }
    );
  });
};

export default {
  createPost,
  createAccount,
};

//5216559139 RC
//2327423524 RC, needs 5214661307 RC
