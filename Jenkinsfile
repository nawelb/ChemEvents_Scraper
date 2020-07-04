// Powered by Infostretch 

timestamps {

node () {

	stage ('firstTry - Checkout') {
 	 checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/nawelb/ChemEvents_Scraper.git']]]) 
	}
	stage ('firstTry - Build') {
 	
// Unable to convert a build step referring to "EnvInjectBuildWrapper". Please verify and convert manually if required.		// Batch build step
bat """ 
echo start
node --version
npm install 
 """		// Batch build step
bat """ 
node indexSCF.js
node conferenceSeriesData.js
 """ 
	}
}
}

