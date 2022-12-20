const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    //get url and parse

    let parseUrl = url.parse(req.url, true);
    // //get the path
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    // console.log(trimPath);
    //
    // res.end();
    req.on('data', function (data) {
    });
    req.on('end', function (end) {
        let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
        let data = {
                "trimPath": trimPath
            };

        chosenHandler(data, function (statusCode, payload) {
            console.log(1)
            // kiểm tra status code có phải số hay không? Nếu đúng thì trả về mã tương ứng, nếu không trả về 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // kiểm tra payload có phải object hay không? Nếu đúng thì trả về payload, nếu không trả về đối tượng trống
            payload = typeof (payload) == 'object' ? payload : {};

            // chuyển payLoad ở payload sang đối tượng JSON
            let payLoadString = JSON.stringify(payload);

            // instatusCode lên Head của Response
            res.writeHead(statusCode)

            //kết thúc và in ra payLoad
            res.end(payLoadString);

            //log the request
            console.log("status " + statusCode + "payload" + payload);
        });

    });
})

let handlers = {};
//sample handlers
handlers.sample = function (data, callback) {
// call back
    callback(406, {'name': 'sample handle'})
};
//not found sample
handlers.notFound = function (data, callback) {
    callback(404);
};

//home
handlers.home = function (data, callback) {
// call back
    callback(200, 'home page');
};

//definer the request router

let router = {
    'sample': handlers.sample,
    'home': handlers.home,
}

server.listen(3000, function () {
    console.log('http://localhost:3000')
})