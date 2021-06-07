inlets = 1;
outlets = 3;

var dataCollection = [];     // store incoming data

function getDeviation(dat){
	dataCollection.push(dat);
	var N = dataCollection.length;
	
	if(N > 0){
		// Compute average
		var avr = 0.0; // average
		for(i=0; i < N; i++){
			avr += dataCollection[i] / N;
		}
		
		// Compute variance
		var variance = 0.0;
		for(i=0; i < N; i++){
			variance += Math.pow(dataCollection[i] - avr ,2) / N;
		}
		
		// Compute standard deviation
		var deviation = Math.sqrt(variance);
		
		outlet(0, avr);          // output average
		outlet(1, variance);     // output variance
		outlet(2, deviation);    // output standard deviation
	}	
}

function resetDeviation(){
	dataCollection = [];  // store incoming data
	// outlet(0, 0.0);       // output average
	// outlet(1, 0.0);       // output variance
	// outlet(2, 0.0);       // output standard deviation
}