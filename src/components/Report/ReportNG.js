import moment from "moment";
import React, { useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

function ReportNG(props) {
  useEffect(() => {
    console.log(props.list);
  }, [props]);

  return (
    <div>
      <h5>ReportNG</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th colSpan={6}></th>
            <th colSpan={12} style={{ textAlign: "center" }}>
              สาเหตุชำรุด
            </th>
          </tr>
          <tr>
            <th colSpan={6}></th>
            <th colSpan={6} style={{ textAlign: "center" }}>
              ตรวจสอบไม้
            </th>
            <th colSpan={6} style={{ textAlign: "center" }}>
              ตรวจสอบมีด
            </th>
          </tr>
          <tr style={{ fontSize: 12 }}>
            <th>Job No.</th>
            <th>Part No.</th>
            <th>Die Location</th>
            <th>M/C</th>
            <th>ReceivedBy</th>
            <th>ReceivedAt</th>
            <th>แตก</th>
            <th>ยุบ</th>
            <th>บิดเบี้ยว</th>
            <th>ร่องหลวม</th>
            <th>ไม้ลอก</th>
            <th>ร่องไม้แตก</th>
            <th>แตก</th>
            <th>บิ่น</th>
            <th>หาย</th>
            <th>กาวติด</th>
            <th>คด</th>
            <th>สนิม</th>
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
              <tr style={{ fontSize: 12 }}>
                <td>{list.job}</td>
                <td>{list.item}</td>
                <td>{list.locdie}</td>
                <td>{list.mcno}</td>
                <td>{list.receivedBy}</td>
                <td>{moment(list.receivedAt).format("DD/MM/YYYY HH:MM")}</td>
                {list.checkDie.wood.map((die) => (
                  <>
                    <td style={die.checked ? { color: "red" } : null}>
                      {die.checked ? "NG" : "OK"}
                    </td>
                  </>
                ))}
                {list.checkDie.blade.map((die) => (
                  <>
                    <td style={die.checked ? { color: "red" } : null}>
                      {die.checked ? "NG" : "OK"}
                    </td>
                  </>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportNG;

const styles = {
  header: {
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
  },
};
