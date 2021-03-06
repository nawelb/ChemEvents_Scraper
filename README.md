# ChemEventz - Scraper
&nbsp;
_______________________________
## About ChemEventz!

ChemEventz is a web application that tracks chemical events around the world. 
ChemEventz has been designed to be a collaborative platform to facilitate meetings between researchers, professors, students or anyone interested in these events.

How to make these meetings easier?
  - ChemEventz lists recent events of the most popular events sites
  - Allows users of the platform to add the next known events
  - ChemEventz may allow you to find your future collaborator, job or internship during these meetings


ChemEventz is divided into 5 parts available in my Github account  [public repositories][Git]
  - [ChemEventz - Scraper][GitScrap]  
  - [ChemEventz - NodeJS - API][GitNodeJS] 
  - [ChemEventz - Spring Boot Microservice Authentication][GitSpringAuth]
  - [ChemEventz - Spring Boot Microservice Events][GitSpringEvents]
  - [ChemEventz - Angular][GitAngular]

  
### Tech Dev

ChemEventz uses a number of open source projects to work properly:

* [Angular] - HTML enhanced for web apps!
* [node.js] - v12 for the backend
* [Express] - fast node.js network app framework 
* [Spring Boot] - focus on application-level business logic
* [MongoDB] - non-relationnal database for events storage
* [Mysql] - relational dataBase for users data storage

### Tech Prod

Technologies used to deploy ChemEvents project:

* [Heroku] - Deploy Spring and NodeJS microservices
* [AWS S3] - Deploy Angular microservice
* [AWS RDS] - Cloud MYSQL database Hosting
* [Mongo Atlas] - Cloud MongoDB database Hosting

&nbsp;
______________________________________
&nbsp;
# ChemEventz - Scraper!

### Tech Dev
* [Puppeteer] - Node library for Chrome control
* [MongoDB] - collecte all scraped events


### Installation


ChemEventz requires [Node.js](https://nodejs.org/) v12 to run.

```sh
$ git clone https://github.com/nawelb/ChemEvents_Scraper.git
$ cd ChemEvents_Scraper
$ npm install
```



Create dataBase in mongoDB Atlas.
	

then, create .env file in root directory and add :
 - DB_NAME : as name of your MongoDB database 
 - DB_URL : as url of MongoDB Atlas 

CHANGE TWO FILES : 
	conferenceSeriesData.js ligne 275  : change 'eventtest' -> by the name of your database Collection 
	scfData.js ligne 304  : change 'eventtest' -> by the name of your database Collection 
	

### Execute scraping

run: 
```sh
$ run server.bat
```

or, run:
```sh
$ node indexSCF.js
$ node conferenceSeriesData.js
```

### Targets

In this project, were scraped two websites:

* https://www.societechimiquedefrance.fr/spip.php?page=manifestation
* https://www.conferenceseries.com/chemistry-meetings



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Git]: <https://github.com/nawelb>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Angular]: <https://angular.io>
   [Heroku]: <https://heroku.com>
   [Spring Boot]: <https://spring.io/projects/spring-boot>
  [GitAngular]: <https://github.com/nawelb/ChemEvents_Front_Angular_Security>
  [GitSpringEvents]: <https://github.com/nawelb/ChemEvents_Back_Spring_Events>
  [GitSpringAuth]: <https://github.com/nawelb/ChemEvents_Back_Spring_Security>
  [GitNodeJS]: <https://github.com/nawelb/ChemEvents_Back_NodeJS>
  [GitScrap]: <https://github.com/nawelb/ChemEvents_Scraper>
  [AWS S3]: <https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html>
  [AWS RDS]: <https://aws.amazon.com/fr/rds/>
  [Mongo Atlas]: <https://www.mongodb.com/cloud/atlas>
  [MongoDB]: <https://www.mongodb.com/fr>
  [MySQL]:<https://www.mysql.com/fr/downloads/>
  [puppeteer]: <https://github.com/puppeteer/puppeteer>