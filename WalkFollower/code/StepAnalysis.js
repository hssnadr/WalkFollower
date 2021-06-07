inlets = 2;
outlets = 5;

var N = 4;                 // number of validated steps required to validate a N steps serie
var minTimeStep = 200;     // minimum duration for 1 step (in millisecond)
var maxTimeStep = 3000;    // maximum duration for 1 step (in millisecond)
stepTimes = [];            // step time array collection (get the time of each steps)

var miniAngle = 6666;
var maxiAngle = -6666;
var meanRangeAngle = [];   // store range of each steps between

var halfStepTimes = [];    // store time of each half steps
var dateHalfStep = -66;           // time of current half step

var stepDuration = [];
var halfStepDuration = [];

//////////////////////////////////////////
///////     STEPS VALIDATION       ///////
//////////////////////////////////////////

function getStepValidation(bang, n){
	//pushHalStep(); // at new step, push the last half step detected (half step of the previous step)
	
	// Get time of the current detected step
	var d = new Date();
	var t = d.getTime();
	stepTimes.push(t); // put the time into the step time array collection
	resetRange(); // update range angle collection
	
	//--------------------------------------------------------
	
	if(stepTimes.length > 2){
		var dateLastStep1 = stepTimes[stepTimes.length - 1];
		var dateLastStep2 = stepTimes[stepTimes.length - 2];
		stepDuration.push( dateLastStep1 - dateLastStep2 );
		
		if(dateHalfStep > dateLastStep2 && dateHalfStep < dateLastStep1){
			halfStepDuration.push(dateHalfStep - dateLastStep2);
		}
	}
	
	//--------------------------------------------------------	
	
	// Check to update the step window
	if(n > 0){
		// N can't be equal to 0 or negative
		N = n;
	}
	
	// Mangage time array collection according to N
	if(stepTimes.length - N > 0){
		// remove oldest data if N unchanged (i=0 removed)
		// remove from 0 to stepTimes.length - N + 1 if new N < old N
		for(i=0; i < stepTimes.length - N + 1 ; i++){
			stepTimes.splice(i, 1);
		}
	}
	
	
	if(stepTimes.length >= N){
		var isGoodSteps = 1; // initialize at true
		for(i=1; i<N; i++){
			if(stepTimes[i] - stepTimes[i-1] < minTimeStep || stepTimes[i] - stepTimes[i-1] > maxTimeStep){
				isGoodSteps *= 0; // set to false if step not valide
				break; // leave for loop
			}
		}
		
		
		if(isGoodSteps){
			outlet(0, N); // return N validated steps
			
			getRange(); // return average range on validated steps
			getDateHalfSteps();
			
			stepTimes = [];
			
			
		}
	}
}

//////////////////////////////////////////
///////        STEP RANGE          ///////
//////////////////////////////////////////

function updateStepRange(curAngle){
	// Update minimum angle
	if(curAngle < miniAngle){
		miniAngle = curAngle;
	}
	
	// Update maximum angle
	if(curAngle > maxiAngle){
		maxiAngle = curAngle;
	}
}

function resetRange(){
	// Reset initial range at each detected steps
	if(miniAngle != 6666 && maxiAngle != -6666){
		meanRangeAngle.push(maxiAngle-miniAngle); // add last the angular range of the last step
		
		if(meanRangeAngle.length - N > 0){
			// remove oldest data if N unchanged (i=0 removed)
			// remove from 0 to stepTimes.length - N + 1 if new N < old N
			for(i=0; i < meanRangeAngle.length - N + 1 ; i++){
				meanRangeAngle.splice(i, 1);
			}
		}
		// Reset range
		miniAngle = 6666;
		maxiAngle = -6666;
	}
}

function getRange(){
	// Compute the average step range on ONLY last N validated steps
	mr_ = 0.0;
	for(i=0 ; i < meanRangeAngle.length; i++){
		mr_ += meanRangeAngle[i];
	}
	mr_ /= N;
	
	outlet(1, mr_, meanRangeAngle);
	
	resetRangeCollection();
}

function resetRangeCollection(){
	meanRangeAngle = []; // Empty the array to store step agular range
	// Reset range
	miniAngle = 6666;
	maxiAngle = -6666;
}

//////////////////////////////////////////
///////      STEP REGULARITY       ///////
//////////////////////////////////////////

function getHalfStep(bang){
	// Get the time for the half step
	var d = new Date();
	dateHalfStep = d.getTime();
}

function getDateHalfSteps(){
	// Compute steps and half steps duration
	var meanStepDuration = 0.0;
	var meanHalfStepDuration = 0.0;
	var meanRatioHalfStepDuration = 0.0;
	
	for(i=0 ; i < stepDuration.length; i++){
		meanStepDuration += stepDuration[i];
	}
	meanStepDuration /= stepDuration.length;
	outlet(2, meanStepDuration);             // output average step duration
	
	
	// Half steps computations	
	if(halfStepDuration.length > 0){
		for(i=0 ; i < halfStepDuration.length; i++){
			meanHalfStepDuration += halfStepDuration[i];
		}
		meanHalfStepDuration /= halfStepDuration.length;	
		meanRatioHalfStepDuration = meanHalfStepDuration / meanStepDuration;			
	
		// Output values	
		outlet(3, meanHalfStepDuration);         // output average half step duration	
		outlet(4, 1 - meanRatioHalfStepDuration);    // output average step regularity
	}
	
	// Reset tables
	stepDuration = [];
	halfStepDuration = [];
}