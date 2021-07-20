import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { BiHistory } from "react-icons/bi";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import DieTrans from "./DieTrans";
import moment from "moment";

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
        setdieList(res.data);
        setitemInput(res.data.item);
        setlocdieInput(res.data.locdie);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleUpdate() {
    let obj = {
      item: dieList.item,
      locdie: locdieInput,
    };
    console.log(obj);

    updateDieTransTrigger(obj);
  }

  async function updateDieTransTrigger(dieObj) {
    // When update die will create die transaction
    await axios
      .put("http://192.168.2.13:4002/die/update/" + id, dieObj)
      .then(() => {
        setalertUpdateSuccess(true);
        setTimeout(() => {
          setalertUpdateSuccess(false);
        }, 3000);
      })
      .catch((err) => console.log(err));

    let transObj = {
      item: itemInput,
      locdie: locdieInput,
      trans_type: "Move",
      trans_date: moment().format(),
    };
    await axios.post("http://192.168.2.13:4002/die-trans/create", transObj);
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={styles.textTitle}>
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

      <Row style={styles.EndEditSection}>
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

      <Row style={styles.Header}>
        <h4 style={{ color: "#505050" }}>
          <BiHistory /> ประวัติการแก้ไข
        </h4>
      </Row>
      <DieTrans item={itemInput} />
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
  textTitle: {
    color: "#505050",
  },
  EndEditSection: {
    marginBottom: "20px",
  },
};
