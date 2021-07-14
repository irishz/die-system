import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import ReactToExcel from "react-html-table-to-excel";

function ReportDelay(props) {
  const currDate = moment().format("LLL");
  const [dieList, setdieList] = useState(
    props.list.filter(
      (list) => list.issuedAt > props.startDate && list.issuedAt < props.endDate
    )
  );

  useEffect(() => {
    setdieList(
      props.list.filter(
        (list) =>
          list.issuedAt > props.startDate && list.issuedAt < props.endDate
      )
    );
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
          lg={3}
        >
          <h5>Report Delay</h5>
          <label>{dieList.length + " รายการ"}</label>
        </Col>
        <ReactToExcel
          className="btn-success"
          table="report-delay"
          filename={"report-delay-" + currDate}
          sheet="sheet 1"
          buttonText="Export"
        />
      </Row>
      <Table striped bordered hover size="sm" id="report-delay">
        <thead>
          <tr>
            <th>#</th>
            <th>Job</th>
            <th>Item</th>
            <th>LocDie</th>
            <th>MC No.</th>
            <th>Status</th>
            <th>Request By</th>
            <th>Request At</th>
            <th>Issued By</th>
            <th>Issued At</th>
            <th>Delay</th>
          </tr>
        </thead>
        <tbody>
          {dieList.map((list, idx) => (
            <tr style={{ fontSize: 12 }} key={idx}>
              <td>{idx + 1}</td>
              <td>{list.job}</td>
              <td>{list.item}</td>
              <td>{list.locdie}</td>
              <td>{list.mcno}</td>
              <td>{list.status}</td>
              <td>{list.requestBy}</td>
              <td>{moment(list.createdAt).format("DD/MM/YYYY HH:MM")}</td>
              <td>{list.issuedBy}</td>
              <td>{moment(list.issuedAt).format("DD/MM/YYYY HH:MM")}</td>
              <td>{moment(list.issuedAt).fromNow()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportDelay;
