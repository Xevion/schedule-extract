import {Cheerio, Element, load} from "cheerio";
import {readFileSync} from "fs";
import {parse} from "date-fns";
import {inspect} from "util";

const $ = load(readFileSync('list.html'));
const classes = $('#scheduleListView').children('.listViewWrapper');

function getOffset(period: string) {
    switch (period) {
        case "AM":
            return 0;
        case "PM":
            return 12;
        default:
            throw new Error(`Unknown period: ${period}`);
    }
}


function extractDetails(source: Cheerio<Element>) {
    const details: [string, string][] = source.find('div.list-view-crn-info-div > span.bold').toArray().map((descriptor) => {
        const descriptor_element = $(descriptor);
        return [descriptor_element.text(), descriptor_element.next().text()]
    })

    const timing_information = source.find('div.list-view-pillbox.ui-pillbox').next();

    const raw_time = timing_information.text();
    const match = raw_time.match(/(\d{2})\s*:\s*(\d{2})\s*(AM|PM)\D*(\d{2})\s*:\s*(\d{2})\s*(AM|PM)/)
    if (match === null) {
        throw new Error(`Could not parse time: ${raw_time}`);
    }

    const [start_hour, start_minute, end_hour, end_minute] = [1, 2, 4, 5].map((index) => parseInt(match[index]));
    const [start_period, end_period] = [match[3], match[6]];

    const raw_date = source.find('span.meetingTimes').text();
    const [start_date, end_date] = raw_date.split("--").map((date) => parse(date.trim(), "MM/dd/yyyy", new Date()));

    return {
        date: {
            start: start_date,
            end: end_date,
        },
        time: {
            start: {minute: start_minute, hour: start_hour + getOffset(start_period)},
            end: {minute: end_minute, hour: end_hour + getOffset(end_period)},
        },
        days: source.find('div.ui-pillbox-summary.screen-reader').text().split(",").map((day) => day.trim()),
        name: source.find('span.list-view-course-title > a.section-details-link').text().trim()
    };
}

console.log(`${classes.length} classes identified.`);
console.log(
    inspect(classes.toArray().map((element) => extractDetails($(element))), {colors: true, depth: null})
);
