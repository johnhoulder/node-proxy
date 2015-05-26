var http = require('http'),
	fs	 = require('fs');

var config = {
	port: 8057,
	ip: '0.0.0.0',
	requireAuthentication: true,
	files: {
		failedAuth: './html/failedauth.html'
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
		'blacklist': [],
		'whitelist': ['*']
	}
};

http.createServer(function(req,res){
	console.log(req.headers);
	if(config.requireAuthentication){
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
}).listen(config.port,config.ip);