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
  const resultUrl = await page.evaluate(() =>
    [...document.querySelectorAll('div[class="col-md-4 col-sm-6 col-xs-12 confer"] a')].map(link => link.href),
  )
  return resultUrl
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
    let _id = null;
    let title1;
    let title2=null;
    let date=null;
    let dateDebut=null; 
    let dateFin=null;
    let lieu;
    let submitAbstract=null;
    let register=null;
    let usefullLinks=null;
    let siteWeb=null;
    let city=null;
    let country=null;
    let mois = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 

    try {
    
    if($('.conf-info p').length){
      title1 = document.querySelector('.conf-info p').innerText.trim();
        //_id=title1;
    }
    else
    {
      title1=null; 
    }
        title2 = document.querySelector('h1 span').innerText.trim();
        //if(title1==null) {_id=title2};
        date = document.querySelector('time').innerText.trim();

    
    
            
        if (date != null){
    
            //month
            let partOne = date.split(',');
            let monthDay = partOne[0].trim();
            let firstPartOne = monthDay.split(' ');
            let month = firstPartOne[0].trim();
         
            let numeroMois; 
             for(let i=0; i<mois.length; i++){
               if(month==mois[i]){
                 console.log(mois[i]);
     
               numeroMois=i+1
               };
             }
    
     //year
             let partTwo = date.split(',');
             let year = partTwo[1].trim();
    
    
     //days        
             partTwo = date.split(',');
             monthDay = partTwo[0].trim();
             let firstPartTwo = monthDay.split(' ');
             let days = firstPartTwo[1];
             let separarateDays= days.split('-');
             let dayOne = separarateDays[0].trim();
             let dayTwo = separarateDays[1];
             if(dayTwo == undefined){
               dateFin=null;
             }else {
               dayTwo= dayTwo.trim();
               dateFin = year +"-"+numeroMois+"-"+dayTwo;
             }			
    
     
             dateDebut = year +"-"+numeroMois+"-"+dayOne;


            }
    
    
    
    
    
    
    
    
    
        if ($('span.blinking').length) {
      lieu = document.querySelector('span.blinking').innerText.trim();
      //lieu =  document.querySelector('.conf-info h4').innerText.trim();
      // traitement pays + ville
     if(lieu!=null){
        
      const wordsLieu = lieu.split(',');
       country = wordsLieu[2].trim();
       
       const traitementOne = wordsLieu[1].trim();

       const villePays = traitementOne.split(' ');
       
       city = villePays[1];
       for (let i=2; i<villePays.length; i++){
           city = city +" "+ villePays[i];
       }

   }

    } else {
      lieu =  document.querySelector('.conf-info h4').innerText.trim();
       // traitement pays + ville
      if(lieu!=null){
           
        const wordsLieu = lieu.split(',');
       country = wordsLieu[2].trim();
       
       const traitementOne = wordsLieu[1].trim();

       const villePays = traitementOne.split(' ');
       
       city = villePays[1];
       for (let i=2; i<villePays.length; i++){
           city = city +" "+ villePays[i];
       }

    }
    }    
        submitAbstract = document.querySelector('a.btn[title="Submit your Abstract"]').getAttribute('href')
        if(submitAbstract!=null){
            let str = submitAbstract;
            let words = str.split('/');
            siteWeb=words[0]+"//"+words[1]+words[2];
            _id=siteWeb;
        }
        

        register = document.querySelector('a.btn-flat-yellow').getAttribute('href')
        usefullLinks = document.querySelector('.useful-links a').getAttribute('href')
        

        

      } catch (error) {
        _id;
        title1; 
        title2; 
        date;
        lieu;
        city; 
        country;
        submitAbstract; 
        register; 
        usefullLinks;
        siteWeb;
      }
      if(_id==null){
        if(title1!=null){
            _id = title1;
        }else{
            _id = title2;
        }
    }


      
      return { _id, title1, title2, date, dateDebut, dateFin, lieu, city, country, submitAbstract, register, usefullLinks, siteWeb }
      
  

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
  fs.writeFileSync('./Scrapping/json/confSeries6.json', data); 
  return results
}

// 5 - Appel la fonction `scrap()`, affichage les résulats et catch les erreurs
scrap()
  .then(value => {
    console.log(value)
  })
  .catch(e => console.log(`error: ${e}`))

