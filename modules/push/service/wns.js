/**
 * @Author T roll
 * @Description Minimal implement of Windows push Notification Servce(WNS)
**/

var buffer = require('buffer');
var request = require('request');

module.exports = function (ctx, name, obj) {
    var serverKey = obj.key;

    this.add = function (ctx, next) {
        next(ctx.req.body.getValue("device"));
    };

    this.send = function (ctx, info, next) {
        var accesstoken = this.getAccessToken(ctx, info.client_id, info.client_secret); // TODO cache this token
        var body = new Buffer(info.xml, 'utf8');
        
        request({
            url:info.url, //TODO check target domain is "*.notify.windows.com"
            method: 'POST',
            headers: {
                'Content-Type': info.contentType,
                'Content-length': Buffer.byteLength(body, 'utf8'),
                'Authorization': 'Bearer ' + accesstoken,
                'X-WNS-Type' : info.notificationType
            },
            body : body
        }, function (error, res, body) {
            if(error) {
                console.log(error); // TODO implement retry
                return;
            }
            if(res.statusCode != 200) {
                console.log(body); // TODO implement retry
                return;
            }
        });
    };
    
    this.getAccessToken = function(ctx, client_id, client_secret) {
        var body = {
            client_id : client_id,
            client_secret : client_secret,
            "grant_type" : "client_credentials",
            "scope" : "notify.windows.com"
        };
        body = JSON.stringify(body);
        request({
            url:'https://login.live.com/accesstoken.srf',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-length': Buffer.byteLength(body, 'utf8'),
            },
            body : body
        }, function (error, res, body) {
            body = JSON.parse(body);
            if(error) {
                console.log(error);
                return;
            }
            if(res.statusCode != 200) {
                console.log(body);
                return;
            }
            return body;
        });

    };
}
