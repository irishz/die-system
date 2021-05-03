import { Switch } from "@material-ui/core";
import axios from "axios";
import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  ButtonGroup,
  ToggleButton,
  Alert,
  Accordion,
  Toast,
  Modal,
  Spinner,
} from "react-bootstrap";
import Location from "../Location/Location";
import { useRef } from "react";
import { HiChevronDoubleDown, HiChevronDoubleUp } from "react-icons/hi";
import { RiRefreshLine } from "react-icons/ri";
import { IoInformationCircle } from "react-icons/io5";
import "../IssueDie/IssueDie.css";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

function IssueDie() {
  const userTokenData = JSON.parse(localStorage.getItem("userToken"));
  const [dieList, setdieList] = useState([]);
  const [prevDieList, setprevDieList] = useState([]);
  const [activeDieStatus, setactiveDieStatus] = useState("กำลังรอ die");
  const itemRef = useRef(null);
  const locdieRef = useRef(null);
  const [scanItem, setscanItem] = useState("");
  const [scanLocDie, setscanLocDie] = useState("");
  const [Item, setItem] = useState("");
  const [LocDie, setLocDie] = useState("");
  const [job, setjob] = useState("");
  const [issueBtn, setissueBtn] = useState(true);
  const [activeAcdnKey, setactiveAcdnKey] = useState("0");
  const [activeRow, setactiveRow] = useState(null);
  const [toastNewItem, settoastNewItem] = useState(null);
  const [istoastVisible, setistoastVisible] = useState(false);
  const [toastTime, settoastTime] = useState(null);
  const [filterStatus, setfilterStatus] = useState(false);
  const [delId, setdelId] = useState("");
  const [isModalVisible, setisModalVisible] = useState(false);
  const [delProgress, setdelProgress] = useState(false);

  const [itemErr, setitemErr] = useState(false);
  const initCheckDie = {
    wood: [
      { name: "แตก", checked: false },
      { name: "ยุบ", checked: false },
      { name: "บิดเบี้ยว", checked: false },
      { name: "ร่องหลวม", checked: false },
      { name: "ไม้ลอก", checked: false },
      { name: "ร่องไม้แตก", checked: false },
    ],
    blade: [
      { name: "แตก", checked: false },
      { name: "บิ่น", checked: false },
      { name: "หาย", checked: false },
      { name: "กาวติด", checked: false },
      { name: "คต", checked: false },
      { name: "สนิม", checked: false },
    ],
  };
  const [checkDie, setcheckDie] = useState(initCheckDie);

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die-usage/")
      .then((res) => setprevDieList(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die-usage/")
      .then((res) => setdieList(res.data))
      .catch((err) => console.log(err));

    if (dieList.length > prevDieList.length) {
      settoastNewItem(dieList.length - prevDieList.length);
      setistoastVisible(true);
      settoastTime(moment());
    }

    if (istoastVisible) {
      settoastTime(moment());
    }
    console.log(moment("2021-04-28T01:36:44.000Z").diff(moment()));
  }, [dieList, istoastVisible, prevDieList.length]);

  function handleFilterDie(e) {
    // console.log(scanItem, scanLocDie);
    if (e.charCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      axios
        .get(
          "http://192.168.2.13/api/checkitemlocdie/" +
            scanItem +
            "/" +
            scanLocDie
        )
        .then((res) => {
          setItem(res.data[0].item);
          setLocDie(res.data[0].Uf_Loc_die);
          setissueBtn(false);
        })
        .catch((err) => {
          setitemErr(true);
          setTimeout(() => {
            setitemErr(false);
          }, 2000);
          setissueBtn(true);
          setscanItem("");
          setscanLocDie("");
        });
    }
  }

  function getDieId() {
    let dieId = null;
    let list = dieList.filter((die) => die.item === scanItem);
    dieId = list[0]._id;

    return dieId;
  }

  function onActiveDieChange(e) {
    setactiveDieStatus(e);
    setactiveRow(null);
  }

  function handleIssueDie() {
    let dieId = getDieId();

    // console.log(dieId);
    if (dieId) {
      axios
        .put("http://192.168.2.13:4002/die-usage/update/" + dieId, {
          status: "จ่ายแล้ว",
          issuedBy: userTokenData[0],
          issuedAt: moment(),
        })
        .then(() => {
          setItem("");
          setLocDie("");
          setjob("");
          setissueBtn(true);
          itemRef.current.value = "";
          locdieRef.current.value = "";
        })
        .catch((err) => console.log(err));
    }
  }

  function handleRecieve() {
    let dieId = getDieId();

    if (dieId) {
      axios
        .put("http://192.168.2.13:4002/die-usage/update/" + dieId, {
          status: "รับคืนแล้ว",
          recievedBy: userTokenData[0],
          recievedAt: moment(),
          checkDie: checkDie,
        })
        .then(() => {
          setItem("");
          setLocDie("");
          setissueBtn(true);
          setjob("");
          itemRef.current.value = "";
          locdieRef.current.value = "";
          setcheckDie(initCheckDie);
        })
        .catch((err) => console.log(err));
    }
  }

  function onSwitchChange(idx, type) {
    let tempDie = checkDie;
    if (type === "wood") {
      tempDie.wood[idx].checked = !tempDie.wood[idx].checked;
    } else {
      tempDie.blade[idx].checked = !tempDie.blade[idx].checked;
    }
    setcheckDie(tempDie);
  }

  function handleClickJob(job, idx) {
    // console.log(job, idx);
    setjob(job);
    setactiveRow(idx);
  }

  function toggleAccordion() {
    if (activeAcdnKey === "1") {
      setactiveAcdnKey("0");
    } else {
      setactiveAcdnKey("1");
    }
  }

  function handleToastClose() {
    setprevDieList(dieList);
    setistoastVisible(false);
    settoastTime(null);
  }

  function handleDeleteClick(id) {
    setdelId(id);
    setisModalVisible(true);
  }

  function onDelete() {
    setdelProgress(true);

    axios
      .delete("http://192.168.2.13:4002/die-usage/delete/" + delId)
      .then(() => {
        setdelId("");
        setisModalVisible(false);
        setdelProgress(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <Container>
      <Row
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <ButtonGroup toggle>
            {["ทั้งหมด", "กำลังรอ die"].map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                name={radio}
                variant="info"
                value={radio}
                checked={radio === activeDieStatus}
                onChange={(e) => onActiveDieChange(e.currentTarget.value)}
              >
                {radio}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
        <Button variant="primary" onClick={() => window.location.reload(false)}>
          <RiRefreshLine /> Refresh
        </Button>
      </Row>

      <Table striped bordered size="sm" style={{ border: "1px solid #aaaaaa" }}>
        <thead>
          <tr style={{ alignItems: "center" }}>
            <th>#</th>
            <th>Job</th>
            <th>Part</th>
            <th>Loc Die</th>
            <th>M/C</th>
            <th>Duration</th>
            <th onClick={() => setfilterStatus(!filterStatus)}>
              Status {filterStatus ? <BsArrowDown /> : <BsArrowUp />}
            </th>
          </tr>
        </thead>
        <tbody>
          {activeDieStatus === "ทั้งหมด"
            ? dieList
                .filter((die) => moment(die.createdAt).diff(moment(), "days") >= 0)
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
                .sort((a, b) => (a.mcno > b.mcno ? 1 : -1))
                .map((die, idx) => (
                  <tr
                    key={idx}
                    style={
                      die.status === "กำลังรอ die"
                        ? styles.waitDie
                        : styles.issueDie
                    }
                    onClick={() => handleClickJob(die.job, idx)}
                    className={idx === activeRow ? "activeRow" : "inactiveRow"}
                  >
                    <td>{idx + 1}</td>
                    <td>{die.job}</td>
                    <td>{die.item}</td>
                    <td>{die.locdie}</td>
                    <td>{die.mcno}</td>
                    <td>
                      <strong>
                        {moment(die.createdAt).startOf().fromNow()}
                      </strong>
                    </td>
                    <td>{die.status}</td>
                    <td
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0,
                      }}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(die._id)}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))
            : dieList
                .filter((die) => die.status === activeDieStatus && moment(die.createdAt).diff(moment(), "days") >= 0)
                .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
                .sort((a, b) => (a.mcno > b.mcno ? 1 : -1))
                .map((die, idx) => (
                  <tr
                    key={idx}
                    style={
                      die.status === "กำลังรอ die"
                        ? styles.waitDie
                        : styles.issueDie
                    }
                    onClick={() => handleClickJob(die.job, idx)}
                    className={idx === activeRow ? "activeRow" : "inactiveRow"}
                  >
                    <td>{idx + 1}</td>
                    <td>{die.job}</td>
                    <td>{die.item}</td>
                    <td>{die.locdie}</td>
                    <td>{die.mcno}</td>
                    <td>
                      <strong>
                        {moment(die.createdAt).startOf().fromNow()}
                      </strong>
                    </td>
                    <td style={styles.rowStatus}>{die.status}</td>
                    <td
                      style={{
                        backgroundColor: "white",
                        borderWidth: 0,
                      }}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(die._id)}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
        </tbody>
      </Table>

      <Accordion defaultActiveKey="0" activeKey={activeAcdnKey}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={toggleAccordion}
          >
            {activeAcdnKey === "0" ? "Hide Layout " : "Show Layout "}
            {activeAcdnKey === "0" ? (
              <HiChevronDoubleUp />
            ) : (
              <HiChevronDoubleDown />
            )}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Location job={job} />
              <Row
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 15,
                }}
              >
                <Col lg={4}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => {
                      itemRef.current.scrollIntoView();
                      itemRef.current.focus();
                    }}
                  >
                    เบิกไปผลิต
                  </Button>
                </Col>
                <Col lg={4}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => locdieRef.current.scrollIntoView()}
                  >
                    เก็บเข้าช่อง
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Row style={styles.section1}>
        <Col>
          <h4>Part No.</h4>
        </Col>
        <Col>
          <h4>Location Die</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control
            ref={itemRef}
            placeholder="Part No."
            autoFocus={true}
            onChange={(e) => setscanItem(e.target.value)}
          ></Form.Control>
        </Col>
        <Col>
          <Form.Control
            ref={locdieRef}
            placeholder="Loc Die"
            onChange={(e) => setscanLocDie(e.target.value)}
            onKeyPress={(e) => handleFilterDie(e)}
            onKeyDown={(e) => handleFilterDie(e)}
          ></Form.Control>
        </Col>
      </Row>

      <Row style={styles.section1}>
        <Col>
          <label>ในระบบ</label>
          <Form.Control readOnly={true} value={Item}></Form.Control>
        </Col>
        <Col>
          <label> </label>
          <Form.Control readOnly={true} value={LocDie}></Form.Control>
        </Col>
      </Row>

      <Row style={{ marginTop: 15 }}>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>จ่าย Die</Card.Title>
            </Card.Header>
            <Card.Body>
              <Button
                style={{ width: "100%" }}
                onClick={handleIssueDie}
                disabled={issueBtn}
                variant={issueBtn ? "secondary" : "primary"}
              >
                เบิกไปผลิต
              </Button>
              {itemErr ? (
                <Alert variant="danger">ข้อมูลไม่ตรงกับในระบบ</Alert>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>เก็บ Die</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Card>
                    <Card.Header>ตรวจสอบไม้</Card.Header>
                    <Card.Body>
                      {checkDie.wood.map((wood, idx) => (
                        <Row key={idx}>
                          <Col>{wood.name}</Col>
                          <Col>
                            <Switch
                              checked={checkDie.wood.checked}
                              onChange={() => onSwitchChange(idx, "wood")}
                            ></Switch>
                          </Col>
                        </Row>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>ตรวจสอบมีด</Card.Header>
                    <Card.Body>
                      {checkDie.blade.map((blade, idx) => (
                        <Row key={idx}>
                          <Col>{blade.name}</Col>
                          <Col>
                            <Switch
                              checked={checkDie.blade.checked}
                              onChange={() => onSwitchChange(idx, "blade")}
                            ></Switch>
                          </Col>
                        </Row>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Button
                variant={issueBtn ? "secondary" : "primary"}
                style={{ width: "100%" }}
                disabled={issueBtn}
                onClick={handleRecieve}
              >
                เก็บเข้าช่อง
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toast
        style={styles.notiToast}
        show={istoastVisible}
        delay={3000}
        onClose={() => handleToastClose()}
        animation={true}
      >
        <Toast.Header>
          <IoInformationCircle size={16} color="red" />
          <strong className="mr-auto">คำร้องใหม่!</strong>
          <small>{moment().startOf().fromNow()}</small>
        </Toast.Header>
        <Toast.Body>
          คุณมี <strong>{toastNewItem}</strong> คำร้องใหม่ที่ยังไม่ได้จ่าย
        </Toast.Body>
      </Toast>

      <Modal show={isModalVisible}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบรายการ</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>คุณต้องการลบ</p>
          <strong>Job : {dieList.length > 0 ? dieList[0].job : null}</strong>
          <br />
          <strong>Item : {dieList.length > 0 ? dieList[0].item : null}</strong>
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
    </Container>
  );
}

export default IssueDie;

const styles = {
  section1: {
    marginTop: 15,
    paddingTop: 10,
    borderWidth: 1,
  },
  waitDie: {
    backgroundColor: "#FEDF7F",
    justifyContent: "center",
  },
  issueDie: {
    backgroundColor: "#54E0B7",
    justifyContent: "center",
  },
  notiToast: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  rowStatus: {
    display: "flex",
    justifyContent: "space-between",
  },
};
