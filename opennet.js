import { OPENNET_RSS_URL } from "./env.js";
import fetch from "cross-fetch";
import iconv from "iconv-lite";
import xml2js from "xml2js";

const parseXML = (xml) =>
  new Promise((resolve, reject) => {
    xml2js.parseString(xml, (error, json) => {
      if (error != undefined) reject(error);
      else resolve(json);
    });
  });

export const getNews = async () => {
  const res = await fetch(OPENNET_RSS_URL);
  const arrayBuffer = await res.arrayBuffer();
  const xml = iconv.decode(Buffer.from(arrayBuffer), "koi8-r").toString();

  const json = await parseXML(xml);

  return json.rss.channel[0].item;
};
