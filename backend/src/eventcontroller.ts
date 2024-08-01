
import express from 'express';
import { queryAll } from './queryconcept';
import { authenticationMiddleware } from './verifytoken';
// import helmet from "helmet";
const app = express();
const compression = require('compression')


const eventRoute = app
//.use(helmet())
  .use(compression())
  .get('/event/event',authenticationMiddleware,  async (req,res) =>{
    const query = req.query
    const page = query.page==null?1:parseInt(query.page); // Assuming body.page contains the current page number
  
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
    res.send(await queryAll( 'select * from (select *,row_number() over( order by id desc) as rn from  eventmaster '+str+') as eventmaster WHERE rn>=? and rn<=?  ORDER BY rn  ',[startItem,endItem]))
  })
  .get('/event/eventtotal',authenticationMiddleware, (req,res) =>{
    const query = req.query
     let str =''
   
     if(query.ttype!=undefined || query.desc!=undefined ){
       str = "where ttype like '%"+query.ttype+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
     queryAll(  'select count(id) as total from eventmaster '+str,[]).then((data)=>{
        res.send(JSON.stringify(data[0].total))
     })
     
   })
   .get('/event/printEvent',authenticationMiddleware, (req,res)=>{
    let str =''
    const query = req.query
    if(query.ttype!=undefined || query.desc!=undefined ){
      str = "where ttype like '%"+query.ttype+"%'"
      if(query.desc !=''){
        str+=" and description='"+query.desc+"'"
      }
   }
   queryAll(  'Select ttype,description from eventmaster '+str,[]).then((data)=>{
    let dataarr:any=[]
    let newarr = JSON.stringify(data)
    JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
    res.send(dataarr)
    })
  })
  .get('/getIdEvent/:id',authenticationMiddleware, async (req,res)=>{
    const params = req.params
    res.send(await queryAll('select * from eventmaster where id=?',[params.id]))
   })
   .post('/createEvent',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll(  ' INSERT INTO eventmaster (ttype,description) VALUES ( ?,?)',[body.idquery?.ttype,body.idquery?.description]))
    })
    .post('/updateEvent',authenticationMiddleware, (req,res)=>{
        const body = req.body
        res.send( queryAll(  ' UPDATE eventmaster SET ttype=?, description=? WHERE id=?;',[body.idquery?.ttype,body.idquery?.description,body.idquery?.id]))
    })
    .post('/deleteEvent',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll(  ' DELETE FROM eventmaster WHERE id=?;',[body.id]))
    })


export{
  eventRoute
}