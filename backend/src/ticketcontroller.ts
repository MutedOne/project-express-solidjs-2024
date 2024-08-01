

// import { transporter } from "./mailer";
import { transporter } from "./mailer";
import { queryAll } from "./queryconcept";
import { authenticationMiddleware } from './verifytoken';
import express from 'express';
import helmet from "helmet";
const app = express();
const jwt = require('jsonwebtoken');
const compression = require('compression')
const secretKey = 'your-secret-key';
const formatter = new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Manila'});

const ticketRoute = app

// .use(helmet())
.use(compression())
.get('/ticket/ticket',authenticationMiddleware,  async (req,res) =>{
    const query = req.query
    const result = req.headers['authorization'] ? req.headers['authorization'].slice(7) : null;
 

    const jwtSign = await jwt.verify(result, secretKey);
    // res.locals.jwtSign = jwtSign;

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
      
        let str ='where datecomplete  is  null  '
      
        if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
          ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
          ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
          ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
          ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
          ||query.devact!=undefined||query.devnotes!=undefined){
      
          str +="and t.ticketno like '%"+query.ticketno+"%' "
          if(query.proid!="0"){
           str += " and t.proid = "+query.proid
          }
          if(query.date!= ''){
           str += " and t.date like '%"+query.date+"%'"
          }
          if(query.envId!="0"){
            str += " and t.envId like '%"+query.envId+"%'"
           }
           if(query.eventId!="0"){
            str += " and t.eventId like '%"+query.eventId+"%'"
           }
           if(query.rp!=''){
            str += " and t.rp like '%"+query.rp+"%'"
           }
           if(query.module!=''){
            str += " and t.module like '%"+query.module+"%'"
           }
           if(query.app!=''){
            str += " and t.app like '%"+query.app+"%'"
           }
           if(query.classId!="0"){
            str += " and t.classId like '%"+query.classId+"%'"
           }
           if(query.issue!=''){
            str += " and t.issue like '%"+query.issue+"%'"
           }
           if(query.note!=''){
            str += " and t.note like '%"+query.note+"%'"
           }
           if(query.status!=''){
            str += " and t.status like '%"+query.status+"%'"
           }
           if(query.devstat!=''){
            str += " and t.devstat like '%"+query.devstat+"%'"
           }
           if(query.devcharge!=''){
            str += " and t.devcharge like '%"+query.devcharge+"%'"
           }
           if(query.timeline!=''){
            str += " and t.timeline like '%"+query.timeline+"%'"
           }
           if(query.devact!=''){
            str += " and t.devact like '%"+query.devact+"%'"
           }
           if(query.devnotes!=''){
            str += " and t.devnotes like '%"+query.devnotes+"%'"
           }
        }
        
        res.send(await  queryAll( 'SELECT rt.rn, rt.id AS id, p.code AS proid, rt.ticketno, rt.date, rt.issue, rt.status, ta.userid FROM (SELECT t.id, t.proid, t.ticketno, t.date, t.issue, t.status, t.datecomplete, ROW_NUMBER() OVER (ORDER BY t.id DESC) AS rn FROM ticket t '+str+') as rt JOIN project p ON rt.proid = p.id JOIN ticketApp ta ON ta.ticketid = rt.id WHERE rt.rn BETWEEN ? AND ? AND ta.userid=? ORDER BY rt.rn;',[startItem,endItem,jwtSign.id]))
        
      })
      
  .get('/ticket/tickettotal',authenticationMiddleware, async (req,res) =>{
    console.log("yaws")
    const query = req.query
    const result = req.headers['authorization'] ? req.headers['authorization'].slice(7) : null;
 

    const jwtSign = await jwt.verify(result, secretKey);
    console.log(jwtSign,"today us ")
    // console.log(decoded.id)
    const page = query.page==null?1:parseInt(query.page);

    let str ='where t.datecomplete  is  null and ta.userid='+jwtSign.id
    if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
      ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
      ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
      ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
      ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
      ||query.devact!=undefined||query.devnotes!=undefined){

      str += " and t.ticketno like '%"+query.ticketno+"%' "
      if(query.proid!="0"){
        str += " and t.proid = "+query.proid
      }
      if(query.date!=''){
       str += " and t.date like '%"+query.date+"%'"
      }
      if(query.envId!="0"){
        str += " and t.envId like '%"+query.envId+"%'"
       }
       if(query.eventId!="0"){
        str += " and t.eventId like '%"+query.eventId+"%'"
       }
       if(query.rp!=''){
        str += " and t.rp like '%"+query.rp+"%'"
       }
       if(query.module!=''){
        str += " and t.module like '%"+query.module+"%'"
       }
       if(query.app!=''){
        str += " and t.app like '%"+query.app+"%'"
       }
       if(query.classId!="0"){
        str += " and t.classId like '%"+query.classId+"%'"
       }
       if(query.issue!=''){
        str += " and t.issue like '%"+query.issue+"%'"
       }
       if(query.note!=''){
        str += " and t.note like '%"+query.note+"%'"
       }
       if(query.status!=''){
        str += " and t.status like '%"+query.status+"%'"
       }
       if(query.devstat!=''){
        str += " and t.devstat like '%"+query.devstat+"%'"
       }
       if(query.devcharge!=''){
        str += " and t.devcharge like '%"+query.devcharge+"%'"
       }
       if(query.timeline!=''){
        str += " and t.timeline like '%"+query.timeline+"%'"
       }
       if(query.devact!=''){
        str += " and t.devact like '%"+query.devact+"%'"
       }
       if(query.devnotes!=''){
        str += " and t.devnotes like '%"+query.devnotes+"%'"
       }
    }
     queryAll( ' SELECT COUNT(t.id) AS total FROM ticket t JOIN project p ON t.proid = p.id JOIN ticketApp ta ON ta.ticketid = t.id '+str+';',[]).then((data)=>{
     
      res.send(JSON.stringify(data[0].total)) 
    })
  })
  
  .get('/ticket/printTicket',authenticationMiddleware, (req,res)=>{
    const query = req.query
    let str ='where datecomplete  is  null '
  
    if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
      ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
      ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
      ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
      ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
      ||query.devact!=undefined||query.devnotes!=undefined){
     
      str += "and ticketno like '%"+query.ticketno+"%'"
      if(query.proid!="0"){
        str += " and proid = "+query.proid
      }
      if(query.date!=''){
       str += " and date like '%"+query.date+"%'"
      }
      if(query.envId!="0"){
        str += " and envId like '%"+query.envId+"%'"
       }
       if(query.eventId!="0"){
        str += " and eventId like '%"+query.eventId+"%'"
       }
       if(query.rp!=''){
        str += " and rp like '%"+query.rp+"%'"
       }
       if(query.module!=''){
        str += " and module like '%"+query.module+"%'"
       }
       if(query.app!=''){
        str += " and app like '%"+query.app+"%'"
       }
       if(query.classId!="0"){
        str += " and classId like '%"+query.classId+"%'"
       }
       if(query.issue!=''){
        str += " and issue like '%"+query.issue+"%'"
       }
       if(query.note!=''){
        str += " and note like '%"+query.note+"%'"
       }
       if(query.status!=''){
        str += " and status like '%"+query.status+"%'"
       }
       if(query.devstat!=''){
        str += " and devstat like '%"+query.devstat+"%'"
       }
       if(query.devcharge!=''){
        str += " and devcharge like '%"+query.devcharge+"%'"
       }
       if(query.timeline!=''){
        str += " and timeline like '%"+query.timeline+"%'"
       }
       if(query.devact!=''){
        str += " and devact like '%"+query.devact+"%'"
       }
       if(query.devnotes!=''){
        str += " and devnotes like '%"+query.devnotes+"%'"
       }
    }
     queryAll(  'Select proid,ticketno,date,issue,status from ticket '+str+' order by id desc',[]).then((data)=>{
        let dataarr:any=[]
        let newarr = JSON.stringify(data)
        JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
        res.send(dataarr)
    })
  })
  .get('/ticket/ticketdone',authenticationMiddleware,  async (req,res) =>{
    const query = req.query
    const result = req.headers['authorization'] ? req.headers['authorization'].slice(7) : null;
 

    const jwtSign = await jwt.verify(result, secretKey);
    // res.locals.jwtSign = jwtSign;

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
      
        let str ='where datecomplete  is not  null  '
      
        if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
          ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
          ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
          ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
          ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
          ||query.devact!=undefined||query.devnotes!=undefined){
      
          str +="and t.ticketno like '%"+query.ticketno+"%' "
          if(query.proid!="0"){
           str += " and t.proid = "+query.proid
          }
          if(query.date!= ''){
           str += " and t.date like '%"+query.date+"%'"
          }
          if(query.envId!="0"){
            str += " and t.envId like '%"+query.envId+"%'"
           }
           if(query.eventId!="0"){
            str += " and t.eventId like '%"+query.eventId+"%'"
           }
           if(query.rp!=''){
            str += " and t.rp like '%"+query.rp+"%'"
           }
           if(query.module!=''){
            str += " and t.module like '%"+query.module+"%'"
           }
           if(query.app!=''){
            str += " and t.app like '%"+query.app+"%'"
           }
           if(query.classId!="0"){
            str += " and t.classId like '%"+query.classId+"%'"
           }
           if(query.issue!=''){
            str += " and t.issue like '%"+query.issue+"%'"
           }
           if(query.note!=''){
            str += " and t.note like '%"+query.note+"%'"
           }
           if(query.status!=''){
            str += " and t.status like '%"+query.status+"%'"
           }
           if(query.devstat!=''){
            str += " and t.devstat like '%"+query.devstat+"%'"
           }
           if(query.devcharge!=''){
            str += " and t.devcharge like '%"+query.devcharge+"%'"
           }
           if(query.timeline!=''){
            str += " and t.timeline like '%"+query.timeline+"%'"
           }
           if(query.devact!=''){
            str += " and t.devact like '%"+query.devact+"%'"
           }
           if(query.devnotes!=''){
            str += " and t.devnotes like '%"+query.devnotes+"%'"
           }
        }
        
        res.send(await  queryAll( 'SELECT rt.rn, rt.id AS id, p.code AS proid, rt.ticketno, rt.date, rt.issue, rt.status, ta.userid FROM (SELECT t.id, t.proid, t.ticketno, t.date, t.issue, t.status, t.datecomplete, ROW_NUMBER() OVER (ORDER BY t.id DESC) AS rn FROM ticket t '+str+') as rt JOIN project p ON rt.proid = p.id JOIN ticketApp ta ON ta.ticketid = rt.id WHERE rt.rn BETWEEN ? AND ? AND ta.userid=? ORDER BY rt.rn;',[startItem,endItem,jwtSign.id]))
        
      })
      
  .get('/ticket/tickettotaldone',authenticationMiddleware, async (req,res) =>{
    const query = req.query
    const result = req.headers['authorization'] ? req.headers['authorization'].slice(7) : null;
 

    const jwtSign = await jwt.verify(result, secretKey);
    // console.log(decoded.id)
    const page = query.page==null?1:parseInt(query.page);

    let str ='where t.datecomplete  is not null and ta.userid='+jwtSign.id
    if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
      ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
      ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
      ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
      ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
      ||query.devact!=undefined||query.devnotes!=undefined){

      str += " and t.ticketno like '%"+query.ticketno+"%' "
      if(query.proid!="0"){
        str += " and t.proid = "+query.proid
      }
      if(query.date!=''){
       str += " and t.date like '%"+query.date+"%'"
      }
      if(query.envId!="0"){
        str += " and t.envId like '%"+query.envId+"%'"
       }
       if(query.eventId!="0"){
        str += " and t.eventId like '%"+query.eventId+"%'"
       }
       if(query.rp!=''){
        str += " and t.rp like '%"+query.rp+"%'"
       }
       if(query.module!=''){
        str += " and t.module like '%"+query.module+"%'"
       }
       if(query.app!=''){
        str += " and t.app like '%"+query.app+"%'"
       }
       if(query.classId!="0"){
        str += " and t.classId like '%"+query.classId+"%'"
       }
       if(query.issue!=''){
        str += " and t.issue like '%"+query.issue+"%'"
       }
       if(query.note!=''){
        str += " and t.note like '%"+query.note+"%'"
       }
       if(query.status!=''){
        str += " and t.status like '%"+query.status+"%'"
       }
       if(query.devstat!=''){
        str += " and t.devstat like '%"+query.devstat+"%'"
       }
       if(query.devcharge!=''){
        str += " and t.devcharge like '%"+query.devcharge+"%'"
       }
       if(query.timeline!=''){
        str += " and t.timeline like '%"+query.timeline+"%'"
       }
       if(query.devact!=''){
        str += " and t.devact like '%"+query.devact+"%'"
       }
       if(query.devnotes!=''){
        str += " and t.devnotes like '%"+query.devnotes+"%'"
       }
    }
     queryAll( ' SELECT COUNT(t.id) AS total FROM ticket t JOIN project p ON t.proid = p.id JOIN ticketApp ta ON ta.ticketid = t.id '+str+';',[]).then((data)=>{
     
      res.send(JSON.stringify(data[0].total)) 
    })
  })
  
  .get('/ticket/printTicketdone',authenticationMiddleware, (req,res)=>{
    const query = req.query
    let str ='where datecomplete  is not  null '
  
    if(query.ticketno!=undefined||query.proid!=undefined||query.date!=undefined
      ||query.envId!=undefined||query.eventId!=undefined||query.rp!=undefined
      ||query.module!=undefined||query.app!=undefined||query.classId!=undefined
      ||query.issue!=undefined||query.note!=undefined||query.status!=undefined
      ||query.devstat!=undefined||query.devcharge!=undefined||query.timeline!=undefined
      ||query.devact!=undefined||query.devnotes!=undefined){
     
      str += "and ticketno like '%"+query.ticketno+"%'"
      if(query.proid!="0"){
        str += " and proid = "+query.proid
      }
      if(query.date!=''){
       str += " and date like '%"+query.date+"%'"
      }
      if(query.envId!="0"){
        str += " and envId like '%"+query.envId+"%'"
       }
       if(query.eventId!="0"){
        str += " and eventId like '%"+query.eventId+"%'"
       }
       if(query.rp!=''){
        str += " and rp like '%"+query.rp+"%'"
       }
       if(query.module!=''){
        str += " and module like '%"+query.module+"%'"
       }
       if(query.app!=''){
        str += " and app like '%"+query.app+"%'"
       }
       if(query.classId!="0"){
        str += " and classId like '%"+query.classId+"%'"
       }
       if(query.issue!=''){
        str += " and issue like '%"+query.issue+"%'"
       }
       if(query.note!=''){
        str += " and note like '%"+query.note+"%'"
       }
       if(query.status!=''){
        str += " and status like '%"+query.status+"%'"
       }
       if(query.devstat!=''){
        str += " and devstat like '%"+query.devstat+"%'"
       }
       if(query.devcharge!=''){
        str += " and devcharge like '%"+query.devcharge+"%'"
       }
       if(query.timeline!=''){
        str += " and timeline like '%"+query.timeline+"%'"
       }
       if(query.devact!=''){
        str += " and devact like '%"+query.devact+"%'"
       }
       if(query.devnotes!=''){
        str += " and devnotes like '%"+query.devnotes+"%'"
       }
    }
     queryAll(  'Select proid,ticketno,date,issue,status from ticket '+str+' order by id desc',[]).then((data)=>{
        let dataarr:any=[]
        let newarr = JSON.stringify(data)
        JSON.parse(newarr).forEach((a:any )=>  dataarr.push(Object.values(a)) )
        res.send(dataarr)
    })
  })

