// Checks if all the bookmarks are working
import fs from 'fs/promises';
import cliProgress from 'cli-progress'

// Function to check if a URL is online
async function isSiteOnline(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log(error)
    return false
  }
}

// Function to read and check URLs from a JSON file
async function checkSitesFromFile(filePath) {
  try {
    // Read the JSON file
    const data = await fs.readFile(filePath, 'utf8')
    const sites = JSON.parse(data)
    const site_count = sites.length

    console.log("Checking sites for uptime or lack thereof")

    const progress_bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    progress_bar.start(site_count, 0)

    // Iterate through each URL and check its status
    for (let site_index = 0; site_index < site_count; site_index += 1) {
      // Update the progress bar
      progress_bar.update(site_index)

      let url = sites[site_index].url
      const online = await isSiteOnline(url);

      // If the site's offline
      if (!online) {
        console.error(`${url} is offline`)
      }
    }
    // If you've reached here, there are no errors
    progress_bar.update(site_count)
    progress_bar.stop()
    
    
  // If you're here there's been an error
  } catch (error) {
    console.error('Error reading or processing the file:', error);
  }
}
export default checkSitesFromFile
