

import express from 'express';
import { queryAll } from './queryconcept';
import { authenticationMiddleware } from "./verifytoken";
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
// import helmet from "helmet";
const app = express();
const compression = require('compression')


const userRoute = app
//.use(helmet())
.use(compression())
.post('/currentLogin', authenticationMiddleware, (req, res) => {
    const result = req.headers['authorization'] ?  req.headers['authorization'].slice(7) : null
    const jwtSign= jwt.verify(result, secretKey)
    res.send(jwtSign)

  })
  .get('/account/account',authenticationMiddleware, async (req,res, next) =>{
    const query = req.query
    let pageSize = 20; // Number of items per page
    const page = query.page==null?1:parseInt(query.page);
    let startItem, endItem;
    
    if (page=== 1) {
      startItem = 1;
      endItem = 20;
    } else {
      startItem = (page- 1) * pageSize + 1;
      endItem = startItem + pageSize - 1;
    }
  
  
    let str =''
  
    if(query.username!=undefined || query.name!=undefined || query.aa!=undefined || query.ea!=undefined || query.dept!=undefined|| query.ma!=undefined || query.ua!=undefined || query.status!=undefined){
   
      str = "where username like '%"+query.username+"%'"
      if(query.name !=''){
        str+=" and name='"+query.name+"'"
      }
      if(query.aa !="0"){
        str+=" and aa="+query.aa
      }
      if(query.ea !="0"){
        str+=" and ea="+query.ea
      }
      if(query.ma !="0"){
        str+=" and ma="+query.ma
      }
      if(query.ua !="0"){
        str+=" and ua="+query.ua
      }
      if(query.status !="0"){
        str+=" and status="+query.status
      }
      if(query.dept !="0"){
        str+=" and deptid="+query.dept
      }
    }
  
   res.send(await queryAll('select account.*,department.dept from ( select deptid,id,username,name,IF(status =1, "Active", "Inactive") as status,IF(aa =1, "YES", "NO") as aa,IF(ea =1, "YES", "NO") as ea,IF(ma =1, "YES", "NO") as ma,IF(ua =1, "YES", "NO") as ua, ROW_NUMBER() OVER (order by id desc) as rn from account '+str+') as account left join department on account.deptid = department.id WHERE account.rn>=? and account.rn<=?  ORDER BY account.rn ',[startItem,endItem]))
  })
  .get('/account/accounttotal',authenticationMiddleware, (req,res, next) =>{
    const query = req.query
 
     let str =''
   
     if(query.username!=undefined || query.name!=undefined || query.aa!=undefined || query.ea!=undefined || query.dept!=undefined || query.ma!=undefined || query.ua!=undefined || query.status!=undefined){
      
        str = "where username like '%"+query.username+"%'"
        if(query.name !=''){
          str+=" and name='"+query.name+"'"
        }
       if(query.aa !="0"){
         str+=" and aa="+query.aa
       }
       if(query.ea !="0"){
         str+=" and ea="+query.ea
       }
       if(query.ma !="0"){
         str+=" and ma="+query.ma
       }
       if(query.ua !="0"){
         str+=" and ua="+query.ua
       }
       if(query.status !="0"){
         str+=" and status="+query.status
       }
       if(query.dept !="0"){
         str+=" and deptid="+query.dept
       }
     }else{
  
     }
      queryAll(  'select count(id) as total from account '+str,[]).then((data)=>{
       res.status(200).send(JSON.stringify(data[0].total))
     })
     
   })

   .get('/account/printUsers',authenticationMiddleware, (req,res, next)=>{
    const query = req.query

    let str =''
    if(query.username!=undefined || query.name!=undefined || query.aa!=undefined || query.ea!=undefined || query.dept!=undefined|| query.ma!=undefined || query.ua!=undefined || query.status!=undefined){
   
        str = "where username like '%"+query.username+"%'"
        if(query.name !=''){
          str+=" and name='"+query.name+"'"
        }
        if(query.aa !="0"){
          str+=" and aa="+query.aa
        }
        if(query.ea !="0"){
          str+=" and ea="+query.ea
        }
        if(query.ma !="0"){
          str+=" and ma="+query.ma
        }
        if(query.ua !="0"){
          str+=" and ua="+query.ua
        }
        if(query.status !="0"){
          str+=" and status="+query.status
        }
        if(query.dept !="0"){
          str+=" and deptid="+query.dept
        }
      }

    return queryAll( 'select account.*,department.dept from ( select deptid,id,username,name,IF(status =1, "Active", "Inactive") as status,IF(aa =1, "YES", "NO") as aa,IF(ea =1, "YES", "NO") as ea,IF(ma =1, "YES", "NO") as ma,IF(ua =1, "YES", "NO") as ua, ROW_NUMBER() OVER (order by id desc) as rn from account '+str+') as account left join department on account.deptid = department.id ',[]).then((data)=>{
      let dataarr:any=[]
      let newarr = JSON.stringify(data)
      JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
      res.send(dataarr)
    })
  
  })
.get('/getIdUser/:id',authenticationMiddleware,async (req,res, next)=>{
    const params = req.params
    res.send(await queryAll(  'select account.*,department.dept from ( select * from account where id=? ) as account left join department on account.deptid = department.id',[params.id]))
})
.post('/createUser',authenticationMiddleware, async (req,res, next)=>{
    const body = req.body
    res.send(await queryAll( ' INSERT INTO account (username, name, password, status, aa, ea,ma,ua,deptid,email) VALUES ( ?,?,MD5(?),?,?,?,?,?,?,?)',[body.idquery?.username,body.idquery?.name, body.idquery?.password,body.idquery?.status,body.idquery?.aa,body.idquery?.ea,body.idquery?.ma,body.idquery?.ua,body.idquery?.deptid,body.idquery?.email]))
})
.post('/alldept',authenticationMiddleware, async (req,res, next)=>{
    const body = req.body
    res.send(await  queryAll(  "select * from department where dept like '%"+body.dept+"%' limit 5",[]))
})

.post('/updateUser', async (req,res, next)=>{
    const body = req.body
    res.send(await queryAll(  ' UPDATE account SET username=?, name=?, password=?, status=?, aa=?, ea=?,ma=?,ua=?,deptid=?,email=? WHERE id=?;',[body.idquery?.username,body.idquery?.name,body.idquery?.password,body.idquery?.status,body.idquery?.aa,body.idquery?.ea,body.idquery?.ma,body.idquery?.ua,body.idquery?.deptid,body.idquery?.email,body.idquery?.id]))
})

// .ws('/realtime', {
//   async open(ws) {
//       ws.subscribe("realtimedata");
//         ws.publish("realtimedata",[]);
//   },
//   async message(ws,message) {
//      ws.publish("realtimedata", message);
//   },
//   async close(ws) {
//     ws.unsubscribe("realtimedata");
//   }
//   })


export{
  userRoute
}