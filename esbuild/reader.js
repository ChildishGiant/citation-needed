import fs from 'fs'
import parse from 'bookmarks-parser'

const bookmark_file = 'bookmarks_03_01_2023.html'

export default function () {

  fs.readFile('exports/'+bookmark_file, 'utf8', function(err, html) {
    if (err) throw err

    parse(html, (err, result) => {

      if (result == undefined) { return }

      console.log('result: ')

      console.log(result)
      result.bookmarks[0].children.forEach(element => {

        if (element.type == 'folder') {
          element.children.forEach(child => {
            if (child.title == 'cn' && child.type=='folder') {
              console.log('found cn folder')

              // Remove wiki from titles
              child.children.map((item) => {  item.title = item.title.replace(' - Wikipedia', '').replace(', the free encyclopedia',''); return item})

              console.log(child.children)
              fs.writeFile('src/data.json', JSON.stringify(child.children), function (err, result) {if (err) {throw err}})
            }
          })
        }
      });

    })
  })
}
