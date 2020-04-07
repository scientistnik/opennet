import TurndownService from "turndown";

const turndown = new TurndownService();

export const translateTitle = (rusTitle) => {
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
  result = result.replace(/[,!#]/g, "");

  return result;
};

export const html2markdown = (html) => {
  return turndown.turndown(html);
};
