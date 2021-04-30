import { Container } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { useHistory, useParams } from "react-router";

function EditUser() {
  let { id } = useParams();
  let history = useHistory();
  const [firstnameInput, setfirstnameInput] = useState("");
  const [lastnameInput, setlastnameInput] = useState("");
  const [deptInput, setdeptInput] = useState("");
  const [passwordInput, setpasswordInput] = useState("");
  const [alertEditSuccess, setalertEditSuccess] = useState(false);
  const [userList, setuserList] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4002/user/edit/" + id)
      .then((res) => {
        setuserList(res.data);
        setfirstnameInput(res.data.name.split(" ")[0]);
        setlastnameInput(res.data.name.split(" ")[1]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleSubmit() {
    console.log(userList);
    let tempPass = passwordInput
    let tempDept = deptInput
    if (tempPass.length <= 0) {
      tempPass = userList.password;
    }
    if (deptInput.length <= 0) {
      tempDept = userList.department
    }
    console.log("temp:" + tempPass + tempDept);
    let obj = {
      id: userList.id,
      name: firstnameInput + " " + lastnameInput,
      password: tempPass,
      dept: deptInput,
      username: firstnameInput + " " + lastnameInput,
    };

    axios.put("http://192.168.2.13:4002/user/update/" + id, obj).then(() => {
      setalertEditSuccess(true);
      setTimeout(() => {
        setalertEditSuccess(false);
      }, 3000);
      setfirstnameInput("");
      setlastnameInput("");
      setdeptInput("");
      setpasswordInput("");
    });
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaUserEdit /> แก้ไขผู้ใช้
        </h1>
      </Row>

      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            id
          </Form.Label>
          <Col sm="3">
            <Form.Control type="text" readOnly defaultValue={userList.id} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            ชื่อ-นามกสุล
          </Form.Label>
          <Col sm="4">
            <Form.Control
              type="text"
              defaultValue={firstnameInput}
              onChange={(e) => setfirstnameInput(e.target.value)}
            />
          </Col>
          <Col sm="4">
            <Form.Control
              type="text"
              defaultValue={lastnameInput}
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
              defaultValue={userList.dept}
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
              defaultValue={userList.password}
              onChange={(e) => setpasswordInput(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>

      <Row>
        <Button variant="primary" onClick={() => handleSubmit()}>
          บันทึก
        </Button>
        <Button variant="danger" onClick={() => history.goBack()}>
          ย้อนกลับ
        </Button>
      </Row>

      <Alert show={alertEditSuccess} variant="success">
        บันทึกข้อมูลสำเร็จ!
      </Alert>
    </Container>
  );
}

export default EditUser;

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
