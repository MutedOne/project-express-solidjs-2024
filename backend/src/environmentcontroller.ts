
import express from 'express';
import { queryAll } from './queryconcept';

import { authenticationMiddleware } from './verifytoken';
// import helmet from "helmet";
const app = express();
const compression = require('compression')
const environmentRoute = app
//.use(helmet())
.use(compression())
  .get('/env/env',authenticationMiddleware,  async (req,res) =>{
    const query = req.query
    const page = query.page==null?1:parseInt(query.page);
  
    const pageSize = 20; // Number of items per page
    
    let startItem, endItem;
    
    if (page === 1) {
      startItem = 1;
      endItem = 20;
    } else {
      startItem = (page - 1) * pageSize + 1;
      endItem = startItem + pageSize - 1;
    }

    let str =''
  
    if(query.ttype!=undefined || query.desc!=undefined ){
     
       str = "where ttype like '%"+query.ttype+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
    res.send(await queryAll( 'select * from (select *,row_number() over( order by id desc) as rn from  environment '+str+') as environment WHERE rn>=? and rn<=?  ORDER BY rn  ',[startItem,endItem]))
    
  })
  .get('/env/envtotal',authenticationMiddleware, (req,res) =>{
    const query = req.query

     let str =''
   
     if(query.ttype!=undefined || query.desc!=undefined ){
      
       str = "where ttype like '%"+query.ttype+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
      queryAll(  'select count(id) as total from environment '+str,[]).then((data)=>{
        res.send(JSON.stringify( data[0].total))
     })
     
   })

  .get('/env/printEnv',authenticationMiddleware, (req,res)=>{

    let str =''
    const query = req.query
    if(query.ttype!=undefined || query.desc!=undefined ){
    
      str = "where ttype like '%"+query.ttype+"%'"
      if(query.desc !=''){
        str+=" and description='"+query.desc+"'"
      }
   }
    return queryAll( 'Select ttype,description from environment '+str,[]).then((data)=>{
      let dataarr:any=[]
      let revsul = JSON.stringify(data)
      JSON.parse(revsul).forEach((a:any)=>  dataarr.push(Object.values(a)) )
          res.send(dataarr)
    })
  })
  .get('/getIdEnv/:id',authenticationMiddleware, async (req,res)=>{
    const params = req.params
    res.send(await queryAll(  'select * from environment where id=?',[params.id]))
  })
  .post('/createEnv',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll( ' INSERT INTO environment (ttype,description) VALUES ( ?,?)',[body.idquery?.ttype,body.idquery?.description]))
  })
  .post('/updateEnv',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await  queryAll( ' UPDATE environment SET ttype=?, description=? WHERE id=?;',[body.idquery?.ttype,body.idquery?.description,body.idquery?.id]))
  })
.post('/deleteEnv',authenticationMiddleware, async (req,res)=>{
  const body = req.body
  res.send(await  queryAll( ' DELETE FROM environment WHERE id=?;',[body.id]))
})

export{
  environmentRoute
}