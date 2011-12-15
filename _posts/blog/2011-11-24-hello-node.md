---
layout:         post
title:          Hello Node.js
---
#{{ page.title }}
2011-11-24 By PIZn @杭州

在这里记下第一个 node.js

    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200, {
            'Content-Type' : 'text/plain' });
        res.end('Hello Node.js\n');
    }).listen(8822, '127.0.0.1');

    console.log('Server running at http://127.0.0.1:8822/');

接着，在终端输入:

    node hello_node.js
    server running at http://127.0.0.1:8822/

最后到浏览器输入上面的路径，就可以看到了。恭喜恭喜。

