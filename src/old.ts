import {Cheerio, Element, load} from "cheerio";
import {readFileSync} from "fs";
import {parse} from "date-fns";
import {inspect} from "util";
import {decode} from "html-entities";
import fetch from "node-fetch";
import {z} from "zod";

const $ = load(readFileSync('list.html'));
const classes = $('#scheduleListView').children('.listViewWrapper');

const name_pattern = /(.+) (\d{4}) Section (\d+)/;

const subject_schema = z.object({
    code: z.string(),
    description: z.string().transform((v) => decode(v, {level: 'all'})),
});

type Subject = z.infer<typeof subject_schema>;


const subjects = await z.array(subject_schema).parseAsync(
    await fetch(
        'https://ssbprod.utsa.edu/StudentRegistrationSsb/ssb/classSearch/get_subject' + '?' + new URLSearchParams({
            "searchTerm": "",
            "term": "202410",
            "offset": "1",
            "max": "999"
        })
    ).then((response) => {
        return response.json();
    })
);

const subject_by_name = new Map(subjects.map((subject) => [subject.description, subject]));


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

    const identifier = source.find('span.list-view-subj-course-section').text();
    const name_match = name_pattern.exec(identifier);
    if (name_match === null) {
        throw new Error(`Could not parse identifier: ${identifier}`);
    }

    const [subject_name, code, section] = name_match.slice(1);
    const subject = subject_by_name.get(subject_name);
    if (subject === undefined) {
        throw new Error(`Unknown subject: ${subject_name}`);
    }

    return {
        identifier: {
            subject,
            code: code,
            section: section,
            crn: null,
        },
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
