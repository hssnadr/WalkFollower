inlets = 3;
outlets = 3;

var mini = 0;
var maxi = 10;

function constrain(dat, min_, max_){
	// Update range under condition	
	if(min_ < max_){
		mini = min_;
		maxi = max_;
	}
	
	
	if(dat < mini){
		outlet(0, mini);
		outlet(1, "bang");
	}
	else{
		if(dat > maxi){
			outlet(0, maxi);
			outlet(2, "bang");
		}
		else{
			outlet(0, dat);
		}
	}
}