// const events = require("events");
// const fs = require("fs");
// const watchfile = require("test.log");
// const bf = require("buffer");
// const buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);
// const TRILINE_LINES = 10;

// class watcher extends events.EventEmitter {
//     constructor(watchfile){
//         super();
//         this.watchfile = watchfile;
//         this.store = [];
//     }
//     getLogs()
//     {
//         return this.store;
//     }

//     watch(curr,prev)
//     {
//         const watcher = this;
//         fs.open(this.watchfile,(err,fd)=>{
//             if(err) throw err;
//             let data = '';
//             let logs = [];

//             fs.read(fd,buffer,0,buffer.lenght,prev.size,(err,bytesRead)=>{
//              if(err) throw err;
//              if(bytesRead>0)
//              {
//                 data = buffer.slice(0,bytesRead).toString();
//                 logs = data.split("\n").slice(1);
//                 console.log("logs read: " + logs);
//                 if(logs.length >= TRILINE_LINES)
//                 {
//                     logs.slice(-10).forEach((elem)=>
                    
//                         this.store.push(elem));
//                 }
//                 else{
//                     logs.forEach((elem)=>{
//                         if(this.store.length == TRILINE_LINES)
//                         {
//                             console.log("queue is full");
//                             this.store.shift();
//                         }
//                         this.store.push(elem);
//                     });
//                 }
//                 watcher.emit("process",logs);
//              }
//             });
//         });
//     }

//     start()
//     {
//         var watcher = this;
//         fs.open(this.watchfile,(err,fd)=>{
//             if(err) throw err;
//             let data = '';
//             let logs = [];
//             fs.read(fd,buffer,0,buffer.length,0,(err,bytesRead)=>{
//                 if(err) throw err;
//                 if(bytesRead>0)
//                 {
//                     data = buffer.slice(0,bytesRead).toString();
//                     logs = data.split("\n");
//                     this.store = [];
//                     logs.slice(-10).forEach((elem)=>
//                     this.store.push(elem));
//                 }
//                 fs.close(fd);
//             });
//             fs.watchFile(this.watchfile,{"interval":1000},function(curr,prev){
//                 watcher.watch(curr,prev);
//             });
//         });
//     }

// }
// module.exports = watcher;

const events = require("events");
const fs = require("fs");
const bf = require("buffer");
const buffer = Buffer.alloc(bf.constants.MAX_STRING_LENGTH);
const TRILINE_LINES = 10;

class Watcher extends events.EventEmitter {
    constructor(watchfile) {
        super();
        this.watchfile = watchfile;
        this.store = [];
    }

    getLogs() {
        return this.store;
    }

    watch(curr, prev) {
        const watcher = this;
        fs.open(this.watchfile, 'r', (err, fd) => {
            if (err) throw err;

            let data = '';
            let logs = [];

            // Corrected the length typo
            fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
                if (err) throw err;

                if (bytesRead > 0) {
                    data = buffer.slice(0, bytesRead).toString();
                    logs = data.split("\n").slice(1);
                    console.log("Logs read: " + logs);

                    if (logs.length >= TRILINE_LINES) {
                        logs.slice(-10).forEach((elem) =>
                            this.store.push(elem)
                        );
                    } else {
                        logs.forEach((elem) => {
                            if (this.store.length == TRILINE_LINES) {
                                console.log("Queue is full");
                                this.store.shift();
                            }
                            this.store.push(elem);
                        });
                    }
                    watcher.emit("process", logs);
                }
                fs.close(fd); // Close the file descriptor after reading
            });
        });
    }

    start() {
        const watcher = this;
        fs.open(this.watchfile, 'r', (err, fd) => {
            if (err) throw err;

            let data = '';
            let logs = [];

            fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead) => {
                if (err) throw err;

                if (bytesRead > 0) {
                    data = buffer.slice(0, bytesRead).toString();
                    logs = data.split("\n");

                    this.store = [];
                    logs.slice(-10).forEach((elem) =>
                        this.store.push(elem)
                    );
                }
                fs.close(fd); // Close the file descriptor after reading
            });

            // Set up file watching for changes
            fs.watchFile(this.watchfile, { "interval": 1000 }, function(curr, prev) {
                watcher.watch(curr, prev);
            });
        });
    }
}

module.exports = Watcher;
