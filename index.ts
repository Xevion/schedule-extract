import {Cheerio, Element, load} from "cheerio";
import * as fs from "fs";

const $ = load(fs.readFileSync('list.html'));
const classes = $('#scheduleListView').children('.listViewWrapper');


function extractDetails(source: Cheerio<Element>) {
    source.find('div.list-view-crn-info-div > span.bold').toArray().forEach((descriptor) => {
        const descriptor_element = $(descriptor);

        // console.log([descriptor_element.text(), descriptor_element.next().text()])
    })

    // console.log(
    //     source.find('div.listViewMeetingInformation').children('span').last().text()
    // )

    // For some reason this div divides the information into two parts.
    const div_information_divier = source.find('div.list-view-pillbox.ui-pillbox');
    const timing_information = div_information_divier.next();

    const raw_time = timing_information.text();
    const match = raw_time.match(/(\d{2})\s*:\s*(\d{2})\s*(AM|PM)\D*(\d{2})\s*:\s*(\d{2})\s*(AM|PM)/)
    if (match === null) {
        throw new Error(`Could not parse time: ${raw_time}`);
    }

    const [start_hour, start_minute, end_hour, end_minute] = [1, 2, 4, 5].map((index) => parseInt(match[index]));
    const [start_period, end_period] = [match[3], match[6]];

    return {
        start: {minute: start_minute, hour: start_hour, period: start_period},
        end: {minute: end_minute, hour: end_hour, period: end_period},
        days: source.find('div.ui-pillbox-summary.screen-reader').text().split(",").map((day) => day.trim()),
        name: source.find('span.list-view-course-title > a.section-details-link').text().trim()
    };
}

console.log(`${classes.length} classes identified.`);

classes.toArray().forEach((element) => {
    console.log(extractDetails(
        $(element)
    ))
});

// console.log(classes.toArray().map((element) => element.attribs.class))

// console.log(`First class: ${extractDetails(classes)}`);