.get('/getIdTicket/:id',authenticationMiddleware, async (req,res)=>{
    const params = req.params
    res.send(await queryAll( ' SELECT t.id, t.ticketno, t.date, t.dateend, t.envid, t.eventid, t.rp, t.module, t.app, t.proid, t.classid, t.issue, t.skipped, t.reoccur, t.started, t.datecomplete, p.code AS pproid, e.ttype AS eenvid, em.ttype AS eeventid, c.code AS cclassid, IF(t.reoccur IS NOT NULL, r.ticketno, NULL) AS rreoccur FROM ticket t LEFT JOIN project p ON t.proid = p.id LEFT JOIN environment e ON t.envid = e.id LEFT JOIN eventmaster em ON t.eventid = em.id LEFT JOIN classification c ON t.classid = c.id LEFT JOIN ticket r ON t.reoccur = r.id WHERE t.id = ?;  ',[params.id]))
})

.get('/getIdTicketHead/:id',authenticationMiddleware, async (req,res)=>{
    const params = req.params
    res.send(await queryAll(  'select ifnull(group_concat( account.name),\'\')   as name from (select userid,id from ticketApp where ticketid=? and date is not null) as ticketApp left join deptTeam on ticketApp.userid  = deptTeam.deptmemberid left join (select id,name from account) as account on deptTeam.depthead=account.id  group by ticketApp.id,ticketApp.userid ',[params.id]))
})
.get('/getIdTicketApp/:id',authenticationMiddleware, async (req,res)=>{
    const params = req.params
    res.send(await  queryAll(  ' select concat(\'[\', group_concat(ticketApp.deptid),\']\') as deptid,concat(\'[\',group_concat(concat(\'"\',ticketApp.note,\'"\') ),\']\')  as note , concat(\'[\',group_concat(concat(\'"\',ticketApp.action,\'"\') ),\']\')  as action ,concat(\'[\',group_concat(ticketApp.userid),\']\')  as userid ,concat(\'[\',group_concat(concat(\'"\',department.dept,\'"\') ),\']\')  as ddeptid ,concat(\'[\',group_concat(concat(\'"\', account.name,\'"\')),\']\')  as uuserid ,concat(\'[\',group_concat(concat(\'"\', ticketApp.date,\'"\')),\']\')  as date  from (select deptid,userid,ticketid,action,note,date from ticketApp where ticketid=?) as ticketApp left join department on ticketApp.deptid = department.id left join (select id,name from account) as account on account.id = ticketApp.userid group by ticketApp.ticketid',[params.id]))
})

