import fs from 'fs'
import parse from 'bookmarks-parser'

const bookmark_file = 'bookmarks_24_10_2023.html'

export default function () {

  fs.readFile('exports/'+bookmark_file, 'utf8', function(err, html) {
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
}
