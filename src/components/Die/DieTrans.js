import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import moment from "moment";
import axios from "axios";

function DieTrans(props) {
  const [transList, settransList] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die-trans/gettrans/" + props.item)
      .then((res) => settransList(res.data))
      .catch((err) => console.log());
    return () => {
      // cleanup
    };
  }, [props.item]);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Part No.</th>
          <th>LocDie</th>
          <th>ประเภทรายการ</th>
          <th>วันที่ทำรายการ</th>
        </tr>
      </thead>
      <tbody>
        {transList
          .sort((a, b) => (a.trans_date > b.trans_date ? -1 : 1))
          .map((die, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{die.item}</td>
              <td>{die.locdie}</td>
              <td>{die.trans_type}</td>
              <td>{moment(die.trans_date).format("DD/MM/yyyy hh:mm")}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

export default DieTrans;
