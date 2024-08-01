import express from "express";
import { queryAll } from "./queryconcept";
import { authenticationMiddleware } from "./verifytoken";

// import helmet from "helmet";
const app = express();
const compression = require("compression");

const deptRoute = app
  //.use(helmet())
  .use(compression())
  .get("/department/department", authenticationMiddleware, async (req, res) => {
    console.log("dasda");
    const query = req.query;
    const page = query.page == null ? 1 : parseInt(query.page);

    const pageSize = 20; // Number of items per page

    let startItem, endItem;

    if (page === 1) {
      startItem = 1;
      endItem = 20;
    } else {
      startItem = (page - 1) * pageSize + 1;
      endItem = startItem + pageSize - 1;
    }

    let str = "";

    if (query.dept != undefined) {
      str = "where dept like '%" + query.dept + "%'";
    }
    res.send(
      await queryAll(
        "select * from (select *,row_number() over( order by id desc) as rn from  department " +
          str +
          ") as department WHERE rn>=? and rn<=?  ORDER BY rn  ",
        [startItem, endItem]
      )
    );
  })

  .get("/department/departmenttotal", authenticationMiddleware, (req, res) => {
    let str = "";
    const query = req.query;
    if (query.dept != undefined) {
      str = "where dept like '%" + query.dept + "%'";
    }
    queryAll("select count(id) as total from department " + str, []).then(
      (data) => {
        res.send(JSON.stringify(data[0].total));
      }
    );
  })
  .get("/department/printDept", authenticationMiddleware, (req, res) => {
    const query = req.query;
    let str = "";

    if (query.dept != undefined) {
      str = "where dept like '%" + query.dept + "%'";
    }
    queryAll("Select dept from department " + str, []).then((data) => {
      let dataarr: any = [];
      let revsul = JSON.stringify(data);
      JSON.parse(revsul).forEach((a: any) => dataarr.push(Object.values(a)));
      res.send(dataarr);
    });
  })
  .get("/getIdDept/:id", authenticationMiddleware, async (req, res) => {
    const params = req.params;
    res.send(
      await queryAll("select * from department where id=?", [params.id])
    );
  })
  .get("/alluserid/:id", authenticationMiddleware, async (req, res) => {
    const params = req.params;
    res.send(
      await queryAll("select * from account where deptid=? limit 5", [
        params.id,
      ])
    );
  })
  .get("/allteam/:id", authenticationMiddleware, async (req, res) => {
    const params = req.params;
    res.send(
      await queryAll(
        "select  depthead,concat('[',GROUP_CONCAT(deptmemberid SEPARATOR ','),']')  as deptmemberid  from deptTeam where deptid=? group by deptid,depthead",
        [params.id]
      )
    );
  })
  .post("/createDept", authenticationMiddleware, async (req, res) => {
    const body = req.body;
    res.send(
      await queryAll(" INSERT INTO department (dept) VALUES ( ?)", [body.dept])
    );
  })

  .post("/updateDept", authenticationMiddleware, async (req, res) => {
    const body = req.body;
    queryAll(" DELETE FROM deptTeam WHERE deptid=?;", [body.id]).then(() => {
      body.team.forEach((val: any) => {
        if (JSON.parse(val.deptmemberid).length > 0) {
          JSON.parse(val.deptmemberid).forEach((val2: any) => {
            queryAll(
              " INSERT INTO deptTeam (deptid,depthead,deptmemberid) VALUES (?,?,?);",
              [body.id, val.depthead, val2]
            );
          });
        } else {
          queryAll(
            " INSERT INTO deptTeam (deptid,depthead,deptmemberid) VALUES (?,?,?);",
            [body.id, val.depthead, 0]
          );
        }
      });
    });

    res.send(
      await queryAll(" UPDATE department SET dept=? WHERE id=?;", [
        body.dept,
        body.id,
      ])
    );
  })

  .post("/deleteDept", authenticationMiddleware, async (req, res) => {
    const body = req.body;
    res.send(await queryAll(" DELETE FROM department WHERE id=?;", [body.id]));
  });

export { deptRoute };
