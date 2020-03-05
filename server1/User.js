// module.exports={
//     userName:'jack',
//     sayHello:function(){
//         return 'Hello'
//     }
// }
exports.userName='Tom',
exports.sayHello=function(){
    return 'world'
}
let http=require('http')
let url=require('url')
let util=require('util')
let server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader("Content-Type","text/plain;charset=utf-8");
    // res.end("Hello,node.js")
    res.end(util.inspect(url.parse(req.url)))
});
server.listen(3000,'127.0.0.1',()=>{
    console.log("服务器已经运行，请打开浏览，输入:http://127.0.0.1:3000/")
})