import fs from 'fs'
import parse from 'bookmarks-parser'

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

        result.bookmarks[0].children.forEach(element => {

          if (element.type == 'folder') {
            element.children.forEach(child => {
              if (child.title == 'cn' && child.type=='folder') {
                // Remove wiki from titles
                child.children.map((item) => {  item.title = item.title.replace(' - Wikipedia', '').replace(', the free encyclopedia',''); return item})
                // Remove duplicate titles
                child.children = child.children.filter((item, index, self) => self.findIndex(t => t.title === item.title) === index)
                // Remove icons
                child.children.map((item) => {  delete item.icon; return item})

                fs.writeFile('src/data.json', JSON.stringify(child.children), function (err, result) {if (err) {throw err}})

                let titles = []
                child.children.forEach(item => titles.push(item.title))
                // Sort titles
                titles = titles.sort()
                fs.writeFile('titles.txt', titles.join("\n"), function (err, result) {if (err) {throw err}})

              }
            })
          }
        });

      })
    })
  })
}
