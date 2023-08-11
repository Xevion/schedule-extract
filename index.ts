import * as cheerio from "cheerio";
import * as fs from "fs";

const $ = cheerio.load(fs.readFileSync('list.html'));
const classes = $('#scheduleListView').children('.listViewWrapper').toArray();

const getClassName = (html) => {
    console.log(html);
    return html.find('list-view-course-title').text();
}

console.log(`${classes.length} classes identified.`);
console.log(`First class: ${getClassName(classes[0])}`);