.post('/createTicket',authenticationMiddleware, (req,res)=>{
    const body = req.body
   queryAll(' INSERT INTO ticket (proid,date,envid,eventid,rp,module,app,classid,issue,dateend) VALUES ( ?,CURRENT_DATE(),?,?,?,?,?,?,?,?)',[body.idquery?.proid,body.idquery?.envid,body.idquery?.eventid,body.idquery?.rp,body.idquery?.module,body.idquery?.app,body.idquery?.classid,body.idquery?.issue,body.idquery?.dateend])
  .then(()=>{
    return queryAll('SELECT LAST_INSERT_ID() as lastid;',[])
  }).then((val)=>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // Get the current year (4 digits)
    const currentMonth = currentDate.getMonth() + 1; // Get the current month (0-11, so add 1)
    const currentDay = currentDate.getDate(); // Get the current day of the month (1-31)
    const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
    if(body.idquery?.ticketsearch != 0){
        queryAll( 'UPDATE ticket SET ticketno = ?,reoccur=? WHERE id=?;',[formattedDate+val[0].lastid,body.idquery?.ticketsearch,val[0].lastid])
    }else{
        queryAll( 'UPDATE ticket SET ticketno = ? WHERE id=?;',[formattedDate+val[0].lastid,val[0].lastid])
    }
 
    
     body.idquery?.appseq?.dept.forEach((z:any,index:any)=>{
        queryAll( 'insert into ticketApp (ticketid,deptid,userid) VALUES (?,?,?) ',[val[0].lastid,z, body.idquery?.appseq?.name[index]])
     })

    res.send(JSON.stringify( val[0].lastid))
  })
})

