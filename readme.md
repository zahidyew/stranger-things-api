## Stranger Things API 

API for Stranger Things. 
<br>
Characters data is first scraped, cleaned and then saved into a .json file. The .json file then becomes the data source for the API. 
<br>
```
    //console.log(details)     // uncomment this when testing
    writeDataToFile(details)   // make sure character.json file is empty, with only []. Comment when still testing
```
comment & uncomment these 2 lines (in getCharDetails.js file) depending on your needs. The writeDataToFile func will save the scraped data to the .json file. So, while still testing the scraping process, it is better to comment the writeDataToFile func. 
<br><br>
Currently there are two endpoints, 
<br>
1. GET ` /characters `
    Get all main characters in Stranger Things (22 characters based on the wiki)

2. GET ` /characters/:name `
    Get the character(s) that match :name 
<br>
 
Probably will update with more endpoints in the near future and add some relevant queries such as limits/status/age and etc..
