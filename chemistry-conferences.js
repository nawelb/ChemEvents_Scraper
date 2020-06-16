//load in puppeteer 
const puppeteer = require('puppeteer')
const fs = require('fs')

const SUBSCF_URL = () => 'https://www.chemistry-conferences.com/'

const self ={
 
    browser: null,
    page: null, 
    
    
    initialize: async () => {
        self.browser = await puppeteer.launch({
            headless: false
        });

        self.page = await self.browser.newPage();
      
        //Go to the subscf
        await self.page.goto(SUBSCF_URL(), {waitUntil: 'networkidle0'});  
        
        await self.page.screenshot({path:'./Scrapping/screenshots/chemConf.png'});        
        //await self.page.pdf({path: './pdfs/chemConf.pdf'});
    }, 

    getReslults: async(nr) =>{
        let results = [];
        do{
            let new_results = await self.parseResult();
            results=[ ...results, ...new_results ];

        }while(results.length < nr);

        return results.slice(0, nr)
      
    },


    parseResult: async () => {

        let elements = await self.page.$$('tr');
        let results = [];

    }
    
        
    
    


 
}



module.exports = self;