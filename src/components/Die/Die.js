import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { BeatLoader } from "halogenium";
import moment from "moment";

function Die() {
  const [dieList, setdieList] = useState([]);
  const [delList, setdelList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [alertDeleteSuccess, setalertDeleteSuccess] = useState(false);
  const [alertDeleteErr, setalertDeleteErr] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [delId, setdelId] = useState(null);
  const [itemInput, setitemInput] = useState("");
  const [activePage, setactivePage] = useState(1);
  const [currPage, setcurrPage] = useState(1);
  const [skip, setskip] = useState(0);
  const [rowPerPage, setrowPerPage] = useState(10);
  const [totalPage, settotalPage] = useState(5);

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13:4002/die/die-page/" + skip + "/" + rowPerPage)
      .then((res) => {
        setisLoading(false);
        setdieList(res.data);
        settotalPage(Math.floor(res.data.length / rowPerPage));
      })
      .catch((err) => console.log(err));
  }, [rowPerPage, skip, dieList]);

  function handleDeleteClick(id) {
    // console.log("delete id:" + id);
    setisModalVisible(true);
    setdelId(id);
  }

  function renderAlert(show, type, message) {
    return (
      <Alert show={show} variant={type}>
        {message}
      </Alert>
    );
  }

  async function deleteDie() {
    await axios
      .delete("http://192.168.2.13:4002/die/delete/" + delId)
      .then(() => {
        setalertDeleteSuccess(true);
        setTimeout(() => {
          setalertDeleteSuccess(false);
        }, 3000);
        setisModalVisible(false);
        setdelId(null);
      })
      .catch(() => {
        setalertDeleteErr(true);
        setTimeout(() => {
          setalertDeleteErr(false);
        }, 3000);
      });

    await axios
      .get("http://192.168.2.13:4002/die/edit/" + delId)
      .then((res) => setdelList(res.data))
      .catch((err) => console.log(err));

    let transObj = {
      item: delList.item,
      locdie: delList.locdie,
      trans_type: "Out",
      trans_date: moment().format(),
    };
    await axios.post("http://192.168.2.13:4002/die-trans/create", transObj);
  }

  function handlePageFirstClick() {
    setcurrPage(1);
    setactivePage(1);
    setskip(1 * rowPerPage - rowPerPage);
  }

  function handlePagePrevClick() {
    let pageNo = currPage - 1;
    setcurrPage(currPage - 1);
    setactivePage(pageNo);
    setskip(skip - rowPerPage);
  }

  function handlePageChange(e) {
    let pageNo = parseInt(e);
    setcurrPage(pageNo);
    setactivePage(pageNo);
    setskip((pageNo - 1) * rowPerPage);
  }

  function handlePageNextClick() {
    let pageNo = currPage + 1;
    setcurrPage(currPage + 1);
    setactivePage(pageNo);
    setskip(skip + rowPerPage);
  }

  function handlePageLastClick() {
    // console.log(totalPage);
    let tmpTotalPage = Math.floor(
      dieList.filter((die) => die.item.indexOf(itemInput) >= 0).length /
        rowPerPage
    );
    setcurrPage(tmpTotalPage);
    setactivePage(tmpTotalPage);
    setskip(tmpTotalPage * rowPerPage);
  }

  function handleInputChange(e) {
    setitemInput(e);
    settotalPage(
      Math.floor(
        dieList.filter((die) => die.item.indexOf(itemInput) >= 0).length /
          rowPerPage
      )
    );
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaEdit /> จัดการ Die
        </h1>
        <div>
          <Button variant="success" style={{ margin: 10 }} href="/die-create">
            <FaPlusCircle /> เพิ่ม Die
          </Button>
        </div>
      </Row>

      <Form.Group>
        <Row>
          <Col lg={2}>
            <label>ค้นหา Item: </label>
          </Col>
          <Col lg={4}>
            <Form.Control
              type="text"
              autoFocus
              onChange={(e) => handleInputChange(e.target.value)}
              value={itemInput}
            ></Form.Control>
          </Col>
        </Row>
      </Form.Group>

      {isLoading ? (
        <BeatLoader color="#26A65B" margin="4px" size="16px" />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>LocDie</th>
              <th>วันที่สร้าง</th>
              <th>วันที่อัพเดท</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dieList
              .filter((die) => die.item.indexOf(itemInput) >= 0)
              .slice(skip, skip + rowPerPage)
              .sort((a, b) => (a.locdie > b.locdie ? 1 : -1))
              .map((die, idx) => (
                <tr key={idx}>
                  <td>{skip + idx + 1}</td>
                  <td>{die.item}</td>
                  <td>{die.locdie}</td>
                  <td>{moment(die.createdAt).format("DD/MM/yyyy hh:mm")}</td>
                  <td>{moment(die.updatedAt).format("DD/MM/yyyy hh:mm")}</td>
                  <td>
                    <Button variant="primary" href={"/die-edit/" + die._id}>
                      แก้ไข
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(die._id)}
                    >
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <Row>
        <Col>
          <Pagination style={{ justifyContent: "center" }}>
            <Pagination.First
              disabled={currPage === 1 ? true : false}
              onClick={() => handlePageFirstClick()}
            />
            <Pagination.Prev
              disabled={currPage === 1 ? true : false}
              onClick={() => handlePagePrevClick()}
            />

            {currPage >= 3 ? (
              <Pagination.Item onClick={(e) => handlePageChange(e.target.text)}>
                {currPage - 2}
              </Pagination.Item>
            ) : null}
            {currPage >= 2 ? (
              <Pagination.Item onClick={(e) => handlePageChange(e.target.text)}>
                {currPage - 1}
              </Pagination.Item>
            ) : null}
            <Pagination.Item active={activePage === currPage ? true : false}>
              {currPage}
            </Pagination.Item>

            {currPage === totalPage ? null : (
              <Pagination.Item onClick={(e) => handlePageChange(e.target.text)}>
                {currPage + 1}
              </Pagination.Item>
            )}
            {currPage === totalPage || currPage + 1 === totalPage ? null : (
              <Pagination.Item onClick={(e) => handlePageChange(e.target.text)}>
                {currPage + 2}
              </Pagination.Item>
            )}

            <Pagination.Next
              disabled={currPage === totalPage ? true : false}
              onClick={() => handlePageNextClick()}
            />
            <Pagination.Last
              disabled={currPage === totalPage ? true : false}
              onClick={() => handlePageLastClick()}
            />
          </Pagination>
        </Col>

        <Col lg={3}>
          {skip +
            1 +
            "-" +
            (skip + rowPerPage) +
            " ของ " +
            dieList.filter((die) => die.item.indexOf(itemInput) >= 0).length}
        </Col>

        <Col lg={2}>
          <Form.Control
            as="select"
            onChange={(e) => setrowPerPage(parseInt(e.target.value))}
            defaultValue={10}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Control>
        </Col>
      </Row>

      <Modal show={isModalVisible}>
        <Modal.Header closeButton>ยืนยันการลบ die</Modal.Header>
        <Modal.Body>คุณต้องการลบ Die หมายเลขนี้ใช่หรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteDie()}>
            ยืนยัน
          </Button>
          <Button variant="secondary" onClick={() => setisModalVisible(false)}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      {renderAlert(alertDeleteSuccess, "success", "ลบข้อมูลสำเร็จ")}
      {renderAlert(
        alertDeleteErr,
        "danger",
        "เกิดข้อผิดพลาด กรุณาทำรายการใหม่อีกครั้ง!"
      )}
    </Container>
  );
}

export default Die;

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
