#!/usr/bin/env node

var request = require('request'),
	http = require('http'),
	webSocket = require('ws'),
	fs = require('fs'),
	ytdl = require('ytdl-core'),
	program = require('commander'); 

program
	.option('-p, --port [type]')
	.option('-f, --filepath [type]')
	.parse(process.argv);

if(program.port) port = program.port;

var query = {};
	query.method = "Runtime.evaluate";
	query.id = 1;
	query.params = {"expression" : "document.getElementsByClassName('ytp-play-button')[0].getAttribute('aria-label');"};

if(program.port){
	var request_url = "http://localhost:" + program.port +"/json";
	get_json(request_url);
}
else {
	var request_url = "http://localhost:9222/json";
	get_json(request_url);
}

function found_song(){
	if(!song_found){
		console.log("SONG NOT FOUND");
	}
}

function get_json(request_url){
	request(request_url, function(err, response, html){
		var tabs = JSON.parse(html);

		console.log("Finding your jam");
		query_socket(0);

		function query_socket(i){
			if(tabs[i].url.includes('youtube')){
				var ws = new webSocket(tabs[i].webSocketDebuggerUrl);
				
				ws.on('open', function open(){
					ws.send(JSON.stringify(query))
				})

				ws.on('message', function incoming(data){
					if(JSON.parse(data).result.result.value == "Pause"){
						console.log("jam found. Downloading");
						ytdl.getInfo(tabs[i].url, function(err, info){
							if(program.filepath){
								console.log(program.filepath);
								var stream = fs.createWriteStream(program.filepath + info.title + ".webm");
							}
							else{
								var stream = fs.createWriteStream(info.title + ".webm");
							}

		  					stream.on('finish', function(){
		  						console.log("Jam downloaded");
		  						process.exit();
		  					})

		  					ytdl(tabs[i].url, {filter: 'audioonly'}).pipe(stream);
						})
					}
					else{
						if(i == tabs.length - 1){
							console.log("There is no song playing on youtube right now");
							process.exit();
						}
						else{
							query_socket(i+1);
						}
					}
				})
			}
			else {
				if(i == tabs.length - 1){
					console.log("There is no song playing on youtube right now");
					process.exit();
				}
				else{
					query_socket(i+1);
				}
			}
		}
	})
}



