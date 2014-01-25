var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys'),
    gpio = require('pi-gpio');

// fetch some HTML...
var options = {
  hostname: 'www.wsdot.com',
  port: 80,
  path: '/traffic/seattle/traveltimes/commutes/SeattleRedmond90.aspx',
};

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
	var html = http.get(options, function(res) {
		sys.puts("Got response: " + res.statusCode);
		var body = "";
		res.on("data", function(chunk) {
			body += chunk;
		});

		res.on("end", function(){
			var handler = new htmlparser.DefaultHandler(function(err, dom) {
	      if (err) {
	              sys.debug("Error: " + err);
	          } else {

	              var elem = select(dom, '#TravelTimes');
	            	console.log(elem[0].children[3].children[2].children[5].children[0].children[0].data);            
	          }
	      });

	      var parser = new htmlparser.Parser(handler);
	      parser.parseComplete(body);
	    
		});

	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});

}, the_interval);


