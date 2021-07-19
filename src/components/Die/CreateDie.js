import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { useHistory } from "react-router";

function CreateDie() {
  const history = useHistory();
  const [itemInput, setitemInput] = useState("");
  const [dieList, setdieList] = useState([]);
  const [locdieInput, setlocdieInput] = useState("");
  const [alertItemExist, setalertItemExist] = useState(false);
  const [alertCreateSuccess, setalertCreateSuccess] = useState(false);

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die")
      .then((res) => setdieList(res.data))
      .catch((err) => console.log(err));
  }, []);

  function handleSubmit() {
    console.log(itemInput, locdieInput);
    let tmpList = dieList.filter((die) => die.item === itemInput);

    if (tmpList.length > 0) {
      setalertItemExist(true);
      setTimeout(() => {
        setalertItemExist(false);
      }, 3000);
    } else {
      let obj = { item: itemInput, locdie: locdieInput };

      axios.post("http://192.168.2.13:4002/die/create", obj).then(() => {
        setalertCreateSuccess(true);
        setTimeout(() => {
          setalertCreateSuccess(false);
        }, 3000);
        setitemInput("");
        setlocdieInput("");
      });
    }
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaPlusCircle /> เพิ่ม Die
        </h1>
      </Row>

      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            item
          </Form.Label>
          <Col sm="5">
            <Form.Control
              type="text"
              onChange={(e) => setitemInput(e.target.value)}
              value={itemInput}
              autoFocus
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Location Die
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="text"
              onChange={(e) => setlocdieInput(e.target.value.toUpperCase())}
              value={locdieInput}
            />
          </Col>
        </Form.Group>
      </Form>

      <Row>
        <Button variant="primary" onClick={() => handleSubmit()}>
          เพิ่ม
        </Button>
        <Button variant="danger" onClick={() => history.goBack()}>
          ย้อนกลับ
        </Button>
      </Row>

      <Alert show={alertItemExist} variant="danger" style={styles.alert}>
        item นี้มีในระบบอยู่แล้ว! กรุณาตรวจสอบเลข item อีกครั้ง
      </Alert>
      <Alert show={alertCreateSuccess} variant="success" style={styles.alert}>
        สร้าง Die สำเร็จ
      </Alert>
    </Container>
  );
}

export default CreateDie;

const styles = {
  Header: {
    borderBottom: "1px solid #505050",
    marginBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
  },
  alert: {
    position: "fixed",
    width: "50%",
    marginTop: 20,
  },
};
