var express=require('express')
,app=express()
,path=require('path')
,cheerio = require('cheerio')
,http = require('http'),
escaper = require("true-html-escape")
,url='http://www.lagou.com/jobs/list_.net?kd=.net&spc=1&pl=&gj=&xl=&yx=&gx=&st=&labelWords=&lc=1&workAddress=&city=%E6%88%90%E9%83%BD&requestId=&pn='
app.set('views', './public/')
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))
app.get('/:page',function(req,res){
  var page=req.params.key;
  console.log(page)
  http.get(url+page,function(res1){  //通过get方法获取对应地址中的页面信息

      var chunks = [];
      var size = 0;
      res1.on('data',function(chunk){   //监听事件 传输
          chunks.push(chunk);
          size += chunk.length;
      });
      res1.on('end',function(){  //数据传输完
          var data = Buffer.concat(chunks,size);  
          var html = data.toString();
      //    console.log(html);
          var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理

          var jobs = [];

          var jobs_list = $(".hot_pos li");
          $(".hot_pos>li").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
              var job = {};
              job.company =escaper.unescape($(this).find(".hot_pos_r div").eq(1).find("a").html()); //公司名
              job.period =escaper.unescape( $(this).find(".hot_pos_r span").eq(1).html()); //阶段
              job.scale = escaper.unescape($(this).find(".hot_pos_r span").eq(2).html()); //规模

              job.name = escaper.unescape($(this).find(".hot_pos_l a").attr("title")); //岗位名
              job.src = escaper.unescape($(this).find(".hot_pos_l a").attr("href")); //岗位链接
              job.salary = escaper.unescape($(this).find(".hot_pos_l span").eq(1).html());
              job.allure = escaper.unescape($(this).find(".hot_pos_l span").eq(3).html()); //职位诱惑
              job.exp = escaper.unescape($(this).find(".hot_pos_l span").eq(2).html()); //岗位所需经验
             
              console.log(job.period);  //控制台输出岗位名
              jobs.push(job);  
          });
         
          res.render('index',{
                Lists:jobs
              });
      });
  });
    
})

app.listen(2333)