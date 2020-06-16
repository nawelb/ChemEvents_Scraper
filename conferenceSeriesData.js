// 1 - Import de puppeteer
const puppeteer = require('puppeteer')
const fs = require('fs')
/*
// 2 - Récupération des URLs de toutes les évènements
*/
const getAllUrl = async browser => {
  const page = await browser.newPage()
  await page.goto(
    'https://www.conferenceseries.com/chemistry-meetings')
  await page.waitFor('body')
  const result = await page.evaluate(() =>
    [...document.querySelectorAll('div[class="col-md-4 col-sm-6 col-xs-12 confer"] a')].map(link => link.href),
  )
  return result
}

// 3 - Récupération des informations de chaque évènement
const getDataFromUrl = async (browser, url) => {
  const page = await browser.newPage()
  try {
    await page.goto(url, {waitUntil: 'load', timeout: 0})
  } catch (error) {
    
  }
  await page.waitFor('body')
  return page.evaluate(() => {
    
    let title1;
    let title2=null;
    let date=null;
    let lieu;
    let submitAbstract=null;
    let register=null;
    let usefullLinks=null;
    
    try {
    if($('.conf-info p').length){
      title1 = document.querySelector('.conf-info p').innerText.trim();
    }
    else
    {
      title1=null; 
    }
        title2 = document.querySelector('h1 span').innerText.trim();
        date = document.querySelector('time').innerText.trim();

    if ($('span.blinking').length) {
      lieu = document.querySelector('span.blinking').innerText.trim();
    } else {
      lieu =  document.querySelector('.conf-info h4').innerText.trim();
    }    
        submitAbstract = document.querySelector('a.btn[title="Submit your Abstract"]').getAttribute('href')
        register = document.querySelector('a.btn-flat-yellow').getAttribute('href')
        usefullLinks = document.querySelector('.useful-links a').getAttribute('href')
        
      } catch (error) {
        title1; 
        title2; 
        date;
        lieu;
        submitAbstract; 
        register; 
        usefullLinks;
      }
      
      return { title1, title2, date, lieu, submitAbstract, register, usefullLinks }
      
  

  })
}

/*
// 4 - Fonction principale : instanciation d'un navigateur et renvoi des résultats
- urlList.map(url => getDataFromUrl(browser, url)):
appelle la fonction getDataFromUrl sur chaque URL de `urlList` et renvoi un tableau

- await Promise.all(promesse1, promesse2, promesse3):
bloque de programme tant que toutes les promesses ne sont pas résolues
*/
const scrap = async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: [ '--ignore-certificate-errors' ],
    args: ['--unhandled-rejections=strict']

  })
  const urlList = await getAllUrl(browser)
  const results = await Promise.all(
    urlList.map(url => getDataFromUrl(browser, url)),
  )
  browser.close()
  let data = JSON.stringify(results, null, 2);
  fs.writeFileSync('./Scrapping/json/confSeries5.json', data); 
  return results
}

// 5 - Appel la fonction `scrap()`, affichage les résulats et catch les erreurs
scrap()
  .then(value => {
    console.log(value)
  })
  .catch(e => console.log(`error: ${e}`))