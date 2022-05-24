import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { useHistory } from "react-router";

function CreateUser() {
  let history = useHistory();
  const [userList, setuserList] = useState([]);
  const [employeeInput, setemployeeInput] = useState("");
  const [firstnameInput, setfirstnameInput] = useState("");
  const [lastnameInput, setlastnameInput] = useState("");
  const [deptInput, setdeptInput] = useState("");
  const [passwordInput, setpasswordInput] = useState("");
  const [confirmpswdInput, setconfirmpswdInput] = useState("");
  const [alertPswdNotMatch, setalertPswdNotMatch] = useState(false);
  const [lastUserID, setlastUserID] = useState(0);
  const [alertCreateSuccess, setalertCreateSuccess] = useState(false);

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13:4002/user")
      .then((res) => {
        setuserList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4002/user")
      .then((res) => {
        let list = res.data
        let last_id = list.sort((a,b) => a.id < b.id ? 1 : -1)
          last_id = list[0].id
        setlastUserID(last_id)
      })
      .catch((err) => console.log(err));
  }, [userList])


  function handleSubmit() {
    if (passwordInput !== confirmpswdInput) {
      userCreate(false);
    } else {
      userCreate(true);
    }
  }

  function userCreate(match) {
    let obj = {
      id: lastUserID + 1,
      name: firstnameInput + " " + lastnameInput,
      dept: deptInput,
      username: firstnameInput + " " + lastnameInput,
      password: passwordInput,
      accesslevel: 0,
    };

    if (match === true) {
      //   console.log("user created!");
      axios
        .post("http://192.168.2.13:4002/user/create", obj)
        .then(() => {
          setalertCreateSuccess(true);
          setTimeout(() => {
            setalertCreateSuccess(false);
          }, 3000);
          setuserList([])
          setemployeeInput("");
          setfirstnameInput("");
          setlastnameInput("");
          setdeptInput("");
          setpasswordInput("");
          setconfirmpswdInput("");
        })
        .catch((err) => console.log(err));
    } else {
      setalertPswdNotMatch(true);
    }
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaUserPlus /> เพิ่มผู้ใช้
        </h1>
      </Row>

      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            id
          </Form.Label>
          <Col sm="3">
            <Form.Control type="text" readOnly value={lastUserID} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            รหัสพนักงาน
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              maxLength={7}
              onChange={(e) => setemployeeInput(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            ชื่อ-นามกสุล
          </Form.Label>
          <Col sm="4">
            <Form.Control
              type="text"
              onChange={(e) => setfirstnameInput(e.target.value)}
            />
          </Col>
          <Col sm="4">
            <Form.Control
              type="text"
              onChange={(e) => setlastnameInput(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            แผนก
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              onChange={(e) => setdeptInput(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            รหัสผ่าน
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              onChange={(e) => setpasswordInput(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            ยืนยันรหัสผ่าน
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              onChange={(e) => setconfirmpswdInput(e.target.value)}
            />
            {alertPswdNotMatch ? (
              <Form.Label style={{ fontSize: 14, color: "red" }}>
                *รหัสผ่านไม่ตรงกัน
              </Form.Label>
            ) : null}
          </Col>
        </Form.Group>
      </Form>

      <Row>
        <Button variant="primary" onClick={() => handleSubmit()}>
          เพิ่มผู้ใช้
        </Button>
        <Button variant="danger" onClick={() => history.goBack()}>
          ย้อนกลับ
        </Button>
      </Row>

      <Alert show={alertCreateSuccess} variant="success">
        สร้างผู้ใช้สำเร็จ!
      </Alert>
    </Container>
  );
}

export default CreateUser;

const styles = {
  Header: {
    borderBottom: "1px solid #505050",
    marginBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
  },
};
