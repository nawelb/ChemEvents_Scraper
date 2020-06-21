//load in puppeteer 
const puppeteer = require('puppeteer')
const fs = require('fs')


const SUBSCF_URL = (scf) => 'https://www.societechimiquedefrance.fr/spip.php?page=manifestation#/${scf}/'

const self ={
 
    browser: null,
    page: null, 
    initialize: async (scf) => {
        self.browser = await puppeteer.launch({
            headless: false
        });

        self.page = await self.browser.newPage();
      
        //Go to the subscf
        await self.page.goto(SUBSCF_URL(scf), {waitUntil: 'networkidle0'});  
        
        //await self.page.screenshot({path:'./Scrapping/screenshots/page.png'});        
        //await self.page.pdf({path: './pdfs/page.pdf'});
    }, 

    getResults: async(nr) =>{

        let results=[]
            
        do {
               try {

                await self.page.click('body > div.container.bg-blanc > section:nth-child(1) > div > div.col-xs-12.col-md-offset-1.col-md-6 > div.ajaxbloc.ajax-id-manif_pagination.bind-ajaxReload > nav > ul > li.active + li > a')
                
                } catch (error) {
                
                    console.log("click not working")   
                }
            let new_results = await self.parseResult();
            results.push(...new_results)               
           
        } while (results.length < nr);   
        let data = JSON.stringify(results, null, 2);
        fs.writeFileSync('./Scrapping/json/scfEventsBetter.json', data);
            return results.slice(0, nr)       
            
        },

    parseResult: async () => {


        let elements = await self.page.$$('article');
        let results = [];

        for (let element of elements){
        //Element du Header
            let title1 = await element.$eval(('h3'), node => node.innerText.trim());
            let title2 = await element.$eval(('span'), node => node.innerText.trim());
            let date = await element.$eval(('div[class="caractencadre-spip date"]'), node => node.innerText.trim());
            let lieu = await element.$eval(('div[class="lieu"]'), node => node.innerText.trim());
            let pays = null;
            let ville = null;
            let img1 = null;
            let image1= null;
            let img2 = null; 
            let image2= null;

                try{
                    image1 = await element.$eval('h3 > img:nth-child(1)', node => node.getAttribute('src'));
                    img1="https://www.societechimiquedefrance.fr/"+image1;
                    image2 = await element.$eval('h3 > img:nth-child(2)', node => node.getAttribute('src'));
                    img2="https://www.societechimiquedefrance.fr/"+image2;
                }catch{
                    image1;
                    image2;
                    img1;
                    img2;    
                }

        //Element du Main

            //let description = await element.$eval(('p'), node => node.innerText.trim());
            let description = null;
            let tags = null;
            let email = null; 
            let siteWeb = null;
            let _id=null;
            let dateDebut=null;  
            let dateFin=null; 

            try{
                description = await element.$eval('main > div > p', node => node.innerText.trim());
            }catch{
                description;
            }

            try{
                email = await element.$eval('main > div > a[class="spip_mail"]', node => node.innerText.trim());
            }catch{
                email;
            }
            
            try{
                siteWeb = await element.$eval('main > div > a[class="spip_out"]', node => node.getAttribute('href'));
                if(siteWeb!=null){
                    _id=siteWeb;
                }
                
            }catch{
                siteWeb;
            }
            
            try{
                tags = await element.$eval('main > div', node => node.innerText.trim());
            }catch{
                tags;
            }
           if(_id==null){
               if(title1!=null){
                   _id=title1;
               }else{
                _id=title2;
            }
            }
            if (date != null){

                var mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]; 
                 
                let jourDebut=null;
                let jourFin=null;
                let monthdebut=null;
                let monthFin=null;
                let numeroMoisDebut=null;
                let numeroMoisFin;
                
                let dateSwitch=date.split(' ');
                //Cas d'une durée
                let dateSwitch0 = dateSwitch[0];
                let dateSwitch1 = dateSwitch[1];
                let dateSwitch4 = dateSwitch[4];
                let dateSwitch3 = dateSwitch[3];
                
                if(dateSwitch0 =="Du"){
                    if(dateSwitch3 =="au"){
                        jourDebut=dateSwitch[1];
                        if(jourDebut<10){
                                jourDebut= "0"+jourDebut;   
                        }
                        if(jourDebut=="1er"){
                            jourDebut= "01";   
                        }
                        monthdebut = dateSwitch[2];
                        for(let i=0; i<mois.length; i++){
                            if(monthdebut==mois[i]){
                                    numeroMoisDebut=i+1
                                    if(numeroMoisDebut<10){
                                        numeroMoisDebut= "0"+numeroMoisDebut;   
                                    }
                            };
                        }
                        dateDebut = "2020-"+ numeroMoisDebut+"-"+jourDebut;
                                        
                        jourFin=dateSwitch[4];
                        if(jourFin<10){
                            jourFin= "0"+jourFin;   
                        }
                        if(jourFin=="1er"){
                            jourFin= "01";   
                        }
                        monthFin = dateSwitch[5];
                        for(let i=0; i<mois.length; i++){
                            if(monthFin==mois[i]){
                                    numeroMoisFin=i+1
                                    if(numeroMoisFin<10){
                                        numeroMoisFin= "0"+numeroMoisFin;   
                                    }
                            };
                        }
                        dateFin = "2020-"+ numeroMoisFin +"-"+jourFin;
                    }else{
                    jourDebut=dateSwitch1;
                    if(jourDebut<10){
                            jourDebut= "0"+jourDebut;   
                    }
                    if(jourDebut=="1er"){
                        jourDebut= "01";   
                    }    
                    jourFin=dateSwitch3;
                    if(jourFin<10){
                            jourFin= "0"+jourFin;   
                    }
                    if(jourFin=="1er"){
                        jourFin= "01";   
                    }
                    monthdebut = dateSwitch[4];
                        for(let i=0; i<mois.length; i++){
                            if(monthdebut==mois[i]){
                                    numeroMoisDebut=i+1
                                    if(numeroMoisDebut<10){
                                        numeroMoisDebut= "0"+numeroMoisDebut;   
                                    }
                            };
                        }
                    dateDebut = "2020-"+ numeroMoisDebut+"-"+jourDebut; 
                    dateFin = "2020-"+ numeroMoisDebut+"-"+jourFin;
                    console.log("dateDebut = "+dateDebut ) 
                    console.log("dateFin = "+dateFin ) 
                    }
                }
                //Cas d'un evenement isolé
                else{
                    jourDebut = dateSwitch[1];
                    if(jourDebut<10){
                        jourDebut= "0"+jourDebut;   
                    }
                    if(jourDebut=="1er"){
                        jourDebut= "01";   
                    }
                    monthdebut = dateSwitch[2];
                    for(let i=0; i<mois.length; i++){
                    if(monthdebut==mois[i]){
                        numeroMoisDebut=i+1
                        if(numeroMoisDebut<10){
                            numeroMoisDebut= "0"+numeroMoisDebut;   
                        }
                    };
                }
                    dateDebut = "2020-"+ numeroMoisDebut+"-"+jourDebut;
                }
            }
            
            if(lieu!=null){
                let dataSplit= lieu.split("(");
                ville = dataSplit[0].trim();
                console.log("pays "+pays)

                let paysCrud = dataSplit[1];
                
                let paysTreatment = paysCrud.split(")")
                pays=paysTreatment[0].trim();
                console.log("pays "+pays)
            }



            results.push({
                _id,
                img1,
                img2, 
                title1, 
                title2,
                description,
                date,
                dateDebut,
                dateFin, 
                lieu,
                ville,
                pays, 
                email, 
                siteWeb, 
                tags
             })
            
         

        }
        //let data = JSON.stringify(results, null, 2);
        //fs.writeFileSync('./Scrapping/json/scfEvents.json', data);
        return results;
        
        
    
    }
 
}

module.exports = self;