# schedule-extract

![Built with Typescript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)

A WebExtension for extracting class schedule data into ICS files.

## Purpose

- This project will parse the page and attempt to extract detailed and meaningful schedule information
  from the Class Schedule registration page.
- This project will be made for UTSA students, and maintained primarily for it, but should be available
  generally for other systems that use the same registration system. Unfortunately, either a maintainer from different
  systems will be required to assist, or logins need to be shared (which is, understandably, not easy).
- Shipped as an extension, it will target Firefox first, and Chrome as well with polyfills. The project will be
  written in TypeScript, and will be built with Webpack.

## Vision

- Click the extension, or a button placed somewhere on the page to activate a window for extracting data.
- The window will provide a button for easy downloading (or a 'Save as' dialog).
- Options will be provided to filter and modify the format of the data slightly.

## Support

https://ssbprod.utsa.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_term=202410&startDatepicker=&endDatepicker=&uniqueSessionId=l5fyg1691785942875&pageOffset=0&pageMaxSize=20520395&sortColumn=subjectDescription&sortDirection=asc

This application targets UTSA's 'Banner Student Registration Self Service', v9.26.1.

Until other class schedule systems are identified, this will be the only supported system & version.

Current version can be found [here](https://ssbprod.utsa.edu/StudentRegistrationSsb/ssb/about/).