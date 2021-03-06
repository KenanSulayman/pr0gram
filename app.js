#!/usr/local/bin/node

/*
     ___ ____ __ __
    / _ `/ _ \\ \ /
    \_,_/ .__/_\_\ 
       /_/ 
    
    過去は未来によって変えられる。
*/

var doCluster = false;

var _hr_mutate = function ( init ) {
        init = process.hrtime(init);

        ms = init[1] / 1E6;
        mys = (init[1] / 1E3) - ( ~~ms * 1E3 );
        ns = mys % 1 * 1E3

        return init[0] + "s " + ~~ms + "ms" + " " + ~~mys + "µs" + " " + ~~ns + "ns";
}

cluster = require("cluster");
numCPUs = doCluster ? require('os').cpus().length : 1;

Error.stackTraceLimit = Infinity;

var worker = function () {
        // Don't var. They are exposed to the controllers.

        childProcess = require("child_process"),
        crypto = require("crypto"),
        fs = require("fs"),
        http = require("http"),
        https = require("https"),
        mime = require("mime"),
        net = require("net"),
        path = require("path"),
        qs = require("querystring"),
        Stream = require("stream"),
        url = require("url"),
        util = require("util"),
        repl = require("repl"),
        zlib = require("zlib");

        request = require("request");

        eimg = require("easyimage");

        hyper = require("level");

        db = hyper("pr0gram.db", { encoding: "json" }),
           svb = require("level-sublevel");

        co = require("co3"), colevel = require("co-level");

        lver = require("level-version");

        sdb = svb(db);

        users     = sdb.sublevel("users");
        ref       = sdb.sublevel("ref");
        vref      = lver(ref);
        posts     = lver(sdb.sublevel("posts"));
        settings  = sdb.sublevel("config");
        twofactor = sdb.sublevel("twofactor");

        gAES = require("./lib/gaes.js");

        session = require("level-session")("session.db");

        [ db, users, ref, posts, settings, twofactor ].forEach(function (db) {
                db.exists = function (k, c){
                        var exists;

                        return db.createKeyStream({
                                start: k,
                                end: k
                        }).on("data", function () {
                                exists = true
                        }).on("end", function () {
                                c(exists)
                        })
                };

                db.co = colevel(db);
        });

        [ vref, posts ].forEach(function (db) {
                db.co_getver = function (key, ver) {
                        return function (cb) {
                            posts.get(key, {
                                    version: ver
                            }, cb);
                        }
                }

                db.co_putver = function (key, val, ver) {
                        return function (cb) {
                            posts.put(key, val, {
                                    version: ver
                            }, cb);
                        }
                }
        });

        request = require("request");

        "use strict";

        // Refer to https://gist.github.com/KenanSulayman/5281658.
        var _$ = require;

        require = function(k) {
                try {
                        return _$(k);
                } catch (e) {
                        (_ = e.stack.split("\n"), __ = "");
                        for (var a in _) null != _[a].match(/\(([^)]+)\)/g) && (__ += Array(+a + 1).join(" ") + "=> " + _[a].match(/\(([^)]+)\)/g) + "\n");
                        console.log(_[0], "[" + k + "]\n", __), process.exit();
                }
        }

        var _rev;

        // Revision
                // Temporary
                        _rev = fs.readFileSync("./.git/logs/HEAD").toString().split("\n").length;

                // Real
                        childProcess.exec("git rev-list HEAD --count", function ( a, b, c ) {
                                if ( a || !b || !b["split"] ) return false;

                                _rev = +b.split("\n")[0];
                        });

        // Constants
                const pr0gram = {
                        get version () {
                                return _rev;
                        }
                }

        // Configuration
                config = require("./lib/config").config;

        controller = {}, _controller = {};
        logic = {}, _logic = {};

        _init = function (r, cb) {
                // Load logical modules
                        require("fs").readdirSync("./logic").forEach(function(file) {
                                (file.split(".")[1] === "js") &&
                                        ((logic[file.split(".")[0]] // basename
                                                = require("./logic/" + file)),
                                        (_logic[file.split(".")[0]]
                                                = _$.resolve("./logic/" + file)))
                        });

                // Load router modules
                        require("fs").readdirSync("./controller").forEach(function(file) {
                                (file.split(".")[1] === "js") &&
                                        ((controller[file.split(".")[0]] // basename
                                                = require("./controller/" + file)),
                                        (_controller[file.split(".")[0]]
                                                = _$.resolve("./controller/" + file)))
                        });

                cb && cb();
        };

        new _init;

        var port = process.env.port || parseInt(process.argv[2] || 80);
 
        _str = require("stream").Stream;

        var MemCache = function () {
                _str.call(this);
                this.readable = this.writable = !0;
                this._buffers = [];
                this._dests = []; this._ended = !1
        };

        require("util").inherits(MemCache, _str);

        MemCache.prototype.write = function (a) {
                this._buffers.push(a);
                this._dests.forEach(function (b) { b.write(a) })
        };

        MemCache.prototype.pipe = function (a, b) {
                if (b) return false;
                this._buffers.forEach(function (b) { a.write(b) });
                if (this._ended) return a.end(), a;
                this._dests.push(a);
                return a
        };

        MemCache.prototype.getLength = function () {
                return this._buffers.reduce(function (a, b) { return a + b.length }, 0)
        };

        MemCache.prototype.end = function () {
                this._dests.forEach(function (a) { a.end() });
                this._ended = !0; this._dests = []
        };

        stats = {};

        /*
            PRIMARY
         
                ctype &
                        001 - Array [& ]
                        010 - Object-Stat Hashmap
        */
         
        var readDictionary = function (start, ctype, callback) {
                var readDir, stash = {};

                ctype instanceof Function && ( callback = ctype, ctype = 1 );

                return (readDir = function(start, callback) {
                        fs.lstat(start, function(err, stat) {
                                if (err) return callback(err);

                                var found = { dirs: [], files: [] },
                                        total = 0, processed = 0;

                                if (stat.isDirectory()) {
                                        fs.readdir(start, function(err, files) {
                                                total = files.length;

                                                if (!total)
                                                        return callback(null, found, total);

                                                files.forEach(function (a) {
                                                        var abspath = path.join(start, a);

                                                        fs.stat(abspath, function(err, stat) {
                                                                if (stat.isDirectory()) {
                                                                        ctype & 1 && found.dirs.push(abspath);
                                                                        ctype & 2 && (stash[abspath] = stat);
                                                                        readDir(abspath, function(err, data) {
                                                                                if ( ctype & 1 ) {
                                                                                        found.dirs = found.dirs.concat(data.dirs);
                                                                                        found.files = found.files.concat(data.files);
                                                                                }
                                                                                (++processed == total) && callback(null, found, stash);
                                                                        });
                                                                } else {
                                                                        ctype & 1 && found.files.push(abspath);
                                                                        ctype & 2 && (stash[abspath] = stat);
                                                                        (++processed == total) && callback(null, found, stash);
                                                                }
                                                        });
                                                })
                                        });
                                } else {
                                        return false;
                                }
                        });
                })(start, function (a, b, c) {
                        if ( !(ctype ^ 3) )
                                return callback(b, c);

                        if ( ctype & 1 )
                                return callback(b);

                        if ( ctype & 2 )
                                return callback(c);
                })
        };

        readDictionary("./static", 2, function (_fm) {
                var _fs = {},
                _fs_cache = {},
                _fs_cache_deflate = {},
                _fs_cache_gzip = {};

                /*fs._createReadStream = fs.createReadStream;

                fs.createReadStream = function (a, b) {
                        void 0 == b && (b = {})

                        // whereas a is fd_ref && b is typeof object
                        // __ if a, b do not statisfy (String a, Object b) forward to base implementation
                        if ( !(typeof a == "string" ) || !(typeof b == "object"))
                                return fs._createReadStream.apply(this, arguments);

                        if ( _fs_cache[a] ) return _fs_cache[a];

                        _fs_cache[a] = new MemCache();
                        fs._createReadStream(a, b).pipe(_fs_cache[a]);
                        return _fs_cache[a];
                }*/


                var err = path.join(__dirname, "lib/error/404.html");

                var cancel = function ( response ) {
                        return response.writeHead(404, {
                                "Content-Type": "text/html"
                        }), fs.createReadStream(err).pipe(response);
                }

                var ucache = {};
                var sanitize = function (uri, cb) {
                        if ( ucache[uri] )
                                return cb.apply(this, ucache[uri])

                        var resvd = path.join(process.cwd(), "/static", uri);

                        fs.stat(resvd, function (err, stat) {
                                if (err) return cb(uri, resvd);

                                var isDirectory = stat.isDirectory(),
                                forceDelegation = uri.substr(-1) !== "/";

                                isDirectory && ( !forceDelegation ? (uri += "index.html") : (uri += "/") );

                                ucache[uri] = [
                                        uri,
                                        path.join(process.cwd(), "/static", uri),
                                        isDirectory && forceDelegation
                                ];

                                return cb.apply(this, ucache[uri]);
                        })
                }

                http.createServer(function (request, response) {
                        // hotswap
                                if ( request.url === "/_reinit" )
                                        return _init( true, function () {
                                                return response.end("Reinitialized.")
                                        });

                        var uri = url.parse(request.url).pathname;
                        request.timing = Date.now();

                        sanitize(uri, function (uri, fn_, forceDelegation) {
                                session(request, response, function () {
                                        request.session.co_get = function (key) {
                                                return function (cb) {
                                                        request.session.get(key, cb)
                                                }
                                        }

                                        request.session.co_put = function (key, val) {
                                                return function (cb) {
                                                        request.session.get(key, val, cb)
                                                }
                                        }

                                        response._writeHead = response.writeHead;
                                        response.writeHead = function (a, b) {
                                                b = b || {};

                                                b["pr0gram"] = "r" + pr0gram.version;

                                                return response._writeHead.apply(this, [a, b]);
                                        }

                                        if ( request.url.slice(0, 10) === "/api/pkey/" ) {
                                                var id = request.url.slice(10);

                                                return twofactor.get(id, function (err, pkey) {
                                                        if ( err ) return response.end("There's nothing here. If you lost your key, generate a new one.");

                                                        response.writeHead(200, {
                                                                'Content-Disposition': 'attachment; filename="pr0gram.pub"'
                                                        }), response.end(Buffer(pkey, "base64"));

                                                        return twofactor.del(id)
                                                })
                                        }

                                        request.session.get("gwAuthed", function (err, val) {
                                                /*if ((err || !val) && !~request.url.indexOf("/images/")) {
                                                        if ( request.url !== "/login" )
                                                                return response.writeHead(302, {
                                                                        "Location": "/login"
                                                                }), response.end();

                                                        if ( request.method === "POST" ) {
                                                                var req = Buffer(0);

                                                                request.on("data", function (chunk) {
                                                                        if ((req.length+chunk.length) > 1024)
                                                                                return response.end();

                                                                        req = Buffer.concat([req, chunk]);
                                                                });

                                                                var _cancel = function () {
                                                                        return response.writeHead(302, {
                                                                                "Location": "/"
                                                                        }), response.end();
                                                                }

                                                                return request.on("end", function () {
                                                                        if ( req[0] === 0xff && req[1] === 0xc0 && req[2] === 0xde ) {
                                                                                var i = 3;

                                                                                var nick, secret;

                                                                                while(i++ && req[i])
                                                                                        if ( req[i] === 0xff && req[i + 1] === 0xc0 && req[i + 2] === 0xde ) {
                                                                                                nick = req.slice(3, i);
                                                                                                secret = req.slice(i + 3);

                                                                                                break;
                                                                                        }

                                                                                var _reject = function () {
                                                                                        return response.end("There was a problem with that key. Generate a new one by sending 'publickey' to pr0gram.")
                                                                                }

                                                                                nick = nick.toString();

                                                                                return users.get(nick, function (err, _d) {
                                                                                        if (err) return _reject();

                                                                                        if (crypto.createHash("whirlpool").update(_d.key).update(secret).digest("base64") === _d.pkey) {
                                                                                                _d.root = ~config.roots.indexOf(nick) ? true : false;
                                                                                                _d.admin = ~config.admins.indexOf(nick) ? true : ( _d.root || false );

                                                                                                return request.session.set("gwAuthed", nick, function (err) {
                                                                                                        response.writeHead(302, {
                                                                                                                "Set-Cookie": "me=" + encodeURIComponent(JSON.stringify({
                                                                                                                        name: nick,
                                                                                                                        id: _d.nick,
                                                                                                                        admin: !!_d.admin
                                                                                                                })) + "; expires=Wed, 21-Feb-2024 21:37:16 GMT; path=/"
                                                                                                        }), response.end("OK");
                                                                                                });
                                                                                        } else {
                                                                                                return _reject();
                                                                                        }
                                                                                })
                                                                        }

                                                                        try {
                                                                                var data = qs.parse(req.toString());
                                                                        } catch(e) { return _cancel(); }

                                                                        if ( !data["nick"] || !data["password"] )
                                                                                return _cancel();

                                                                        var nick = String(data["nick"]).toLowerCase();

                                                                        return users.get(nick, function (err, _d) {
                                                                                if (err) return _cancel();

                                                                                if ( crypto.createHash("whirlpool").update(data.password).digest("hex") !== _d.key )
                                                                                        return _cancel();

                                                                                _d.root = ~config.roots.indexOf(nick) ? true : false;
                                                                                _d.admin = ~config.admins.indexOf(nick) ? true : ( _d.root || false );

                                                                                return request.session.set("gwAuthed", nick, function (err) {
                                                                                        return response.writeHead(302, {
                                                                                                "Set-Cookie": "me=" + encodeURIComponent(JSON.stringify({
                                                                                                        name: nick,
                                                                                                        id: _d.nick,
                                                                                                        admin: !!_d.admin
                                                                                                })) + "; expires=Wed, 21-Feb-2024 21:37:16 GMT; path=/",
                                                                                                "Location": "/"
                                                                                        }), response.end();
                                                                                });
                                                                        })
                                                                });
                                                        }

                                                        return fs.createReadStream(process.cwd() + "/static/login.html").pipe(response);
                                                }*/

                                                if ( forceDelegation )
                                                        return response.writeHead(307, {
                                                                "Location": uri
                                                        }), response.end();

                                                // SECURITY
                                                        if ( /\.\.\/\.\./.test(uri) || /\.\/\.\./.test(uri) ) 
                                                                return cancel(response);
                                                        
                                                        if ( fn_.length < (process.cwd()).length )
                                                                return cancel(response);
                                                        
                                                        if ( ~uri.indexOf("/../") )
                                                                return cancel(response);

                                                // ROUTER
                                                        for ( var router in controller )
                                                                for ( route in controller[router].paths ) {
                                                                        if ( (uri.substr(0, controller[router].paths[route].length) === controller[router].paths[route] && (uri.substr(controller[router].paths[route].length, 1) == "/"))
                                                                                        || ( uri === controller[router].paths[route] ) )
                                                                                return console.log(controller, router), controller[router].handler.apply(this, [
                                                                                        request,
                                                                                        response,
                                                                                        controller[router].paths[route],
                                                                                        uri
                                                                                ]);
                                                                }

                                                if ( _fs[fn_] === void 0 ) {
                                                        _fs[fn_] = fs.existsSync(fn_)
                                                }
                                                
                                                if ( !_fs[fn_] )
                                                        return cancel(response);

                                                var s = fs.createReadStream(fn_),
                                                        etag = _fm["static"+uri] && _fm["static"+uri].mtime || "0"
                                                        ntag = +etag;

                                                if ( request.headers["if-none-match"] == ntag )
                                                        return response.end(response.writeHead(304, {
                                                                "Date": etag.toString(),
                                                                "Etag": ntag,
                                                                "Cache-Control": "max-age=86400, public",
                                                                "Content-type": "image/jpeg",
                                                                "Keep-Alive": "timeout=6, max=32",
                                                                "Connection": "keep-alive"
                                                        }));

                                                var aE = request.headers['accept-encoding'] || "",
                                                        _resHead = {
                                                        "Content-Type": mime.lookup(fn_) + "; charset=utf8",
                                                        "Cache-control": "max-age=604800",
                                                        "Expire": new Date().toString(),
                                                        "Etag": ntag
                                                };

                                                if (~aE.indexOf("deflate")) {
                                                        _resHead['Content-Encoding'] = 'deflate';
                                                        response.writeHead(200, _resHead);

                                                        //if ( _fs_cache_deflate[fn_] ) return _fs_cache_deflate[fn_].pipe(response);

                                                        //_fs_cache_deflate[fn_] = new MemCache();
                                                        //s.pipe(zlib.createDeflate()).pipe(_fs_cache_deflate[fn_]);
                                                        //return _fs_cache_deflate[fn_].pipe(response);
                                                        return s.pipe(zlib.createDeflate()).pipe(response);
                                                }

                                                if (~aE.indexOf("gzip")) {
                                                        _resHead['Content-Encoding'] = 'gzip';
                                                        response.writeHead(200, _resHead);

                                                        //if ( _fs_cache_gzip[fn_] ) return _fs_cache_gzip[fn_].pipe(response);

                                                        //_fs_cache_gzip[fn_] = new MemCache();
                                                        //s.pipe(zlib.createGzip()).pipe(_fs_cache_gzip[fn_]);
                                                        //return _fs_cache_gzip[fn_].pipe(response);
                                                        return s.pipe(zlib.createGzip()).pipe(response);
                                                }
                                                
                                                response.writeHead(200, _resHead);

                                                return s.pipe(response);
                                        });
                                });
                        });
                }).listen(port, process.env.IP);

                console.log("[" + process.pid + "] Ready.");
        });
}

if (cluster.isMaster) {       
        var init = process.hrtime(), vlist = {};

        console.log("Spawning..");

        for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
        }

        cluster.on('online', function(worker) {
                console.log("\t[" + worker.process.pid + "] Worker online. [" + _hr_mutate(init) + "]");

                vlist[worker.process.pid] = true;
        });

        cluster.on('disconnect', function(worker) {
                if ( !vlist[worker.process.pid] ) return false;

                console.log("\t[" + worker.process.pid + "] Worker disconnected.");
                console.log("\tRespawning..");
                cluster.fork();

                delete vlist[worker.process.pid];
        });

        cluster.on('exit', function(worker, code, signal) {
                if ( !vlist[worker.process.pid] ) return false;

                var exitCode = worker.process.exitCode;
                console.log("\t[" + worker.process.pid + "] Worker died. (" + exitCode + ")");
                console.log("\tRespawning..");
                cluster.fork();

                delete vlist[worker.process.pid];
        });
} else {
        worker();
}