.post('/updateTicket',authenticationMiddleware, (req,res)=>{
    const body = req.body

  queryAll(' DELETE FROM ticketApp WHERE ticketid=?;',[body.idquery?.id]).then(()=>{
    body.idquery?.appseq?.dept.forEach((z:any,index:any)=>{
        queryAll( 'insert into ticketApp (ticketid,deptid,userid) VALUES (?,?,?) ',[body.idquery?.id,z, body.idquery?.appseq?.name[index]])
     })
   
     res.send( queryAll(  'UPDATE ticket SET proid=?,ticketno=?,envId=?,eventId=?,rp=?,module=?,app=?,classId=?,issue=?,dateend=?,reoccur=? WHERE id=?;',[body.idquery?.proid,body.idquery?.ticketno,body.idquery?.envid,body.idquery?.eventid,body.idquery?.rp,body.idquery?.module,body.idquery?.app,body.idquery?.classid,body.idquery?.issue,body.idquery?.dateend,body.idquery?.ticketsearch==0?null:body.idquery?.ticketsearch,body.idquery?.id]))
  })
})
.post('/deleteTicket',authenticationMiddleware, (req,res)=>{
    const body = req.body
    res.send( queryAll(  ' DELETE FROM ticket WHERE id=?;',[body.id]))
})
.post('/allproid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll("select id,code from project where code like '%"+body.code+"%' limit 5",[]))
})
.post('/allenvid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll(  "select id,ttype from environment where ttype like '%"+body.ttype+"%' limit 5",[]))
})
.post('/alleventid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll( "select id,ttype from eventmaster where ttype like '%"+body.ttype+"%' limit 5",[]))
})
.post('/allclassid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll( "select id,code from classification where code like '%"+body.code+"%' limit 5",[]))
})
.post('/alluseridticket',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll(  "select id,name from account where name like '%"+body.name+"%' and deptid =? limit 5",[body.deptid]))
})
.post('/alldeptid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll(  "select id,dept from department where dept like '%"+body.dept+"%' limit 5",[]))
})
.post('/allticketid',authenticationMiddleware, async (req,res)=>{
    const body = req.body
    res.send(await queryAll(  "select id,ticketno from ticket where ticketno like '%"+body.ticketno+"%' limit 5",[]))
})

