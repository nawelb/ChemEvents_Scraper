node () {
	stage ('firstTry - Build') {
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


