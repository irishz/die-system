import moment from "moment";
import React, { useEffect } from "react";
import { Table } from "react-bootstrap";

function ReportDelay(props) {
  useEffect(() => {
    console.log(props.list);
  }, [props]);

  return (
    <div>
      <h5>ReportDelay</h5>
      <Table striped bordered hover size="sm">
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
          {props.list
            .filter(
              (list) =>
                list.job.indexOf(props.jobStart) >= 0 ||
                (moment(list.issuedAt).format("DD/MM/YYYY") >=
                  props.startDate &&
                  moment(list.issuedAt).format("DD/MM/YYYY") <= props.endDate)
            )
            .map((list, idx) => (
              <tr style={{ fontSize: 12 }}>
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