.post('/getIdTicketSkipped',authenticationMiddleware, (req,res)=>{
    const body = req.body
    res.send( queryAll('UPDATE ticket SET skipped=1,datecomplete=current_date() WHERE id=?',[body.idquery?.id]))
})

.post('/getIdTicketApprove',authenticationMiddleware, (req,res)=>{
    const body = req.body
  queryAll('UPDATE ticket SET started=1 WHERE id=?',[body.idquery?.id])
  if(body.idquery?.appseq?.dept.length == body.key+1){
   
    queryAll('UPDATE ticket SET datecomplete=current_date() WHERE id=?',[body.idquery?.id])
    queryAll('select group_concat(account.email ) as email from (select userid from ticketApp where userid=?) as ticketApp left join deptTeam on ticketApp.userid = deptTeam.deptmemberid left join (select email,id from account) as account on account.id = deptTeam.depthead',[body.idquery?.appseq?.name[body.key]]).then((data=>{
      transporter.sendMail({
        from: "stephenrabor@gmail.com",
        to: data[0].email,
        subject: 'Completed on this task ticketno:'+body.idquery?.ticketno,
        text:  'try'
         }, function(error:any, info:any){
           if (error) {
     
     
           console.log(error );
           } else {
           console.log('Email sent: ' + info.response);
           }
         });
    }))
  }else{
    queryAll('select group_concat(account.email ) as email from (select userid from ticketApp where userid=?) as ticketApp left join deptTeam on ticketApp.userid = deptTeam.deptmemberid left join (select email,id from account) as account on account.id = deptTeam.depthead',[body.idquery?.appseq?.name[body.key]]).then((data=>{
      transporter.sendMail({
        from: "stephenrabor@gmail.com",
        to: data[0].email,
        subject: 'Approve on task this ticketno:'+body.idquery?.ticketno,
        text:  'try'
         }, function(error:any, info:any){
           if (error) {
           console.log(error );
           } else {
           console.log('Email sent: ' + info.response);
           }
         });
    }))
  }
  res.send( queryAll(  'UPDATE ticketApp SET note=?,action=?,date=current_date() WHERE ticketid=? and userid=? and deptid=?;',[body.idquery?.appseq?.note[body.key],body.idquery?.appseq?.action[body.key],body.idquery?.id,body.idquery?.appseq?.name[body.key],body.idquery?.appseq?.dept[body.key]]))
})

export{
  ticketRoute
}