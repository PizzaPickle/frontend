import React, { useState } from "react";
import { customerJoin } from "../../api/customerApi";
import "./join.css"; // 스타일 파일
import { useNavigate } from "react-router-dom";
import { pbJoin } from "../../api/PBApi";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default function JoinPage() {
  const [registerType, setRegisterType] = useState("customer");
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
    username: "",
    phoneNumber: "",
    email: "",
    branchOffice: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    username: "",
    email: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  // 회원가입 타입에 따라 formData 초기화
  const handleRegisterTypeChange = (type) => {
    setRegisterType(type);
    setFormData({
      userid: "",
      password: "",
      username: "",
      phoneNumber: "",
      email: "",
      branchOffice: "",
    });
    setErrors({
      password: "",
      username: "",
      email: "",
      phoneNumber: "",
    });
  };

  const handleClose = () => setShowModal(false); // 모달을 닫는 함수

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 입력 시 바로 유효성 검사 실행
    switch (name) {
      case "password":
        validatePassword(value);
        break;
      case "username":
        validateName(value);
        break;
      case "email":
        validateEmail(value);
        break;
      case "phoneNumber":
        validatePhoneNumber(value);
        break;
      default:
        break;
    }
  };

  // 유효성 검사 함수들
  const validatePassword = (password) => {
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: isValid
        ? ""
        : "비밀번호는 영문과 숫자를 조합해 8글자 이상이어야 합니다.",
    }));
  };

  const validateName = (name) => {
    const isValid = name.length >= 2 && name.length < 5;
    setErrors((prevErrors) => ({
      ...prevErrors,
      username: isValid ? "" : "이름은 2글자 이상 5글자 미만이어야 합니다.",
    }));
  };

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: isValid ? "" : "이메일 형식이 맞지 않습니다.",
    }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const isValid = /^010-\d{4}-\d{4}$/.test(phoneNumber);
    setErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: isValid ? "" : "전화번호는 010-1234-5678 형식이어야 합니다.",
    }));
  };

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handleRegister = async () => {
    // 모든 유효성 검사를 통과한 경우 회원가입 진행
    if (
      !errors.password &&
      !errors.username &&
      !errors.email &&
      !errors.phoneNumber
    ) {
      try {
        console.log(formData)

        if (registerType === "customer") {
          const response = await customerJoin(formData);
          showModalWindow(
            "회원가입 성공",
            "회원가입이 성공적으로 완료되었습니다."
          );
        } else if (registerType === "pb") {
          const response = await pbJoin(formData);
          showModalWindow(
            "회원가입 성공",
            "PB 회원가입이 성공적으로 완료되었습니다."
          );
        }
      } catch (error) {
        showModalWindow("회원가입 실패", "양식에 맞게 입력해주세요.");
      }
    }
  };

  // 로그인 페이지로 이동하는 함수 (PB 회원가입 시)
  const goToLoginPage = () => {
    navigate("/loginpage"); // 로그인 페이지로 이동
  };

  // 마이데이터 가입하기 페이지로 이동하는 함수 (고객 회원가입 시)
  const goToMyDataPage = () => {
    navigate("/customer/mydatajoin"); // 마이데이터 가입하기 페이지로 이동
  };

  // 모달 창을 띄우는 함수
  const showModalWindow = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="register2-container">
      <h1 className="register2-title">피클 로고</h1>

      <div className="register2-toggle">
        <button
          className={`toggle-btn ${
            registerType === "customer" ? "active" : ""
          }`}
          onClick={() => handleRegisterTypeChange("customer")}
        >
          고객으로 회원가입
        </button>
        <button
          className={`toggle-btn ${registerType === "pb" ? "active" : ""}`}
          onClick={() => handleRegisterTypeChange("pb")}
        >
          PB로 회원가입
        </button>
      </div>

      <div className="register2-form">
        {registerType === "customer" ? (
          <>
            <div className="form2-group">
              <input
                type="text"
                placeholder="아이디"
                name="userid"
                value={formData.userid}
                onChange={handleInputChange}
                className="register2-input"
              />
              <input
                type="password"
                placeholder="비밀번호"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="register2-input"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
            <input
              type="text"
              placeholder="이름"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="register2-input"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
            <input
              type="text"
              placeholder="전화번호"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="register2-input"
            />
            {errors.phoneNumber && (
              <p className="error-text">{errors.phoneNumber}</p>
            )}
            <input
              type="email"
              placeholder="이메일"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="register2-input"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </>
        ) : (
          <>
            <div className="form2-group">
              <input
                type="text"
                placeholder="사번"
                name="pbNumber"
                value={formData.pbNumber}
                onChange={handleInputChange}
                className="register2-input"
              />
              <input
                type="password"
                placeholder="비밀번호"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="register2-input"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
            <input
              type="text"
              placeholder="이름"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="register2-input"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
            <input
              type="text"
              placeholder="전화번호"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="register2-input"
            />
            {errors.phoneNumber && (
              <p className="error-text">{errors.phoneNumber}</p>
            )}
            <input
              type="text"
              placeholder="소속 지점"
              name="branchOffice"
              value={formData.branchOffice}
              onChange={handleInputChange}
              className="register2-input"
            />
          </>
        )}
        <button className="register2-btn" onClick={handleRegister}>
          회원가입
        </button>
        </div>
        <p className="signup-link" onClick={goToLoginPage}>
        피클 홈페이지에서 로그인
      </p>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent.message}</p>
        </Modal.Body>
        <Modal.Footer>
          {registerType === "customer" ? (
            <Button variant="primary" onClick={goToMyDataPage}>
              마이데이터 가입하러 가기
            </Button>
          ) : (
            <Button variant="primary" onClick={goToLoginPage}>
              로그인 페이지로 이동
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
