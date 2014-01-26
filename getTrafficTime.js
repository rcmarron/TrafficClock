var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys'),
    gpio = require('pi-gpio');

// fetch some HTML...
var options90 = {
  hostname: 'www.wsdot.com',
  port: 80,
  path: '/traffic/seattle/traveltimes/commutes/SeattleRedmond90.aspx'
};

var options520 = {
  hostname: 'www.wsdot.com',
  port: 80,
  path: '/traffic/seattle/traveltimes/commutes/SeattleRedmond520.aspx'
};

var selectors = {
	selector: '#TravelTimes',
  structureFromSelector: 'elem[0].children[3].children[2].children[5].children[0].children[0].data'
}

function displayTrafficData(sourceOptions, selectorOptions){
	getTrafficData(sourceOptions, selectorOptions, function (err, time) {
		if(err) {
			sys.debug("Error: " + err);
		}
		else{
			outputTrafficData(time);
		}
	});
}

function getTrafficData(sourceOptions, selectorOptions, callback){
	getHTMLBody(sourceOptions, function (err, body){
		if(err){
			sys.debug("Error: " + err);
		}
		else{
			parseBodyForTime(body, selectorOptions, callback);
		}
	})
}

function getHTMLBody(sourceOptions, callback){
	var html = http.get(sourceOptions, function(res) {
		sys.puts("Got response: " + res.statusCode);
		var body = "";
		res.on("data", function(chunk) {
			body += chunk;
		});
		res.on("end", function(err){
			callback(err, body);
		});
	});
}

function parseBodyForTime(htmlText, options, callback){
	var handler = new htmlparser.DefaultHandler(function(err, htmlText) {
  if (err) {
          sys.debug("Error: " + err);
      } else {

          var elem = select(htmlText, options.selector);
        	callback(err, elem[0].children[3].children[2].children[5].children[0].children[0].data);            
      }
  });

  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(htmlText);
	
}

function outputTrafficData(time){
	sys.puts(time);
}

displayTrafficData(options90, selectors);
displayTrafficData(options520, selectors);

// function get(urlOptions){
// 	var html = http.get(urlOptions, function(res) {
// 		sys.puts("Got response: " + res.statusCode);
// 		var body = "";
// 		res.on("data", function(chunk) {
// 			body += chunk;
// 		});
// 		res.on("end", function(){
// 			return body;
// 		});
// 	});
// }

// sys.puts(getHTMLBody(options) + "1");
// sys.puts("test");
// var minutes = 1, the_interval = minutes * 60 * 1000;
// setInterval(function() {
	

// 		res.on("end", function(){
// 			var handler = new htmlparser.DefaultHandler(function(err, dom) {
// 	      if (err) {
// 	              sys.debug("Error: " + err);
// 	          } else {

// 	              var elem = select(dom, '#TravelTimes');
// 	            	console.log(elem[0].children[3].children[2].children[5].children[0].children[0].data);            
// 	          }
// 	      });

// 	      var parser = new htmlparser.Parser(handler);
// 	      parser.parseComplete(body);
	    
// 		});

// 	}).on('error', function(e) {
// 	  console.log("Got error: " + e.message);
// 	});

// }, the_interval);


