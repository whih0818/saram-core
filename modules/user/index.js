module.exports = {
    getName:function(){return "elab.user";},
    init:function(saram, mod, obj) {
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};