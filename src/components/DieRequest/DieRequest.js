import axios from "axios";
import { BeatLoader } from "halogenium";
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
  Form,
  Modal,
  Row,
  Spinner,
  Table,
  Toast,
} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";
import "./DieRequest.css";

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
  const [isLoading, setisLoading] = useState(true);
  const [isEdit, setisEdit] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [delId, setdelId] = useState("");
  const [deleteList, setdeleteList] = useState([]);
  const [delProgress, setdelProgress] = useState(false);
  const [locdieFound, setlocdieFound] = useState(false);

  useLayoutEffect(() => {
    if (userTokenData) {
      axios.get("http://192.168.2.13:4002/die-usage/no-received").then((res) => {
        setdieList(res.data);
        setisLoading(false);
      });
      //   .catch((err) => console.log(err));
    }
  }, [userTokenData]);

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
          } else {
            setitem(res.data.item);
          }

          if (res.data.Uf_Loc_die) {
            setlocdie(res.data.Uf_Loc_die);
            setlocdieFound(false);
          } else {
            setlocdie(res.data.Uf_Loc_die);
            setlocdieFound(true);
          }
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
      receivedBy: null,
      receivedAt: null,
      checkDie: null,
    };
    // console.log(obj);

    if (
      dieList.filter((die) => die.item === item && (die.status === "กำลังรอ die" || die.status === "จ่ายแล้ว"))
        .length > 0
    ) {
      setalertExistData(true);
      setTimeout(() => {
        setalertExistData(false);
      }, 3000);
    } else {
      axios
        .post("http://192.168.2.13:4002/die-usage/create", obj)
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

  function handleDeleteClick(id) {
    setisModalVisible(true);
    setdelId(id);

    let delList = dieList.filter((die) => die._id === id);
    // console.log(delList[0]);
    setdeleteList(delList);
  }

  function onDelete() {
    setdelProgress(true);
    // console.log(deleteList);
    axios
      .delete("http://192.168.2.13:4002/die-usage/delete/" + delId)
      .then(() => {
        setdelProgress(false);
        setdeleteList([]);
        setisModalVisible(false);
      });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <div>
        <Row>
          {/* Table Section */}
          <Col>
            {isEdit ? (
              <Button variant="success" onClick={() => setisEdit(!isEdit)}>
                สำเร็จ <FaCheck />
              </Button>
            ) : (
              <Button variant="outline-dark" onClick={() => setisEdit(!isEdit)}>
                แก้ไข <AiFillEdit />
              </Button>
            )}
            <Table striped bordered hover size="sm" variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job</th>
                  <th>Part No.</th>
                  <th>Loc Die</th>
                  <th>M/C</th>
                  <th>วันที่ / เวลา</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <BeatLoader color="#26A65B" margin="4px" size="16px" />
                ) : (
                  dieList
                    .filter(
                      (die) =>
                        moment(die.createdAt).diff(moment(), "days") >= 0 &&
                        die.status === "กำลังรอ die" &&
                        die.mcno === userTokenData[3]
                    )
                    .map((die, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{die.job}</td>
                        <td>{die.item}</td>
                        <td>{die.locdie}</td>
                        <td>{die.mcno}</td>
                        <td>{moment(die.createdAt).format("LLL")}</td>
                        <td>{die.status}</td>
                        {isEdit ? (
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(die._id)}
                            >
                              X
                            </Button>
                          </td>
                        ) : null}
                      </tr>
                    ))
                )}
              </tbody>
            </Table>
          </Col>

          {/* Form Section */}
          <Col lg={5} style={styles.scanSection}>
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
              <Col>
                <h5>สแกนหมายเลข Job</h5>
              </Col>
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
              <Col>
                <h5>Part No.</h5>
              </Col>
              <Col>
                <h5>Location Die</h5>
              </Col>
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
                  "item นี้ มีการเบิกไปแล้ว!",
                  "danger",
                  alertExistData
                )}
                {rendenAlert("เบิกสำเร็จ!", "success", alertSuccess)}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div style={styles.toastLocdie}>
        <Toast
          show={locdieFound}
          onClose={() => setlocdieFound(false)}
          animation={true}
        >
          <Toast.Header
            style={{ backgroundColor: "#EB3C37", paddingRight: 20 }}
          >
            <strong
              className="mr-auto"
              style={{ color: "white", fontSize: 20 }}
            >
              <IoInformationCircleSharp /> ไม่พบ Location Die!
            </strong>
          </Toast.Header>
        </Toast>
      </div>

      <Modal show={isModalVisible}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบรายการ</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>คุณต้องการลบ</p>
          <strong>
            Job : {deleteList.length > 0 ? deleteList[0].job : null}
          </strong>
          <br />
          <strong>
            Item : {deleteList.length > 0 ? deleteList[0].item : null}
          </strong>
          <br />
          ใช่หรือไม่?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => onDelete()}>
            {delProgress ? (
              <Spinner as="span" animation="border" role="status" size="sm" />
            ) : (
              "ยืนยัน"
            )}
          </Button>
          <Button variant="secondary" onClick={() => setisModalVisible(false)}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DieRequest;

const styles = {
  scanSection: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  toastLocdie: {
    alignSelf: "center",
    position: "fixed",
    bottom: 0,
    marginBottom: 15,
    alignContent: "center",
  },
};
