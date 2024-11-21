import React from 'react';
import './TermsModal.css';

const TermsModal = ({ show, onHide, onAgree }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>이용약관</h2>

        </div>
        <div className="modal-body">
          <div className="terms-content">
            <h5>서비스 이용약관</h5>
            <p>
              제1조 (목적)<br/>
              이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br/><br/>
              
              제2조 (용어의 정의)<br/>
              1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.<br/>
              2. "회원"이란 이 약관에 동의하고 서비스를 이용하는 사용자를 말합니다.<br/><br/>
              
              제3조 (약관의 효력과 변경)<br/>
              1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 적용됩니다.<br/>
              2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공시합니다.<br/><br/>
              
              제4조 (개인정보보호)<br/>
              회사는 관련법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onHide}>취소</button>
          <button onClick={onAgree} className="agree-button">동의</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;