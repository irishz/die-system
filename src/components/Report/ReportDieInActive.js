import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { Table, Row, Col } from "react-bootstrap";
import ReactToExcel from "react-html-table-to-excel";

function ReportInActive(props) {
  const currDate = moment().format("LLL");
  const [alldieList, setalldieList] = useState([]);
  const [inActiveList, setinActiveList] = useState([]);

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13/api/getalllocdie")
      .then((res) => setalldieList(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("report: " + props.startDate, props.endDate);
    // console.log("report: " + props.dieZone);
    axios
      .get(
        "http://192.168.2.13:4002/die-usage/date-range/" +
          props.startDate +
          "/" +
          props.endDate
      )
      .then((res) => {
        let diefilter = res.data.filter(
          (list) =>
            list.createdAt >= props.startDate && list.createdAt <= props.endDate
        );
        console.log(diefilter);
        let dieList = alldieList.filter(
          (list) => !diefilter.some((die) => die.locdie === list.Uf_Loc_die)
        );
        // console.log(alldieList.filter(
        //   (list) => !diefilter.some((die) => die.locdie === list.Uf_Loc_die)
        // ));
        setinActiveList(
          dieList.filter((list) => list.Uf_Loc_die.indexOf(props.dieZone) >= 0)
        );
      })
      .catch((err) => console.log(err));
  }, [props]);

  return (
    <div>
      <Row style={{ justifyContent: "space-between" }}>
        <Col
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
          lg={4}
        >
          <h5>Report InActive Die</h5>
          <label>{inActiveList.length + " รายการ"}</label>
        </Col>
        <ReactToExcel
          className="btn-success"
          table="report-all"
          filename={"report-all-" + currDate}
          sheet="sheet 1"
          buttonText="Export"
        />
      </Row>
      <Table striped bordered hover size="md" id="report-all">
        <thead>
          <tr>
            <th>#</th>
            <th>Location Die</th>
          </tr>
        </thead>
        <tbody>
          {inActiveList.map((list, idx) => (
            <tr style={{ fontSize: 12 }} key={idx}>
              <td>{idx + 1}</td>
              <td>{list.Uf_Loc_die}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportInActive;
