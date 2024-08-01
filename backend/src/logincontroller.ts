
import express from 'express';
import { queryAll } from './queryconcept';
import helmet from 'helmet';
const compression = require('compression')
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

const loginRoute= express()
//.use(helmet())
.use(compression())
.post('/login', async (req, res) => {
    const body = req.body
 
    queryAll('select id from account where username=?',[body.username]).then((data2)=>{
      console.log(data2[0])
      if(data2[0]!=undefined){
  
         queryAll('select account.id,username,name,status,aa,ea,ma,ua,deptid,department.dept from account  join department on account.deptid=department.id where username=? and password=?',[body.username,body.password])
        .then(async (data)=>{
          console.log(data)
          if(data[0]!=undefined){
            if(data[0].status == 1){

              const jwtSign= jwt.sign(data[0], secretKey)
               res.send({token:jwtSign})
            }else{
              res.send({cstatus:'Account is not active'})
            }
          }else{
            res.send({cstatus:'passdif'})
          }
        }) 
      }else{
        res.send({cstatus:'No Account'})
      }
      
    })

    
})


export{
  loginRoute
}