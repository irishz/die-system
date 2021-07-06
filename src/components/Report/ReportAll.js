import moment from "moment";
import React, { useEffect } from "react";
import { Table, Row } from "react-bootstrap";
import ReactToExcel from "react-html-table-to-excel";

function ReportAll(props) {
  const currDate = moment().format('LLL');

  useEffect(() => {
    console.log(props.list);
  }, [props]);

  return (
    <div>
      <Row style={{ justifyContent: "space-between" }}>
        <h5>ReportAll</h5>
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
          {props.list
            .filter(
              (list) =>
                list.job.indexOf(props.jobStart) >= 0 ||
                (moment(list.createdAt).format("DD/MM/YYYY") >=
                  props.startDate &&
                  moment(list.createdAt).format("DD/MM/YYYY") <= props.endDate)
            )
            .map((list, idx) => (
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
