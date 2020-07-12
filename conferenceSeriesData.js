// 1 - Import de puppeteer
const puppeteer = require('puppeteer')
const fs = require('fs')
var myGenericMongoClient = require('./my_generic_mongo_client');
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
    let img1 = null; 
    let img2=null; 
    let description =null; 
    let email = null; 
    let tags = null; 



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
                    if(numeroMois<10){
                        numeroMois= "0"+numeroMois;   
                    }
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
             dayOne=dayOne.replace("00", "0");

             let dayTwo = separarateDays[1];

             if(dayTwo == undefined){
               dateFin=null;
             }
             else {
               dayTwo= dayTwo.trim();
               dayOne=dayOne.replace("00", "0");

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
            if(_id != null) {
              _id=words[0]+words[1]+words[2];
            } 
           
           /*  _id=_id.replace(/ /gi, '');
            _id = _id.replace(/\//g, ""); */
        }
        

        register = document.querySelector('a.btn-flat-yellow').getAttribute('href')
        usefullLinks = document.querySelector('.useful-links a').getAttribute('href')
        

        

      } catch (error) {
        _id = null;
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
            if(_id != null) {
              _id=_id.replace(/ /gi, '');
              // _id = _id.replace(/\//g, "");
            } 
        }else{
            _id = title2;
            if(_id != null) {
              _id=_id.replace(/ /gi, '');
              // _id = _id.replace(/\//g, "");
            } 
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
    //headless: false,
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
  
  update_in_mongoDB(results);
  return results;
}

// 5 - Appel la fonction `scrap()`, affichage les résulats et catch les erreurs
scrap()
  .then(value => {
    console.log(value)
  })
  .catch(e => console.log(`error: ${e}`))



  function update_in_mongoDB(responseJs, res) {
    for (let i = 0; i < responseJs.length; i++) {
      //console.log("***** 1 Event found with this request ******")
      var element = responseJs[i];
      var event = new Object();
      event._id=element._id;
      event.title1 = element.title1;
      event.title2 = element.title2;
      event.date = element.date;
      event.dateDebut = element.dateDebut
      event.dateFin=element.dateFin; 
      event.lieu = element.lieu
      event.city = element.city;
      event.country = element.country
      event.submitAbstract = element.submitAbstract;
      event.register = element.register; 
      event.usefullLinks = element.usefullLinks; 
      event.siteWeb = element.siteWeb;
      event.img1 = element.img1; 
      event.img2= element.img2;
      event.description = element.description; 
      event.email = element.email; 
      event.tags = element.tags;
      console.log("***** "+ event.title1+" "+event.title2+ " ******")
  
      if(event.title1 != null && event.title2 != null && event.dateDebut != null){

        myGenericMongoClient.genericInsertOne('eventtest',
        event,
        function (err, res) {            
          console.log(err + res);
        }
        );  
        /* myGenericMongoClient.genericUpdateOneScrap('eventtest', event._id, 
        {
          title1 : event.title1 , 
          title2 : event.title2 , 
          date : event.date, 
          dateDebut : event.dateDebut,
          dateFin : event.dateFin,
          lieu : event.lieu,
          city : event.city, 
          country : event.country,
          submitAbstract : event.submitAbstract, 
          register :  event.register,
          usefullLinks : event.usefullLinks, 
          siteWeb :  event.siteWeb} ,
          function(err,event){
            if(err){
              console.log("error : no event to update with id=" + event._id );
            }else {
              send(event);
              console.log("MAJ "+ event._id)
            }
               }
          ); */ 
        
      }

/*
         myGenericMongoClient.genericUpdateOne('eventtest',
        event._id ,
        {
        title1 : event.title1 , 
        title2 : event.title2 , 
        date : event.date, 
        dateDebut : event.dateDebut,
        dateFin : event.dateFin,
        lieu : event.lieu,
        city : event.city, 
        country : event.country,
        submitAbstract : event.submitAbstract, 
        register :  event.register,
        usefullLinks : event.usefullLinks, 
        siteWeb :  event.siteWeb} ,
        function(err,res){
          if(err){
            console.log("error : no event to update with id=" + event._id );
          }else {

            console.log("MAJ "+ event._id)
          }
             }
        ); 
              
    */    
    }
}


 