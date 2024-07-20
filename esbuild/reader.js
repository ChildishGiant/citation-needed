import fs from 'fs'
import parse from 'bookmarks-parser'

// Regex for bookmark html exports with dates on the end
// bookmarks_DD_MM_YYYY.html
const date_regex = /bookmarks_(\d\d)_(\d\d)_(\d{4})\.html/gm;

export default function () {

  // Find newest export
  // Exports are bookmarks_day_month_year.html

  fs.readdir('exports', function(err, items) {
    if (err) throw err;

    let newest = 0
    let newest_file = ''

    // Loop through all exports
    // Find the newest one
    items.forEach(item => {

      let matches = [...item.matchAll(date_regex)];
      matches.forEach((match) => {

        // Make a date based on the filename
        // Date(year, month, day)
        const date = new Date(match[3], match[2], match[1])

        // If the date is newer than the current newest
        if (date > newest) {
          // Update this to be the newset file
          newest = date
          newest_file = item
        }
      });

    })

    console.log('Newest export: '+newest_file)

    // Read newest export
    fs.readFile('exports/'+newest_file, 'utf8', function(err, html) {
      if (err) throw err

      parse(html, (err, result) => {

        if (result == undefined) { return }

        // Find the right folder
        result.bookmarks[0].children.forEach(element => {
          if (element.type == 'folder') {
            element.children.forEach(child => {
              if (child.title == 'cn' && child.type=='folder') {
                // If it's the right folder
                // Remove wiki from titles
                child.children.map((item) => {  item.title = item.title.replace(' - Wikipedia', '').replace(', the free encyclopedia',''); return item})
                // Remove duplicate titles
                child.children = child.children.filter((item, index, self) => self.findIndex(t => t.title === item.title) === index)
                // Remove icons and useless type key
                child.children.map((item) => {  delete item.icon; delete item.type; return item})

                // Sort titles alphabetically
                child.children.sort((a, b) => a.title.localeCompare(b.title));

                // Export the data to a readable JSON file
                fs.writeFile('src/data.json', JSON.stringify(child.children, null, 4), function (err, result) {if (err) {throw err}})

                // The text that will be written to pages.md
                let markdownContent = `# Pages
These are the wikipedia (and a few other) articles that are randomly chosen from:
`;

                child.children.forEach(item => {
                  // Add a bullet point with the page title as a link using md formatting
                  markdownContent += `* [${item.title}](${item.url})\n`;
                });

                fs.writeFile('pages.md', markdownContent, function (err, result) {if (err) {throw err}})
              }
            })
          }
        });

      })
    })
  })
}
