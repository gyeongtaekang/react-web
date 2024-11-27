import React from 'react';
import './TermsModal.css';

const TermsModal = ({ show, onHide, onAgree }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onHide}></div>
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative z-10 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">이용 약관</h2>
        <div className="text-gray-700 mb-4 space-y-4 max-h-96 overflow-y-auto">
          <p>
            <strong>제1조 (목적)</strong><br/>
            이 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            <strong>제2조 (용어의 정의)</strong><br/>
            1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.<br/>
            2. "회원"이란 이 약관에 동의하고 서비스를 이용하는 사용자를 말합니다.
          </p>
          <p>
            <strong>제3조 (약관의 효력과 변경)</strong><br/>
            1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 적용됩니다.<br/>
            2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공시합니다.
          </p>
          {/* 추가 약관 내용 */}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={onAgree}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;