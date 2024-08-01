
import express from 'express';
import { queryAll } from './queryconcept';
import { authenticationMiddleware } from './verifytoken';
// import helmet from "helmet";
const app = express();
const compression = require('compression')
const projectRoute = app
//.use(helmet())
.use(compression())
  .get('/project/project',authenticationMiddleware, async (req,res) =>{
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
  
    if(query.code!=undefined || query.name!=undefined || query.contact!=undefined){
    
       str = "where code like '%"+query.code+"%'"
       if(query.name !=''){
         str+=" and name like '%"+query.name+"%'"
       }
       if(query.contact !=''){
        str+=" and contact like '%"+query.contact+"%'"
      }
    }
    res.send(await queryAll(  'select * from (select *,row_number() over( order by id desc) as rn from  project '+str+') as project WHERE rn>=? and rn<=?  ORDER BY rn  ',[startItem,endItem]))
    
  })
  
  .get('/project/projecttotal',authenticationMiddleware, (req,res) =>{
    const query = req.query
     let str =''
   
   
     if(query.code!=undefined || query.name!=undefined || query.contact!=undefined){
       str = "where code like '%"+query.code+"%'"
       if(query.name !=''){
         str+=" and name like '%"+query.name+"%'"
       }
       if(query.contact !=''){
        str+=" and contact like '%"+query.contact+"%'"
      }
    }
      queryAll(  'select count(id) as total from project '+str,[]).then((data)=>{
        res.status(200).send(JSON.stringify(data[0].total))
     })
   })
    .get('/project/printProject',authenticationMiddleware, (req,res)=>{
        const query = req.query
        let cachekey =''
        let str =''
        if(query.code!=undefined || query.name!=undefined || query.contact!=undefined){
        cachekey ='getProjectPrint:code:'+query.code+':name:'+query.name+':contact:'+query.contact
        str = "where code like '%"+query.code+"%'"
        if(query.name !=''){
            str+=" and name like '%"+query.name+"%'"
        }
        if(query.contact !=''){
            str+=" and contact like '%"+query.contact+"%'"
        }
        }else{
        cachekey ='getProjectPrint:code:'+query.code+':name:'+query.name+':contact:'+query.contact
        }
         queryAll( 'Select code,name,contact from project '+str,[]).then((data)=>{
            let dataarr:any=[]
            let newarr = JSON.stringify(data)
            JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
            res.send(dataarr)
        })
    })
    .get('/getIdProject/:id',authenticationMiddleware, (req,res)=>{
        const params = req.params
     queryAll(  'select * from project where id=?',[params.id]).then((data)=>{
        res.send(data[0])
     })
    })
    .get('/getIdProjectDeep/:id',authenticationMiddleware, async (req,res)=>{
        const params = req.params
        if(params.id != 'summary'){
          res.send(await  queryAll(  'SELECT project.code, COUNT(ticket.id) AS ticket, (SUM(CASE WHEN tr.datecomplete IS NOT NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NOT NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS Complete, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS InProgress, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NULL THEN 1 ELSE 0 END)) AS Pending, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NOT NULL AND tr.started IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NULL AND tr.started IS NULL THEN 1 ELSE 0 END)) AS NotStarted, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS Skipped FROM (SELECT id, datecomplete, skipped, reoccur, started FROM ticket) AS ticket LEFT JOIN ticket AS tr ON ticket.id = tr.id LEFT JOIN (SELECT id,code FROM project) AS project ON project.id = tr.proid where tr.proid=? GROUP BY tr.proid;',[params.id]))
        }else{
            res.send(await  queryAll(  'SELECT project.code, COUNT(ticket.id) AS ticket, (SUM(CASE WHEN tr.datecomplete IS NOT NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NOT NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS Complete, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS InProgress, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NOT NULL AND tr.started IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NULL AND tr.reoccur IS NULL AND tr.started IS NULL THEN 1 ELSE 0 END)) AS Pending, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NOT NULL AND tr.started IS NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NULL AND tr.started IS NULL THEN 1 ELSE 0 END)) AS NotStarted, (SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NOT NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END) + SUM(CASE WHEN tr.datecomplete IS NULL AND tr.skipped IS NOT NULL AND tr.reoccur IS NULL AND tr.started IS NOT NULL THEN 1 ELSE 0 END)) AS Skipped FROM (SELECT id, datecomplete, skipped, reoccur, started FROM ticket) AS ticket LEFT JOIN ticket AS tr ON ticket.id = tr.id LEFT JOIN (SELECT id,code FROM project) AS project ON project.id = tr.proid GROUP BY tr.proid;',[]))
        }
    })
    .post('/createProject',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await  queryAll(  ' INSERT INTO project (code,name,contact) VALUES ( ?,?,?)',[body.idquery?.code,body.idquery?.name,body.idquery?.contact]))
    })
    .post('/updateProject',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll(  ' UPDATE project SET code=?, name=?,contact=? WHERE id=?;',[body.idquery?.code,body.idquery?.name,body.idquery?.contact,body.idquery?.id]))
    })
    .post('/deleteProject',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll(  ' DELETE FROM project WHERE id=?;',[body.id]))
    })

export{
  projectRoute
}