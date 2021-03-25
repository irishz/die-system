import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Redirect } from "react-router-dom";

function DieRequest() {
  const userTokenData = JSON.parse(localStorage.getItem("userToken"));

  const [dieList, setdieList] = useState([]);
  const [scanInput, setscanInput] = useState("");
  let inputRef = null;
  const [item, setitem] = useState("");
  const [locdie, setlocdie] = useState("");
  const [btnEnable, setbtnEnable] = useState(true);
  const [alertSuccess, setalertSuccess] = useState(false);
  const [alertErr, setalertErr] = useState(false);
  const [alertCreateErr, setalertCreateErr] = useState(false);
  const [alertExistData, setalertExistData] = useState(false);
  const [currDateTime, setcurrDateTime] = useState("");

  useLayoutEffect(() => {
    if (userTokenData) {
      axios
        .get("http://192.168.2.13:4001/die-usage/find/" + userTokenData[3])
        .then((res) => setdieList(res.data))
        .catch((err) => console.log(err));
    }
  }, [dieList, userTokenData]);

  useEffect(() => {
    moment.locale("th");
    setInterval(() => {
      setcurrDateTime(moment().format("DD MMMM YYYY, h:mm:ss"));
    }, 1000);
  }, [currDateTime]);

  if (localStorage.getItem("userToken") === null) {
    <Redirect to="\" />;
  }

  function handleScaned(e) {
    if (e.charCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      //   console.log(scanInput);
      axios
        .get("http://192.168.2.13/api/getitemlocdie/" + scanInput)
        .then((res) => {
          // console.log(res.data.cust_item, res.data.Uf_Loc_die);
          if (res.data.cust_item) {
            setitem(res.data.cust_item);
          }
          setlocdie(res.data.Uf_Loc_die);
        })
        .catch((err) => {
          //   console.log(err);
          setalertErr(true);
          setTimeout(() => {
            setalertErr(false);
          }, 3000);
        });
    }

    // button enable validation
    if (scanInput !== "") {
      setbtnEnable(false);
      //   setalertErr(false);
    }
  }

  function handleRequestDie() {
    let obj = {
      job: scanInput,
      item: item,
      locdie: locdie,
      mcno: userTokenData[3],
      status: "กำลังรอ die",
      requestBy: userTokenData[0],
      issuedBy: null,
      issuedAt: null,
      recievedBy: null,
      recievedAt: null,
      checkDie: null,
    };
    // console.log(obj);

    if (
      dieList.filter(
        (die) =>
          die.item === item &&
          die.status === "กำลังรอ die" &&
          die.job === scanInput
      ).length > 0
    ) {
      setalertExistData(true);
      setTimeout(() => {
        setalertExistData(false);
      }, 3000);
    } else {
      axios
        .post("http://192.168.2.13:4001/die-usage/create", obj)
        .then(() => {
          setalertSuccess(true);
          setTimeout(() => {
            setalertSuccess(false);
          }, 3000);
        })
        .catch(() => {
          setalertCreateErr(true);
          setTimeout(() => {
            setalertCreateErr(false);
          }, 3000);
        });
    }

    // reset state
    setitem("");
    setlocdie("");
    setscanInput("");
    inputRef.value = "";
    inputRef.focus();
  }

  function rendenAlert(message, type, show) {
    return (
      <Alert variant={type} show={show}>
        {message}
      </Alert>
    );
  }

  return (
    <Container>
      <Row>
        {/* Table Section */}
        <Col lg={6}>
          <Table striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Job</th>
                <th>Part No.</th>
                <th>Loc Die</th>
                <th>M/C</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {dieList
                .filter(
                  (die) =>
                    moment(die.createdAt).format("LL") === moment().format("LL") && die.status === "กำลังรอ die"
                )
                .map((die, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{die.job}</td>
                    <td>{die.item}</td>
                    <td>{die.locdie}</td>
                    <td>{die.mcno}</td>
                    <td>{die.status}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>

        {/* Form Section */}
        <Col lg={6}>
          <Row>
            <Col>
              <h5>เวลาและวันที่</h5>
              <Form.Control
                type="text"
                value={currDateTime}
                readOnly={true}
              ></Form.Control>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col>สแกนหมายเลข Job</Col>
            <Form.Control
              ref={(el) => (inputRef = el)}
              type="text"
              onChange={(e) => setscanInput(e.target.value)}
              onKeyPress={(e) => handleScaned(e)}
              onKeyDown={(e) => handleScaned(e)}
              autoFocus={true}
              maxLength={10}
            ></Form.Control>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Col>Part No.</Col>
            <Col>Location Die</Col>
          </Row>
          <Row>
            <Col>
              <Form.Control value={item} readOnly={true}></Form.Control>
            </Col>
            <Col>
              <Form.Control value={locdie} readOnly={true}></Form.Control>
            </Col>
          </Row>

          <Row style={{ marginTop: 15 }}>
            <Button
              color="primary"
              onClick={handleRequestDie}
              disabled={scanInput.length === 10 ? false : true}
            >
              ร้องขอ Die
            </Button>
          </Row>

          <Row style={{ marginTop: 30 }}>
            <Col>
              {rendenAlert(
                "เกิดข้อผิดพลาด กรุณาลองใหม่",
                "danger",
                alertCreateErr
              )}
              {rendenAlert("กรุณาใส่เลข job!", "danger", alertErr)}
              {rendenAlert(
                "คุณได้ร้องขอ die สำหรับ item นี้ไปแล้ว!",
                "danger",
                alertExistData
              )}
              {rendenAlert("เบิกสำเร็จ!", "success", alertSuccess)}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default DieRequest;
