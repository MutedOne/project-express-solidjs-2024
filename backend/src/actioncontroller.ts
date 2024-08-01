
import express from 'express';
import { queryAll } from './queryconcept';
import { authenticationMiddleware } from './verifytoken';
// import helmet from "helmet";
const app = express();
const compression = require('compression')
const actionRoute = app
//.use(helmet())
  .use(compression())
  .get('/action/action',authenticationMiddleware, async (req,res) =>{
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
    res.send(await  queryAll(  'select * from (select *,row_number() over( order by id desc) as rn from  action '+str+') as action WHERE rn>=? and rn<=?  ORDER BY rn  ',[startItem,endItem]))
  })
    .get('/action/actiontotal',authenticationMiddleware, (req,res) =>{
      const query=req.query
     let str =''
   
     if(query.ttype!=undefined || query.desc!=undefined ){
       str = "where ttype like '%"+query.ttype+"%'"
       if(query.desc !=''){
         str+=" and description='"+query.desc+"'"
       }
    }
     queryAll(  'select count(id) as total from action '+str,[]).then((data)=>{
      res.status(200).send(JSON.stringify(data[0].total))
     })
     
   })
    .get('/action/printAction',authenticationMiddleware, (req,res)=>{
        const query=req.query
        let str =''
    
        if(query.ttype!=undefined || query.desc!=undefined ){
      
            str = "where ttype like '%"+query.ttype+"%'"
            if(query.desc !=''){
                str+=" and description='"+query.desc+"'"
            }
    
            queryAll( 'Select ttype,description from action '+str,[]).then((data)=>{
                let dataarr:any=[]
                let newarr = JSON.stringify(data)
                JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
                res.send(dataarr)
            })
        }
    })
    .get('/getIdAction/:id',authenticationMiddleware, async (req,res)=>{
        const params = req.params
        res.send(await queryAll( 'select * from action where id=?',[params.id]))
    })
    .post('/createAction',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll( ' INSERT INTO action (ttype,description) VALUES ( ?,?)',[body.idquery?.ttype,body.idquery?.description]))
    })
    .post('/updateAction',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll(  ' UPDATE action SET ttype=?, description=? WHERE id=?;',[body.idquery?.ttype,body.idquery?.description,body.idquery?.id]))
    })
    .post('/deleteAction',authenticationMiddleware, async (req,res)=>{
        const body = req.body
        res.send(await queryAll(' DELETE FROM action WHERE id=?;',[body.id]))
    })

export{
  actionRoute
}