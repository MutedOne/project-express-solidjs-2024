
import {db} from './setup'

async function queryAll(query:string,queryparam:any){
  
    try{
      const sql = db.format(query,queryparam)
     
      console.log(sql)
      const [rows, fields] =  await db.execute(query,queryparam)
      if (Array.isArray(rows)) {
        // It's an array (RowDataPacket[])
        return rows;
      } else if ('affectedRows' in rows) {
        // It's an OkPacket
        return rows;
      } else if ('affectedRows' in fields) {
        // It's a ResultSetHeader
        return fields;
      } else {
        // Unexpected result type
        return undefined;
      }
      //  return rows
     
    }catch(err:any){
     
      return  { status:err.code}
    } 
    
}

export{
  queryAll
}