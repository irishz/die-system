import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Col,
  Row,
  Table,
  Button,
  Alert,
  Modal,
  Card,
} from "react-bootstrap";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { BeatLoader } from "halogenium";
import { Link } from "react-router-dom";

function User() {
  const [userList, setuserList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [alertDeleteSuccess, setalertDeleteSuccess] = useState(false);
  const [alertDeleteErr, setalertDeleteErr] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [delId, setdelId] = useState(null);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4001/user")
      .then((res) => {
        setisLoading(false);
        setuserList(res.data);
      })
      .catch((err) => console.log(err));
  }, [userList]);

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

  function deleteUser() {
    axios
      .delete("http://192.168.2.13:4001/user/delete/" + delId)
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
  }

  return (
    <Container>
      <Row style={styles.Header}>
        <h1 style={{ color: "#505050" }}>
          <FaUserEdit /> จัดการผู้ใช้
        </h1>
        <Button variant="success" style={{ margin: 10 }} href="/user-create">
          <FaUserPlus /> เพิ่มผู้ใช้
        </Button>
      </Row>
      {isLoading ? (
        <BeatLoader color="#26A65B" margin="4px" size="16px" />
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>id</th>
              <th>ชื่อ-นามสกุล</th>
              <th>แผนก</th>
              <th>ชื่อผู้ใช้</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map((user, idx) => (
                <tr key={idx}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.dept}</td>
                  <td>{user.username}</td>
                  <td>
                    <Button variant="primary" href={"/user-edit/" + user._id}>
                      แก้ไข
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <Modal show={isModalVisible}>
        <Modal.Header closeButton>ยืนยันการลบผู้ใช้</Modal.Header>
        <Modal.Body>คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteUser()}>
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

export default User;

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
