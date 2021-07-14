import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "react-bootstrap";
import ReactToExcel from "react-html-table-to-excel";

function ReportAll(props) {
  const currDate = moment().format("LLL");
  const [dieList, setdieList] = useState(
    props.list.filter(
      (list) =>
        list.job.indexOf(props.jobStart) >= 0 ||
        (list.createdAt >= props.startDate &&
          list.createdAt <= props.endDate)
    )
  );

  useEffect(() => {
    // console.log("report:" + props.startDate, props.endDate);
    setdieList(
      props.list.filter(
        (list) =>
          list.job.indexOf(props.jobStart) >= 0 &&
          (list.createdAt >= props.startDate &&
            list.createdAt <= props.endDate)
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
          <h5>ReportNG </h5>
          <label>{dieList.length + " รายการ"}</label>
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
            <th>Job</th>
            <th>Part No.</th>
            <th>Die Location</th>
            <th>M/C</th>
            <th>Status</th>
            <th>Request By</th>
            <th>Created At</th>
            <th>Issued By</th>
            <th>Issued At</th>
            <th>Received By</th>
            <th>Received At</th>
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
              <td>{list.receivedBy}</td>
              <td>{moment(list.receivedAt).format("DD/MM/YYYY HH:MM")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportAll;
