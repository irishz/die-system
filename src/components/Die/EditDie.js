import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { useHistory, useParams } from "react-router";
import axios from "axios";

function EditDie(props) {
  let { id } = useParams();
  const history = useHistory();
  const [dieList, setdieList] = useState([]);
  const [itemInput, setitemInput] = useState("");
  const [locdieInput, setlocdieInput] = useState("");
  const [alertUpdateSuccess, setalertUpdateSuccess] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die/edit/" + id)
      .then((res) => {
          console.log(res.data);
        // setdieList(res.data);
        // setitemInput(res.data[0].item);
        // setlocdieInput(res.data[0].locdie);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleUpdate() {
    console.log(dieList);
    let obj = dieList;
    obj.locdie = locdieInput;
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaUserEdit /> แก้ไข Die
        </h1>
      </Row>

      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            item
          </Form.Label>
          <Col sm="5">
            <Form.Control type="text" defaultValue={itemInput} readOnly />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Location Die
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="text"
              autoFocus
              onChange={(e) => setlocdieInput(e.target.value.toUpperCase())}
              value={locdieInput}
            />
          </Col>
        </Form.Group>
      </Form>

      <Row>
        <Button variant="primary" onClick={() => handleUpdate()}>
          บันทึก
        </Button>
        <Button variant="danger" onClick={() => history.goBack()}>
          ย้อนกลับ
        </Button>
      </Row>

      <Alert show={alertUpdateSuccess} variant="success" style={styles.alert}>
        บันทึกข้อมูลสำเร็จ
      </Alert>
    </Container>
  );
}

export default EditDie;

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
