import { Modal } from "react-bootstrap";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

function ModalStatus(props) {
  return (
    <Modal show={props.show} animation={true} centered>
    {/* <Modal show={true} animation={true} centered> */}
      <Modal.Body>
        {props.type === "issued" ? (
          <div>
            <FaCheckCircle size={60} color="#26C251"/>
            <h5 id="modal-text" color="#26C251">จ่าย die สำเร็จ</h5>
          </div>
        ) : (
          <div>
            <FaCheckCircle size={60} color="#26C251"/>
            <h5 id="modal-text">เก็บ die สำเร็จ</h5>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ModalStatus;
