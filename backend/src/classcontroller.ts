
import express from 'express';
import { queryAll } from './queryconcept';
import { authenticationMiddleware } from './verifytoken';
// import helmet from "helmet";
const app = express();
const compression = require('compression')

const classificationRoute = app

    //.use(helmet())
    .use(compression())
   .get('/class/class',authenticationMiddleware, async (req, res) =>{
    const query = req.query
    const page = query.page==null?1:parseInt(query.page); // Assuming body.page contains the current page number
  
    const pageSize = 20; // Number of items per page
    
    let startItem, endItem;
    
    if (page == 1) {
      startItem = 1;
      endItem = 20;
    } else {
      startItem = (page- 1) * pageSize + 1;
      endItem = startItem + pageSize - 1;
    }
  
    let cachekey =''
    let str =''
  
    if(query.code!=undefined || query.desc!=undefined ){
       cachekey ='getClass:code:'+query.code+':desc:'+query.desc+':page='+query.page
       str = "where code like '%"+query.code+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
    res.send(await queryAll( 'select * from (select *,row_number() over( order by id desc) as rn from  classification '+str+') as classification WHERE rn>=? and rn<=?  ORDER BY rn  ',[startItem,endItem]))
  })
  .get('/class/classtotal',authenticationMiddleware, (req, res) =>{
    const query = req.query
 
     let str =''
   
     if(query.code!=undefined || query.desc!=undefined ){
   
       str = "where code like '%"+query.code+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
      queryAll(  'select count(id) as total from classification '+str,[]).then((data)=>{
        res.send(JSON.stringify(data[0].total))
     })
   })
  .get('/class/printClass',authenticationMiddleware, (req, res)=>{
    const query = req.query
    let cachekey =''
    let str =''
    if(query.code!=undefined || query.desc!=undefined ){
      cachekey ='getClassPrint:code:'+query.code+':desc:'+query.desc
      str = "where code like '%"+query.code+"%'"
      if(query.desc !=''){
        str+=" and description='"+query.desc+"'"
      }
   }
     queryAll( 'Select code,description from classification '+str,[]).then((data)=>{
      let dataarr:any=[]
      let newarr = JSON.stringify(data)
      JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
      res.send(dataarr)
    })
  })
  .get('/getIdClass/:id',authenticationMiddleware, async (req, res)=>{
    const params = req.params
    res.send(await queryAll(  'select * from classification where id=?',[params.id]))
  })

   .post('/createClass',authenticationMiddleware, async (req, res)=>{
    const body = req.body
    res.send(await queryAll(  'INSERT INTO classification (code,description) VALUES ( ?,?)',[body.idquery?.code,body.idquery?.description]))
   })

   .post('/updateClass',authenticationMiddleware, async (req, res)=>{
    const body = req.body
    res.send(await queryAll(  ' UPDATE classification SET code=?, description=? WHERE id=?;',[body.idquery?.code,body.idquery?.description,body.idquery?.id]))
    })
    .post('/deleteClass',authenticationMiddleware, async (req, res)=>{
        const body = req.body
        res.send(await queryAll(  ' DELETE FROM classification WHERE id=?;',[body.id]))
    })

export{
  classificationRoute
}