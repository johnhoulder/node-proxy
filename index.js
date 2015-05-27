var http = require('http'),
	fs	 = require('fs');

var config = {
	port: 8057,
	ip: '0.0.0.0',
	requireAuthentication: true,
	files: {
		failedAuth: './html/failedauth.html',
		blocked: './html/blocked.html'
	}
};

var users = {
	testuser: {
		password: 'testuser',
		acl: 'default'
	}
};

var acls = {
	default: {
		'blacklist': ['*'],
		'whitelist': ['google.com']
	}
};

function wildcardMatch(pattern,str){
	pattern = pattern.split('*');
	for(p in pattern){
		p = pattern[p];
		if(str.indexOf(p) >= 0){
			return true;
		}
	}
	return false;
}

function sendAuthenticationRequest(res){
	res.writeHead(401,{
		'WWW-Authenticate': 'Basic realm="NodeJS Proxy Server"'
	});
	fs.readFile(config.files.failedAuth,{'encoding':'utf-8'},function(err,data){
		if(err){
			res.end();
		}else{
			res.write(data);
			res.end();
		}
	});
}

http.createServer(function(req,res){
	console.log(req.headers);
	if(config.requireAuthentication){
		if(req.headers.authorization !== undefined && req.headers.authorization.indexOf('Basic ') == 0){
			var userpass = req.headers.authorization.replace('Basic ','');
			userpass = new Buffer(userpass,'base64').toString();
			userpass = [userpass.substring(0,userpass.indexOf(':')),userpass.substring(userpass.indexOf(':')+1)];
			if(users[userpass[0]] !== undefined){
				if(users[userpass[0]].password == userpass[1]){
					var site = req.headers.host;
					var cookie = req.headers.cookie;
					if(wildcardMatch(acls.default.blacklist,site)){
						if(wildcardMatch(acls.default.whitelist,site)){
							
						}
					}
				}else{
					sendAuthenticationRequest(res);
				}
			}else{
				sendAuthenticationRequest(res);
			}
		}else{
			sendAuthenticationRequest(res);
		}
	}
}).listen(config.port,config.ip);