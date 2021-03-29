import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import UserData from "../user.json";

function Login() {
  const userData = UserData;
  const [isLogin, setisLogin] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [position, setposition] = useState("ร้องขอ Die");
  const [shift, setshift] = useState("กะกลางวัน");
  const [machList, setmachList] = useState([]);
  const [machNo, setmachNo] = useState("CON1");
  const [passwordErr, setpasswordErr] = useState(false);

  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4001/machine")
      .then((res) => setmachList(res.data))
      .catch((err) => console.log(err));
  }, [machList]);

  async function onSignIn() {
    //   check password
    await validatePassword();
    await signIn();
  }

  function validatePassword() {
    const list = userData.filter((user) => user.name === username);
    const intPassword = parseInt(password);
    console.log(list[0].password, intPassword);
    if (list[0].password !== intPassword) {
      setpasswordErr(true);
      setTimeout(() => {
        setpasswordErr(false);
      }, 2000);
      setisLogin(true);
    } else {
      let role;
      if (position === "ร้องขอ Die") {
        role = 0;
      } else {
        role = 1;
      }
      localStorage.setItem(
        "userToken",
        JSON.stringify([list[0].name, position, shift, machNo, role])
      );
    }
  }

  return (
    <div className="container">
      <Card>
        <Card.Header style={{ display: "flex", justifyContent: "center" }}>
          Die System
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="Username">
              <Form.Label>ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                as="select"
                onChange={(e) => setusername(e.target.value)}
                required
              >
                <option></option>
                {userData
                  .sort((a, b) => (a.id > b.id ? 1 : -1))
                  .map((user, idx) => (
                    <option key={idx}>{user.name}</option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="Password">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={(e) => setpassword(e.target.value)}
              />
            </Form.Group>
            <Form.Row>
              <Form.Group controlId="่Position" as={Col}>
                <Form.Label>ประเภทการเข้าใช้</Form.Label>
                <Form.Control
                  type="text"
                  as="select"
                  onChange={(e) => setposition(e.target.value)}
                >
                  <option>ร้องขอ Die</option>
                  <option>จ่าย Die</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="Shift" as={Col}>
                <Form.Label>ช่วงเวลาทำงาน</Form.Label>
                <Form.Control
                  type="text"
                  as="select"
                  onChange={(e) => setshift(e.target.value)}
                >
                  <option>กะกลางวัน</option>
                  <option>กะกลางคืน</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="Machine" as={Col}>
                <Form.Label>หมายเลขเครื่องจักร</Form.Label>
                <Form.Control
                  type="text"
                  as="select"
                  onChange={(e) => setmachNo(e.target.value)}
                >
                  {machList
                    .sort((a, b) => (a.McNo > b.McNo ? 1 : -1))
                    .map((mach, idx) => (
                      <option key={idx}>{mach.McNo}</option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Button
              onClick={onSignIn}
              disabled={username.length < 1 ? true : false}
            >
              เข้าสู่ระบบ
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {passwordErr ? <Alert variant="danger">รหัสผ่านไม่ถูกต้อง!</Alert> : null}
    </div>
  );
}

export default Login;
