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
		res.write(fs.readFileSync(config.files.failedAuth,'utf-8'));
		res.end();
	}
}).listen(config.port,config.ip);